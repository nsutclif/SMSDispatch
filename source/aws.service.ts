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
                        IdentityPoolId: "us-east-1:66b8e8b8-c6a3-4d80-9d9c-e939c814f0b7",
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
                    resolve(dataset);
                }
            });
        });
    }
    
    public syncDataset(dataset: any): Promise<void> {        
        return new Promise<void>((resolve,reject) => {
            dataset.synchronize(
                {
                    onSuccess: (dataset, updates) => {
                        console.log('synchronized.'); 
                        resolve();
                    },
                    onFailure: (err) => {
                        reject(err);
                    }
                    // TODO: Write an onConflict handler.
                }, 
                false);
        });
    }
}