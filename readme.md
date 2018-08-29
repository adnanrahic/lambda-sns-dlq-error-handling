<img src="https://raw.githubusercontent.com/adnanrahic/cdn/master/trigger-lambda-sns/sls-aws-lambda-sns3.png" width="100%">

# Trigger AWS Lambda with SNS with DLQ error handling 
Sample project for showing the ability to publish an SNS topic and trigger a function from the topic. Code is structured to create a timeout/crash so the dead letter queue SNS topic gets published, in turn triggering the error handler function.

### Explanation

- The `init` function is the only exposed function, which is hooked up to API Gateway. It takes a single `number` parameter which it validates, upon success it publishes an SNS topic and sends along the `number` value.
- The SNS topic will trigger a second function called `calculate`. This function will perform the calculation and log out the result to the console. This mimics a heavy computational background task such as data processing, image manipulation or machine learning calculations.
- If either of the two functions fail the dead letter queue SNS topic will receive a message and trigger the `error` function.

Every function will try to retry its execution upon failure a total of 3 times. Using the dead letter queue as a pool for your error logs is a smart use-case.

### Causing a crash
Adding a crazy huge number will trigger a factorial calculation that'll crash because of a `Maximum call stack size exceeded` rangeError.

```bash
curl -H "Content-Type: application/json" \
  -d '{"number":10000000}' \
  https://<id>.execute-api.<region>.amazonaws.com/dev/init
```

This will trigger the `error` function where you can handle the error as you wish.

---

The service is only a basic proof of concept which shows the use case of SNS triggering lambda functions and dead letter queues. The actual code is trivial and not exciting at all, but it serves the sole purpose of explaining what the *@$# is going on. :smile:

--- 

### TODO
- add SQS resources
- create setup where DLQ uses SQS
- create stream between `init` and `calculate` with SQS
- add SSM params instead of `secrets.json`
