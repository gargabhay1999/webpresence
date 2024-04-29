import json
import boto3
from boto3.dynamodb.conditions import Key

def handler(event, context):
  print('received event:')
  print(event)
  
  dynamodb = boto3.resource("dynamodb")
  user_email = event["params"]["querystring"]["email"]
  print("making query to dynamodb for:", user_email)

  table = dynamodb.Table('webpresence-scan-storage')

  response = table.query(
        KeyConditionExpression=Key('user_email').eq(user_email)
    )
  print(response)
  
  items = response['Items']
  
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(items)
  }