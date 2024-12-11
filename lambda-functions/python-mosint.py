#!/usr/bin/python3
import subprocess 
import json
import boto3
import time

def lambda_handler(event, context):
    # extract params
    print(event)
    user_email = event["params"]["querystring"]["email"]

    # run tool and get data
    result = subprocess.run(["./mosint-x86_64", user_email, "-s", "-o",
                             "/tmp/output.json", "-c", "config.yaml"])
    # result = subprocess.run(["/Users/mayank/go/bin/mosint", "test@gmail.com", "-s", "-o",
                            # stdout=subprocess.DEVNULL,
                            # stderr=subprocess.DEVNULL)
    if result.returncode == 0:
        with open("/tmp/output.json", 'r') as f:
            data = json.loads(f.read())
            # Initialize DyanmoDB client
            dynamodb = boto3.client("dynamodb")
            # Store user preference in DynamoDB
            timestamp = str(int(time.time()))
            dynamodb.put_item(
                    TableName="webpresence-scan-storage",
                    Item={
                        "user_email": {"S": user_email},
                        "timestamp": {"S": timestamp},
                        "scan_data": {"S": json.dumps(data)},
                        },
                    )
            return data
    else:
        print("failed to get scan results", result.returncode)
        return result

if __name__ == "__main__":
    event = {}
    context = {}
    lambda_handler(event, context)


