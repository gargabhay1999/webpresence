export type AmplifyDependentResourcesAttributes = {
  "api": {
    "test": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "webpresence": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    }
  },
  "auth": {
    "webpresence7f7a11b9": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "userFunction": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "imagestorage": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}