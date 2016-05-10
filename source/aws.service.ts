import {Injectable} from 'angular2/core';

declare var FB: any;
declare var AWS: any;

@Injectable()
export class AWSService {
    
    // TODO: Define some types for this thing:    
    private syncClient: any;
     
    public signIn(): Promise<void> {
        let self = this;
        
        return new Promise<void>((resolve,reject) => {
            FB.login(function (response) {
                if (response.authResponse) {
                    // http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/browser-configuring.html
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: "us-east-1:9a275a9a-9fcd-49ff-a164-057e646e8f92",
                        Logins: {
                            'graph.facebook.com': response.authResponse.accessToken 
                        }
                    });
                    
                    // Cognito isn't available in all regions so we're stuck with us-east-1
                    AWS.config.region = 'us-east-1';
                    
                    // fbUserId = response.authResponse.userID;
                    // button.style.display = 'block';

                    AWS.config.credentials.get(() => {
                        self.syncClient = new AWS.CognitoSyncManager();
                        resolve();
                    });                    
                }
                else {
                    reject(new Error('User cancelled login'));
                }
            });            
        });
    }
    
    public signedIn(): boolean {
        return (typeof this.syncClient !== 'undefined');
    }
        
    public openOrCreateDataset(datasetName: string): Promise<any> {
        let self = this;

        return new Promise<any>((resolve,reject) => {
            self.syncClient.openOrCreateDataset(datasetName, (err, dataset: any) => {
                if(err) {
                    reject(err);
                }
                else {
                    dataset.logger = (error) => {console.log(error)};
                    resolve(dataset);
                }
            });
        });
    }
    
    public syncDataset(dataset: any): Promise<void> {
        console.log('syncDataset');
        return new Promise<void>((resolve,reject) => {
            dataset.synchronize(
                {
                    onSuccess: (dataset, updates) => {
                        resolve();
                        console.log('onSuccess.'); 
                    },
                    onFailure: (err) => {
                        console.log('onFailure: ' + err);
                        reject(err);
                    },
                    onConflict: (dataset, conflicts, callback) => {
                        console.log('onConflict');
                        let resolved = [];
                        conflicts.map((conflict) => {
                            // For now, just go with remote record.
                            console.log('conflict: ' + conflict);
                            resolved.push(conflict.resolveWithRemoteRecord());
                        });
                        dataset.resolve(resolved, () => {
                            return callback(true);
                        });
                    }
                });
        });
    }
}