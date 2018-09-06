const AWS = require('aws-sdk');
const got = require('got');
import processSurveyQuestions from './lib/surveyProcessor';

AWS.config.update({region: "us-east-2"});

export const getREDCapSurveys = async (event, context, callback) => {
  let response = {};
  let group = null;
  let role = null;
  let user = null;
  let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  let dynamoDB = new AWS.DynamoDB.DocumentClient();

  var params = {
    UserPoolId: 'us-east-2_HSTmUYQE8',
    Username: event.arguments.userId
  };

  try {
    user = await cognitoidentityserviceprovider.adminGetUser(params).promise();

    for (let i = 0; i < user.UserAttributes.length; i++) {
      if (user.UserAttributes[i].Name === "custom:unsecureGroup") {
        group = user.UserAttributes[i].Value;
      }
      if (user.UserAttributes[i].Name === "custom:unsecureRole") {
        role = user.UserAttributes[i].Value;
      }
    }

    if (group !== null && role !== null) {
      if (role === 'admin') {
        const queryParams = {
          ExpressionAttributeValues: {
            ":study": event.arguments.studyId
          },
          KeyConditionExpression: "studyId=:study",
          ProjectionExpression: "studyId,surveyId,surveyObject",
          TableName: "dev-surveys"
        }
  
        let result = await dynamoDB.query(queryParams).promise();
  
        console.log(result);
  
        response = {
          statusCode: 200,
          body: JSON.stringify({
            message:'Retrieved data.',
            items: result.Items[0]
          }),
        }
      } else {
        response = {
          statusCode: 403,
          body: JSON.stringify({
            message:'You do not have access permissions to perform this action.'
          }),
        }
      }
    } else {
      response = {
        statusCode: 400,
        body: JSON.stringify({
          message:'Could not determine group id or role.'
        }),
      }
    }

    callback(null, response);

  } catch (e) {
    console.log(e, e.stack);
  }
}

export const fetchREDCapSurveys = async (event, context, callback) => {
  let response = {};
  let group = null;
  let role = null;
  let user = null;
  let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  let dynamoDB = new AWS.DynamoDB.DocumentClient();

  var params = {
    UserPoolId: 'us-east-2_HSTmUYQE8',
    Username: event.arguments.userId
  };

  try {
    user = await cognitoidentityserviceprovider.adminGetUser(params).promise();

    for (let i = 0; i < user.UserAttributes.length; i++) {
      if (user.UserAttributes[i].Name === "custom:unsecureGroup") {
        group = user.UserAttributes[i].Value;
      }
      if (user.UserAttributes[i].Name === "custom:unsecureRole") {
        role = user.UserAttributes[i].Value;
      }
    }

    if (group !== null && role !== null) {
      if (role === 'admin') {
        // First get and process the survey data.
        // console.log("attempting got()");
        let data = await got('https://redcap.vanderbilt.edu/api/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'token=D8A360F8001D0530E30DBD6BAB0CAF4B&content=metadata&format=json&returnFormat=json'
        });

        let jsonData = JSON.parse(data.body);

        let survey = processSurveyQuestions(jsonData);

        const params = {
          Item: {
            "studyId": event.arguments.studyId,
            "surveyId": "SANJowLSiiA",
            "surveyObject": survey,
          },
          TableName: "dev-surveys",
          ReturnConsumedCapacity: "TOTAL"
        }
  
        let result = await dynamoDB.put(params).promise();
  
        response = {
          statusCode: 200,
          body: JSON.stringify({
            message:'Retrieved data and stored it in DynamoDB table.',
          }),
        }
      } else {
        response = {
          statusCode: 403,
          body: JSON.stringify({
            message:'You do not have access permissions to perform this action.'
          }),
        }
      }
    } else {
      response = {
        statusCode: 400,
        body: JSON.stringify({
          message:'Could not determine group id or role.'
        }),
      }
    }

    callback(null, response);

  } catch (e) {
    console.log(e, e.stack);
  }
}

