# VCRMH - TailorMade App

## Initial Setup
Before beginning setup ensure that you have the following installed:
* `npm` v6.1.0+ and `node` v9.10.1+
* `awscli`
  * http://docs.aws.amazon.com/cli/latest/userguide/installing.html
* `serverless`
  * `npm install -g serverless`

1. Clone the repo to your local directory.
   ```
   git clone [repo]
   ```

2. Install local dependencies.
   From the root directory, run these commands to install dependencies.
   ```
   npm install
   cd vcrmh-app-api
   npm install
   ```

3. Serve the application to localhost.
   Inside the root directory run the following command to deploy the application to a hot reloading environment.
   ```
   npm start
   ```
   

## Creating, Updating, and Deploying Lambda functions with Serverless.
Using the Serverless CLI will allow you to create, update and delete functions from your local environment instead of the AWS console.

**Note:** You will need to be logged in to the AWS CLI to run `serverless deploy`.  To login, run `aws configure` and follow the prompts to sign in using your credentials for the environment. If you need programattic access keys for your user, follow the steps below.

1. Sign into the AWS console.
2. 

## Building and Deploying to CI
*To be completed following the completion of environment/deployment pipeline setup.*


