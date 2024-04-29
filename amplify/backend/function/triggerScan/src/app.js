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
const { exec } = require('child_process');
const fs = require('fs');
const AWS = require('aws-sdk');

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

app.get('/trigger-scan', async function (req, res) {
  // Add your code here
  const { email } = req.query;
  console.log("Making mosint scan for :", email);

  const command = `/var/task/mosint-x86_64 ${email} -s -o /tmp/output.json -c /var/task/config.yaml`;
  console.log("Executing command:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return res.status(500).json({ error: 'Failed to execute scan' });
    }

    fs.readFile('/tmp/output.json', 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        return res.status(500).json({ error: 'Failed to read scan data' });
      }

      const scanData = JSON.parse(data);
      const params = {
        TableName: 'webpresence-scan-storage',
        Item: {
          'user_email': email,
          'timestamp': Date.now().toString(),
          'scan_data': JSON.stringify(scanData)
        }
      };

      dynamodb.put(params, (err, data) => {
        if (err) {
          console.error(`DynamoDB error: ${err}`);
          return res.status(500).json({ error: 'Failed to store scan data' });
        }

        return res.json({ scanData });
      });

    });
  });
});

app.get('/trigger-scan/*', function (req, res) {
  // Add your code here
  res.json({ success: 'get call succeed!', url: req.url });
});

/****************************
* Example post method *
****************************/

app.post('/trigger-scan', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
});

app.post('/trigger-scan/*', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
});

/****************************
* Example put method *
****************************/

app.put('/trigger-scan', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

app.put('/trigger-scan/*', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
});

/****************************
* Example delete method *
****************************/

app.delete('/trigger-scan', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url });
});

app.delete('/trigger-scan/*', function (req, res) {
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
