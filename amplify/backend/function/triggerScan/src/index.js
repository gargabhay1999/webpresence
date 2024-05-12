const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const AWS = require('aws-sdk');
const { triggerscan } = require('./utility');


const dynamodb = new AWS.DynamoDB.DocumentClient();
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

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  if (event['detail-type'] === 'Scheduled Event') {
    const subscribedUsers = await fetchSubscribedUsersInBatches();
    for (const batch of subscribedUsers) {
      await Promise.all(batch.map(async user => {
        console.log("user info: ", user);
        const scanData = await triggerscan(user.user_email);
        return scanData;
      }
      ));
    }
  }
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
