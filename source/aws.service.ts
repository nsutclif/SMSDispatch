import {Injectable} from '@angular/core';

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
                            console.log('conflict: ' + JSON.stringify(conflict));
                            // In my testing, if I deleted a record and then deleted another record,
                            // I would get a sync conflict on the second record.  Not sure why.
                            // The date of the record for the deleted data would be more recent.
                            // For now, just go with most recent record.
                            if (conflict.remoteRecord.LastModifiedDate > conflict.localRecord.LastModifiedDate) {
                                console.log('resolving with remote');
                                resolved.push(conflict.resolveWithRemoteRecord());
                            } else {
                                console.log('resolving with local');
                                resolved.push(conflict.resolveWithLocalRecord());
                            }
                        });
                        dataset.resolve(resolved, () => {
                            return callback(true);
                        });
                    }
                });
        });
    }
}