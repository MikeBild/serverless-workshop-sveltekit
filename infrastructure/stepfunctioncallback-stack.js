import {
	Duration,
	Stack,
	aws_stepfunctions,
	aws_lambda,
	aws_stepfunctions_tasks,
	CfnOutput
} from 'aws-cdk-lib';

export class StepFunctionCallbackStack extends Stack {
	constructor(scope, id, props) {
		super(scope, id, props);

		this.stepfunctionCallbackHandler = new aws_lambda.Function(
			this,
			'StepFunctionCallbackHandler',
			{
				code: aws_lambda.Code.fromInline(`
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    console.log({ event, context });

	const ddb = new AWS.DynamoDB();
	await ddb
		.putItem({
			TableName: process.env.TABLENAME,
			Item: AWS.DynamoDB.Converter.marshall({
				id: event.id,
				type: event.type || 'stepfunction',
				taskToken: event.taskToken,
				updatedBy: event.username,				
				updatedAt: new Date().toUTCString()
			})
		})
		.promise();

    return 'saved';
};`),
				handler: 'index.handler',
				runtime: aws_lambda.Runtime.NODEJS_16_X,
				timeout: Duration.minutes(15),
				memorySize: 128,
				logRetention: 7,
				environment: {
					TABLENAME: props.table.tableName
				}
			}
		);

		props.table.grantReadWriteData(this.stepfunctionCallbackHandler);

		this.stateMachine = new aws_stepfunctions.StateMachine(this, 'StepFunctionStateMachine', {
			timeout: Duration.days(7),
			definition: new aws_stepfunctions_tasks.LambdaInvoke(this, 'LambdaCallbackFunction', {
				integrationPattern: aws_stepfunctions.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
				lambdaFunction: this.stepfunctionCallbackHandler,
				payload: aws_stepfunctions.TaskInput.fromObject({
					id: aws_stepfunctions.JsonPath.stringAt('$.id'),
					type: aws_stepfunctions.JsonPath.stringAt('$.type'),
					username: aws_stepfunctions.JsonPath.stringAt('$.username'),
					taskToken: aws_stepfunctions.JsonPath.taskToken
				})
			}).next(new aws_stepfunctions.Succeed(this, 'done'))
		});

		this.stateMachine.grantTaskResponse(props.serverHandler);
		this.stateMachine.grantStartExecution(props.serverHandler);

		new CfnOutput(this, 'StateMachineArn', {
			value: this.stateMachine.stateMachineArn
		});
	}
}
