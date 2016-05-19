# Preparation

ASAP
* Confirm computer

* May 17 (day before)
* TH will clear out messages
* Make sure we can log into "live"/production account: "Test 1"
* TH will set up leaders

* May 28 (day before)
* TH may clear out messages again?


# Project

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
 -> Try logging in after clearing the cache.


** If there's an exception sorting the contacts, everything goes off the rails.
** MissingRequiredParameter: Missing required key 'IdentityId' in params error - looks like a problem logging into Cognito
** https://mobile.awsblog.com/post/TxBVEDL5Z8JKAC/Use-Amazon-Cognito-in-your-website-for-simple-AWS-authentication


# Performance

* Need to at least prevent client from requesting map files. (maybe they're not if developer tools aren't displayed?)

# Features

## AWS
* Check billing

## Testing

* Test on other computers/devices/browsers
* Load Testing for incoming 
* Test with and without "prod mode" (boot.ts)

## Messages

## Contact Management

* Either show the leaders first or have a toggle to *show leaders only.*
* Improve handling of duplicate phone numbers.
* Deleting contacts doesn't seem to work.
* That issue with contacts not appearing the first time logging on to the system with a new acct.  Refresh and everything then works fine
* Edit Contacts (example: make someone a leader) (later)
* Import/export contacts (nope)

## Configuration

# Security

* Enable signing on API Gateway?
* Prevent XSS for user-entered data
http://martinfowler.com/articles/web-security-basics.

# Improve Login

Investigate Auth Zero

https://github.com/auth0/auth0-s3-sample
https://auth0.com/authenticate/angular2/aws-addon

Authenticating into Twilio

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