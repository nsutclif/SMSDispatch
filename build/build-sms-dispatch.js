'use strict';

// instaling NPM packages on read-only file system:
// https://github.com/npm/npm/issues/12418

// Figuring out which packages are installed in Lambda:
// https://gist.github.com/royingantaginting/4499668

// running git in Lambda:
// http://stackoverflow.com/questions/37280287/running-git-in-aws-lambda

// Installing a newer version of NPM in Lambda:
// http://www.ruempler.eu/2016/07/19/how-to-install-and-use-a-newer-version-3-x-of-npm-on-aws-lambda/

const AWS = require('aws-sdk');
const fs = require('fs');

const exec = require('child_process').exec;

function runProcessPromise(command) {
    return new Promise((resolve, reject) => {
        const process = exec(command, (error) => {
            if (error) {
                reject(error);
            } else {
                console.log(command + ' ran successfully.');
                resolve();
            }
        });
        process.stdout.on('data', console.log);
        process.stderr.on('data', console.error);
    });
}

function s3GetObject(bucket, key, localPath) {
    return new Promise((resolve, reject) => {
        // console.log('getting to: ' + localPath);
        
        const localFileStream = fs.createWriteStream(localPath);
        const s3 = new AWS.S3({signatureVersion: "v4"});
        
        s3.getObject({Bucket: bucket, Key: key})
            .createReadStream()
            .on('error', reject)
            .pipe(localFileStream)
            .on('error', reject)
            .on('close', resolve);
        
    });
}

function s3PutObject(localPath, bucket, key) {
    console.log('putting: ' + localPath);
    const s3 = new AWS.S3({signatureVersion: "v4"});
    
    const localFileStream = fs.createReadStream(localPath);
    return s3.putObject({Body: localFileStream, Bucket: bucket, Key: key}).promise();
}

function readDirPromise(path) {
    return new Promise((resolve,reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
            }
            else {
                if (!path.endsWith('/')) {
                    path = path + '/';
                }
                let fullFilePaths = files.map((file) => {
                    return path + file;
                });
                resolve(fullFilePaths);
            }
        });
    });
}

function isDirectoryPromise(path) {
    return new Promise((resolve,reject) => {
        // console.log('about to call fs.stat()')
        fs.stat(path, (err, stats) => {
            if (err) {
                // console.log(err);
                reject(err);
            }
            else {
                // console.log(stats);
                resolve(stats.isDirectory());
            }
        });
    });
}

function s3PutDirectory(localPath, bucket, keyPrefix) {
    console.log('putting directory: ' + localPath);
    
    // function listDirectoryRecursive(path) {
    //     // function processFile(path) {
    //     //     const isDirPromise = isDirectoryPromise(file);
            
    //     //     return isDirPromise.then((isDirectory) => {
                
    //     //     });
    //     // }
        
    //     console.log('listDirectoryRecursive: ' + path);
        
    //     return readDirPromise(localPath).then((fullFilePaths) => {
    //         // files.map((file) => {
    //         //     // left off here.  check if it's a directory and go recursive.
    //         //     isDirectoryPromise(file)
    //         // });

    //         // console.log('full paths: ' + fullFilePaths);
            
    //         return fullFilePaths.reduce((promise, item) => {
    //             // console.log('processing: ' + item);
                
    //             // There's something wrong with this promise chain.  If an error 
    //             // happens in isDirectoryPromise(), it doesn't bubble up and get reported anywhere.

    //             return promise.then(() => {
    //                 // console.log('got to promise.then()');

    //                 // console.log('looking at ' + item);
                    
    //                 return isDirectoryPromise(item).then((isDirectory) => {
    //                     if (isDirectory) {
    //                         console.log('Dir: ' + item);
    //                         return listDirectoryRecursive(item);
    //                     }
    //                     else {
    //                         console.log('File: ' + item);
    //                         return Promise.resolve();
    //                     }
    //                 });
    //             });
    //         }, Promise.resolve());
    //     });
    // }
    function listDirectoryRecursive(path) {
        let result = [];
        if (!path.endsWith('/')) {
            path = path + '/';
        }
        let files = fs.readdirSync(path);

        files.map((file) => {
            let fullPath = path + file;
            let fileStat = fs.statSync(fullPath);
            if (fileStat.isDirectory()) {
                Array.prototype.push.apply(result, listDirectoryRecursive(fullPath));
            }
            else {
                result.push(fullPath);
            }
        });
        return result;
    }
    
    let filesToSend;
    try {
        filesToSend = listDirectoryRecursive(localPath);
    } catch (error) {
        return Promise.reject(error);
    }

    return filesToSend.reduce((promise, file) => {
        return promise.then(() => {
            s3PutObject(file, bucket, keyPrefix + file);
            // return new Promise((resolve, reject)=> {
            //     setTimeout(() => {
            //         console.log('sent file ' + file);
            //         resolve();
            //     }, 500);
            // });
        });
    }, Promise.resolve());
}

exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(context));
    
    const pipelineJob = event["CodePipeline.job"];
    const jobId = pipelineJob.id;
    const codepipeline = new AWS.CodePipeline();
    function putJobSuccess(message) {
        var params = {
            jobId: jobId
        };
        codepipeline.putJobSuccessResult(params, function(err, data) {
            if(err) {
                context.fail(err);      
            } else {
                context.succeed(message);      
            }
        });
    }
    
    // Notify AWS CodePipeline of a failed job
    function putJobFailure(message) {
        var params = {
            jobId: jobId,
            failureDetails: {
                message: JSON.stringify(message),
                type: 'JobFailed',
                externalExecutionId: context.invokeid
            }
        };
        codepipeline.putJobFailureResult(params, function(err, data) {
            context.fail(message);      
        });
    }
    
    // if (!event.cmd) {
    //     return callback('Please specify a command to run as event.cmd');
    // }
    // const child = exec(event.cmd, (error) => {
    //     // Resolve with result of process
    //     callback(error, 'Process complete!');
    // });

    // // Log process stdout and stderr
    // child.stdout.on('data', console.log);
    // child.stderr.on('data', console.error);
    
    const inputArtifact = pipelineJob.data.inputArtifacts[0];
    const inputArtifactBucket = inputArtifact.location.s3Location.bucketName;
    const inputArtifactKey = inputArtifact.location.s3Location.objectKey;
    const inputArtifactHash = inputArtifact.revision;
    const inputArtifactFileName = inputArtifactKey.replace(/^.*[\\\/]/, ''); // grab the last part of the path
    const projectTempDir = '/tmp/' + inputArtifactFileName.replace(/\.[^/.]+$/, ''); // remove extension

    // use the provided credentials
    // AWS.config.update(pipelineJob.data.artifactCredentials);
    
    runProcessPromise('npm --v')
        .then(() => {
            // return runProcessPromise('rpm -qa | sort'); // What's installed in Lambda?
        })
        .then(() => {
            // return runProcessPromise('ls /tmp/');
        })
        .then(() => {
            // return s3GetObject(inputArtifactBucket, inputArtifactKey, '/tmp/' + inputArtifactFileName);
        })
        .then(() => {
            // return runProcessPromise('ls /tmp/');
        })
        .then(() => {
            // return runProcessPromise('unzip /tmp/' + inputArtifactFileName + ' -d ' + projectTempDir);
        })
        .then(() => {
            // return runProcessPromise('ls -R /tmp/');
        })
        .then(() => {
            // TODO: This seems too slow.  Update to a new version of NPM?
            
            // Errors like this mean you ran out of memory:
            // /bin/sh: line 1:    25 Killed                  npm install
            // return runProcessPromise('cd ' + projectTempDir + " && export HOME='/tmp' && npm install");
        })
        .then(() => {
            // return runProcessPromise('cd ' + projectTempDir + " && export HOME='/tmp' && npm run tsc");
        })
        .then(() => {
            // s3PutDirectory(projectTempDir, 'sms-dispatch-built', inputArtifactHash + '/');
            return s3PutDirectory('/Users/nsutcliffe/Documents/Source/SMSDispatch/apiGateway-js-sdk', 'sms-dispatch-built', inputArtifactHash + '/');
        })
        .then(() => {
            console.log('returning success...');
            putJobSuccess('Success');
        })
        .catch((error) => {
            console.log('returning error...' + error);
            putJobFailure(error);
        });
    
    // aws s3 cp test.txt s3://mybucket/test2.txt
};
