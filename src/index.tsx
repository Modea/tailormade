import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import config from './config';
import Amplify from 'aws-amplify';

Amplify.configure({ 
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID, 
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }, API: {
    aws_appsync_graphqlEndpoint: config.apiGateway.URL, 
    aws_appsync_region: config.apiGateway.REGION,
    aws_appsync_authenticationType: config.apiGateway.AUTH_TYPE
  }, Storage: {
    region: config.storage.REGION,
    bucket: config.storage.BUCKET,
    identityPoolId: config.storage.IDENTITY_POOL_ID
  }
});

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
