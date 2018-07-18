import { resolve } from 'url';

const AWS = require('aws-sdk');

AWS.config.update({region: "us-east-2"});

export const createUser = async (event, context, callback) => {
  let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  // let iam = new AWS.IAM();
  let response = {};
  // console.log(event);
  // console.log(context);
  // iam.getUser({}, function(err, data) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(data);
  //   }
  // });
  if (event.arguments.input.email && event.arguments.input.role && event.arguments.input.group && event.arguments.input.name) {
    const newUser = {
      UserPoolId: "us-east-2_B9lu85cEB",
      Username: event.arguments.input.email,
      TemporaryPassword: 'Passw0rd!',
      DesiredDeliveryMediums: ["EMAIL"],
      UserAttributes: [
        {
          Name: 'email',
          Value: event.arguments.input.email
        },
        {
          Name: 'name',
          Value: event.arguments.input.name
        },
        {
          Name: 'custom:unsecureRole',
          Value: event.arguments.input.role
        },
        {
          Name: 'custom:unsecureGroup',
          Value: event.arguments.input.group
        },
      ]
    };
    const user = await cognitoidentityserviceprovider.adminCreateUser(newUser).promise();

    console.log(user.User);

    const groupParams = {
      GroupName: event.arguments.input.role === 'admin' ? "Admins" : "Researchers",
      Username: user.User.Username,
      UserPoolId: "us-east-2_B9lu85cEB"
    }

    const groupResult = await cognitoidentityserviceprovider.adminAddUserToGroup(groupParams).promise();

    console.log(groupResult);

    //console.log(event);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully attempted to create user.`
      }),
    };
  } else {
    response = {
      statusCode: 400,
      body: JSON.stringify({
        message: `Missing required parameters. Ensure that the params email, firstName, lastName, group, and role are all part of the POST body.`
      }),
    };
  }
  
  callback(null, response);
};

export const getStudies = async (event, context, callback) => {
  let response = {};
  let group = null;
  let user = null;
  let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  let dynamoDB = new AWS.DynamoDB.DocumentClient();

  var params = {
    UserPoolId: 'us-east-2_B9lu85cEB',
    Username: event.userId
  };

  try {
    user = await cognitoidentityserviceprovider.adminGetUser(params).promise();

    for (let i = 0; i < user.UserAttributes.length; i++) {
      if (user.UserAttributes[i].Name === "custom:unsecureGroup") {
        group = user.UserAttributes[i].Value;
        break;
      }
    }

    if (group !== null) {
      const queryParams = {
        ExpressionAttributeValues: {
          ":group": group.toString()
        },
        KeyConditionExpression: "groupId=:group",
        ProjectionExpression: "studyId,groupId,clinicalTrialsId,title,numOfParticipants,renewDate",
        TableName: "studies"
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
        statusCode: 400,
        body: JSON.stringify({
          message:'Could not determine group id.'
        }),
      }
    }

    callback(null, response);

  } catch (e) {
    console.log(e, e.stack);
  }
}

export const getStudy = async (event, context, callback) => {
  let response = {};
  let group = null;
  let role = null;
  let user = null;
  let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  let dynamoDB = new AWS.DynamoDB.DocumentClient();

  var params = {
    UserPoolId: 'us-east-2_B9lu85cEB',
    Username: event.userId
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
          ProjectionExpression: "studyId,groupId,clinicalTrialsId,title,numOfParticipants,renewDate",
          TableName: "studies"
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
      //   const queryParams = {
      //     ExpressionAttributeValues: {
      //       ":group": group.toString()
      //     },
      //     KeyConditionExpression: "groupId=:group",
      //     ProjectionExpression: "studyId,groupId,clinicalTrialsId,title,numOfParticipants,renewDate",
      //     TableName: "studies"
      //   }
  
      //   let result = await dynamoDB.query(queryParams).promise();
  
      //   console.log(result);
  
      //   response = {
      //     statusCode: 200,
      //     body: JSON.stringify({
      //       message:'Retrieved data.',
      //       items: result.Items[0]
      //     }),
      //   }
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

export const listParticipantsForStudy = async (event, context, callback) => {
  let response = {};
  let study = event.arguments.studyId;
  let dynamoDB = new AWS.DynamoDB.DocumentClient();

  try {
    if (study !== null) {
      const queryParams = {
        ExpressionAttributeValues: {
          ":study": study.toString()
        },
        KeyConditionExpression: "studyID=:study",
        ProjectionExpression: "studyID,participantID,firstName,lastName",
        TableName: "participants"
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
        statusCode: 400,
        body: JSON.stringify({
          message:'Could not determine study id.'
        }),
      }
    }

    callback(null, response);

  } catch (e) {
    console.log(e, e.stack);
  }
}