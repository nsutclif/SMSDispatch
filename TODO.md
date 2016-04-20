# Project

* Move the Cognito Pool out of my personal account.

# Testing

* Come up with a set of representative tests

Groups:
- Course group (biggest) 100?
- Food Service (not registered?) 10?
- First Aid 10-20
- Water Stations: 30

# Bugs

need to validate phone numbers in form.
also need to write sync event handlers. (at least partially done)

without those, any bad data in browser local storage completely borks us.

What about duplicate phone numbers?

The first time I add a contact, I get a weird "synchronize failed" error but it seems to synchronize after I add the second contact.
Sometimes when I log in, the contacts fail to synchronize.  Possibly because I was doing a slow upload?  It doesn't seem to retry.

# Performance

* Need to at least prevent client from requesting map files.

# Features

## Messages

* Display messages!
* Send a message to a group (maybe a popup by the phone field?)
* Progress/success/error indicator for dispatch feature?
* Reply to a message
* When forwarding a message, include the original phone number (refer to Terry's email?) with "SMS:" prefix
* Add contact for message

## Contact Management

* Name column before phone column in contacts grid
* Edit Contacts
* Search and sort
* Import/export contacts

# Improve Login

Investigate Auth Zero
https://github.com/auth0/auth0-s3-sample
https://auth0.com/authenticate/angular2/aws-addon

Authenticating into Twilio

# Security

* Enable signing on API Gateway?
* Prevent XSS for user-entered data
http://martinfowler.com/articles/web-security-basics.

# Cleanup

* replace JSON.parse(JSON.stringify) with Assign.
* My use of promises is a mess

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