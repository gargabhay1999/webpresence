import boto3
import json

# Initialize DyanmoDB client
dynamodb = boto3.client("dynamodb")


def lambda_handler(event, context):
    # Get user ID from event
    user_email = event["user_email"]

    # Get auth token from event
    auth_token = event["auth_token"]

    # Get interval preference from event
    interval = event["interval"]

    # Store user preference in DynamoDB
    dynamodb.put_item(
        TableName="user-preferences-webpresence",
        Item={
            "user_email": {"S": user_email},
            "auth_token": {"S": auth_token},
            "interval": {"N": interval},
        },
    )

    # Response to be returned by API Gateway
    message = (
        f"User preference for {user_email} has been set to {interval} successfully."
    )
    api_response = {
        "statusCode": 200,
        "body": json.dumps(message),
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",  # CORS policy matches API Gateway configuration
        },
    }

    return api_response
