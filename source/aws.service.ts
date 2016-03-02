import {Injectable} from 'angular2/core';

declare var FB: any;
declare var AWS: any;

@Injectable()
export class AWSService {
    
    public signIn(): void {
        FB.login(function (response) {
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
        });
    }
}