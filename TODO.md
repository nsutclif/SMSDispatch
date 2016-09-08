# Project

# Testing

# Bugs

* Intermittent Twilio callback failure - when the server asks for more info about the message it just got (server side?)
* Validate phone numbers for new contacts.  Previously, any bad data in browser local storage completely borked us.
* After switching accounts, the contacts don't show up properly (?)
* Occasional error logging in (maybe the same as above?)
  * MissingRequiredParameter: Missing required key 'IdentityId' in params error - looks like a problem logging into Cognito
  * https://mobile.awsblog.com/post/TxBVEDL5Z8JKAC/Use-Amazon-Cognito-in-your-website-for-simple-AWS-authentication
* Is the following all fixed?

  The first time I add a contact, I get a weird "synchronize failed" error but it seems to synchronize after I add the second contact.
Sometimes when I log in, the contacts fail to synchronize.  Possibly because I was doing a slow upload?  It doesn't seem to retry.
 -> Try logging in after clearing the cache.


# Performance

* Improve deployment.  Use System.js to build for deployment?

# Features

## Messages

* Send to a list of groups
* When adding to a group, present a dropdown of existing groups
* Calculate and cache thumbnails for the MMS images.

## Contact Management

* Either show the leaders first or have a toggle to *show leaders only.*
* Improve handling of duplicate phone numbers.
* That issue with contacts not appearing the first time logging on to the system with a new acct.  Refresh and everything then works fine
* Import/export contacts (nope)

## Configuration

# Security

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