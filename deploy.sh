#/bin/bash
aws s3 sync . s3://sms-dispatch --exclude "*" --include "index.html" --delete --profile smsdispatch
aws s3 sync app s3://sms-dispatch/app --delete --profile smsdispatch
aws s3 sync node_modules s3://sms-dispatch/node_modules --delete --profile smsdispatch
