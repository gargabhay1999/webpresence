const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda({ region: 'us-east-1' });
const batchSize = 10;

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app);


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

const triggerScanLambda = async (email, event) => {
  console.log(`Triggering alert -> scan for email ${email}`);
  const params = {
    FunctionName: 'arn:aws:lambda:us-east-1:767397693070:function:triggerScan-staging', // Name of the second Lambda function
    InvocationType: 'Event', // Asynchronous invocation
    Payload: JSON.stringify({
      httpMethod: 'GET',
      path: '/trigger-scan', // Specify the path you want to call
      queryStringParameters: { "email": email } // Add any query parameters if needed
    })
  };
  try {
    console.log('Invoking triggerScan-staging with params: ', params);
    await lambda.invoke(params).promise();
    console.log('Invoked triggerScan-staging');
    const response = {
      statusCode: 200,
      body: JSON.stringify('Hello from Lambda test1! Invoked test2.'),
    };
    console.log('Response: ', response);
    return response;
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify('Error invoking test2'),
    };
  }
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const subscribedUsers = await fetchSubscribedUsersInBatches();

  for (const batch of subscribedUsers) {
    await Promise.all(batch.map(async user => {
      console.log("user info: ", user);
      await triggerScanLambda(user.user_email, event)
    }
    ));
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda triggerAlert!'),
  };
  console.log("response: ", response);
  return response;
  // Payload: JSON.stringify(event), // Pass event data if needed
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
