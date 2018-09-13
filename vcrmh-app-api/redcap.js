const AWS = require('aws-sdk');
const got = require('got');
const uuid = require('uuid');
import processSurveyQuestions from './lib/surveyProcessor';

AWS.config.update({region: "us-east-2"});

export const getREDCapSurvey = async (event, context, callback) => {
  let response = {};
  let group = null;
  let role = null;
  let user = null;
  let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  let dynamoDB = new AWS.DynamoDB.DocumentClient();

  var params = {
    UserPoolId: 'us-east-2_HSTmUYQE8',
    Username: event.username
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
          ProjectionExpression: "studyId,surveyId,surveyObject,friendlyName",
          TableName: "dev-surveys"
        }
  
        let result = await dynamoDB.query(queryParams).promise();
  
        console.log(result);
  
        response = {
          statusCode: 200,
          body: JSON.stringify({
            message:'Retrieved data.',
            items: result.Items
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

export const fetchREDCapSurvey = async (event, context, callback) => {
  let response = {};
  let group = null;
  let role = null;
  let user = null;
  let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  let dynamoDB = new AWS.DynamoDB.DocumentClient();

  var params = {
    UserPoolId: 'us-east-2_HSTmUYQE8',
    Username: event.username
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
        // First, find the survey we are fetching the data for.
        const queryParams = {
          ExpressionAttributeValues: {
            ":surveyId": event.arguments.surveyId,
            ":studyId": event.arguments.studyId
          },
          KeyConditionExpression: "surveyId=:surveyId AND studyId=:studyId",
          ProjectionExpression: "studyId,surveyId,apiKey",
          TableName: "dev-surveys"
        }
  
        let result = await dynamoDB.query(queryParams).promise();

        if (result.Count === 1) {
          let apiKey = result.Items[0].apiKey;
          // First get and process the survey data.
          // console.log("attempting got()");
          let data = await got('https://redcap.vanderbilt.edu/api/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `token=${apiKey}&content=metadata&format=json&returnFormat=json`
          });

          let jsonData = JSON.parse(data.body);

          let survey = processSurveyQuestions(jsonData);

          console.log(survey);

          const params = {
            ExpressionAttributeNames: {
              "#SO": "surveyObject"
            },
            ExpressionAttributeValues: {
              ":survey": survey
            },
            Key: {
              "studyId": event.arguments.studyId,
              "surveyId": event.arguments.surveyId
            },
            TableName: "dev-surveys",
            ReturnConsumedCapacity: "TOTAL",
            UpdateExpression: "SET #SO=:survey"
          }
    
          result = await dynamoDB.update(params).promise();
    
          response = {
            statusCode: 200,
            body: JSON.stringify({
              message:'Retrieved data and stored it in the survey DynamoDB table.',
            }),
          }
        } else {
          response = {
            statusCode: 401,
            body: JSON.stringify({
              message:'Not a valid survey item.'
            }),
          }
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

export const getAllREDCapSurveys = async (event, context, callback) => {
  let response = {};
  let group = null;
  let role = null;
  let user = null;
  let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  let dynamoDB = new AWS.DynamoDB.DocumentClient();

  try {
    const params = {
      ProjectionExpression: "surveyId, studyId, apiKey",
      TableName: "dev-surveys",
      ReturnConsumedCapacity: "TOTAL"
    }
  
    let result = await dynamoDB.scan(params).promise();

    console.log(result);

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message:'Retrieved data.',
      }),
    }

    callback(null, response);
  } catch (e) {
    console.log(e, e.stack);
  }
}

