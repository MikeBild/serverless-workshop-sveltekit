import { App, Tags } from '@aws-cdk/core';
import { AWSAdapterStack } from 'sveltekit-adapter-aws';
import { CognitoStack } from './cognito-stack.js';
import { DynamoDBStack } from './dynamodb-stack.js';
import { SESStack } from './ses-stack.js';

const app = new App();

app.region = process.env.CDK_DEFAULT_REGION;
app.account = process.env.CDK_DEFAULT_ACCOUNT;
Tags.of(app).add('app', 'serverless-workshop');

const { serverHandler, hostedZone } = new AWSAdapterStack(app, 'serverless-workshop-webapp');
new CognitoStack(app, 'serverless-workshop-cognito-stack', { serverHandler });
new DynamoDBStack(app, 'serverless-workshop-dynamodb', { serverHandler });
new SESStack(app, 'serverless-workshop-ses', { serverHandler, hostedZone });
