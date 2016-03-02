# Bugs

need to validate phone numbers in form.
also need to write sync event handlers.

without those, any bad data in browser local storage completely borks us.

What about duplicate phone numbers?

# Features

## Twilio config

* Account SID (really long strings)
* Auth Token (really long strings)
* Phone Number

## Contact Management

* Delete Contacts
* Edit Contacts

## Messages

* Add contact for message
* forward popup: display organizers group, individual organizers, volunteers group, but NOT individual volunteers.  Confirmation dialog to broadcast to a group?

# Improve Login

Investigate Auth Zero
https://github.com/auth0/auth0-s3-sample
https://auth0.com/authenticate/angular2/aws-addon

Lazy loading scheme for Contacts has problems with multiple simultaneous callers.  How about we just call it once when someone logs in?

Authenticating into Twilio

# Security

Prevent XSS for user-entered data
http://martinfowler.com/articles/web-security-basics.

# Links

## Promises
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
* https://promisesaplus.com/
* http://stackoverflow.com/questions/22519784/how-do-i-convert-an-existing-callback-api-to-promises

## Angular 2
* http://thejackalofjavascript.com/developing-a-mean-app-with-angular-2-0/

## Cognito
* low-level SDK:
  * http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoSync.html
* higher level sync client:
  * https://github.com/aws/amazon-cognito-js

## Other web apps that use AWS from the browser
* https://github.com/yegor86/spa-aws
* https://github.com/rpgreen/aws-recipes