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
const ses = new AWS.SES();

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


/**********************
 * Example get method *
 **********************/

app.get('/user-profile', async function (req, res) {
  console.log("GET request: ", req)
  const { email } = req.query;
  const params = {
    TableName: 'user-preferences',
    KeyConditionExpression: 'user_email = :email',
    ExpressionAttributeValues: {
      ':email': email
    },
  };
  try {
    const data = await dynamodb.query(params).promise();
    console.log("Query response:", data);
    res.status(200).json(data);
  } catch (err) {
    console.log("Error fetching :", err);
    res.status(500).json(err);
  }
});

app.get('/user-profile/check-email-verification', async function (req, res) {
  const { email } = req.query;
  try {
    console.log("Checking email verification for:", email);
    const data = await ses.getIdentityVerificationAttributes({
      Identities: [email]
    }).promise();
    // Check if the email address is verified
    const verificationAttributes = data.VerificationAttributes[email];
    const isVerified = verificationAttributes && verificationAttributes.VerificationStatus === 'Success';

    if(!isVerified) {
      console.log("Email not verified. Sending verification email to:", email);
      const response = await ses.verifyEmailIdentity({
        EmailAddress: email
      }).promise();

      console.log("Verification email sent:", response);
    }
    res.json({ isVerified });
  } catch (err) {
    console.log("Error fetching :", err);
    res.status(500).json(err);
  }
});

/****************************
* Example post method *
****************************/

app.post('/user-profile', async function (req, res) {
  const { email, isSubscribed } = req.body;
  console.log("Making post request to DynamoDB for:", email, isSubscribed);
  const params = {
    TableName: 'user-preferences',
    Item: {
      'user_email': email,
      'is_subscribed': isSubscribed
    }
  };
  const data = dynamodb.put(params).promise();
  console.log("Post response:", data);
  res.status(200).json(data);
  // res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/user-profile/*', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
});

/****************************
* Example put method *
****************************/

app.put('/user-profile', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

app.put('/user-profile/*', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

/****************************
* Example delete method *
****************************/

app.delete('/user-profile', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.delete('/user-profile/*', function (req, res) {
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
