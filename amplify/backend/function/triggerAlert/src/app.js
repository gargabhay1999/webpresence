/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1'
});

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda({ region: 'us-east-1' });

const batchSize = 10;
/**********************
 * Example get method *
 **********************/

app.get('/trigger-alert', async function (req, res) {
  // Add your code here
  const subscribedUsers = await fetchSubscribedUsersInBatches();

  for (const batch of subscribedUsers) {
    await Promise.all(batch.map(user => {
      console.log("user info: ", user);
      triggerScanLambda(user.user_email)
    }
    ));
  }
  res.json({ success: 'get call succeed!', url: req.url, subscribedUsers });
});

const fetchSubscribedUsersInBatches = async () => {
  let lastEvaluatedKey = null;
  let subscribedUsers = [];
  do {
    const params = {
      TableName: 'user-preferences',
      FilterExpression: 'is_subscribed = :is_subscribed',
      ExpressionAttributeValues: {
        ':is_subscribed': true
      },
      Limit: batchSize,
      ExclusiveStartKey: lastEvaluatedKey
    };

    const data = await dynamodb.scan(params).promise();
    subscribedUsers.push(data.Items);
    lastEvaluatedKey = data.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return subscribedUsers;
}

const triggerScanLambda = async (email) => {
  console.log(`Triggering alert -> scan for ${email}`);

  const params = {
    FunctionName: 'arn:aws:lambda:us-east-1:767397693070:function:triggerScan-staging',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify({})
  };
  try {
    // Invoke the Lambda function (F1)
    console.log('going to Invoked F1: ');
    const data = await lambda.invoke(params).promise();

    console.log('Invoked F1: ', data);
    
    // Handle the response from F1
    const responsePayload = JSON.parse(data.Payload);

    console.log('responsePayload: ', responsePayload);
    res.status(200).json(responsePayload);
  } catch (error) {
    // Handle errors
    console.error('Error invoking F1: ', error);
    console.log('Error invoking F1: ', error.message);
    res.status(500).send('Error invoking F1: ' + error.message);
  }
}

const triggerScanLambda_old = async (email) => {
  console.log(`Triggering alert -> scan for ${email}`);

  const params = {
    FunctionName: 'arn:aws:lambda:us-east-1:767397693070:function:triggerScan-staging',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify({
      httpMethod: 'GET',
      path: '/trigger-scan', // Specify the path you want to call
      queryStringParameters: { "email": email } // Add any query parameters if needed
    })
  };

  lambda.invoke(params, function (err, data) {
    console.log("invoking triggerScan-staging lambda");
    if (err) {
      console.log("Error: ", err);
    } else {
      console.log("Success: ", data);
    }
  });
}

app.get('/trigger-alert/*', function (req, res) {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url });
});

/****************************
* Example post method *
****************************/

app.post('/trigger-alert', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
});

app.post('/trigger-alert/*', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
});

/****************************
* Example put method *
****************************/

app.put('/trigger-alert', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

app.put('/trigger-alert/*', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

/****************************
* Example delete method *
****************************/

app.delete('/trigger-alert', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.delete('/trigger-alert/*', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
