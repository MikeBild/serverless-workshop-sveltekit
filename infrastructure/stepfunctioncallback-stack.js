import { randomUUID } from 'crypto';
import {
	Duration,
	Stack,
	aws_stepfunctions,
	aws_lambda,
	aws_stepfunctions_tasks
} from 'aws-cdk-lib';

export class StepFunctionCallbackStack extends Stack {
	constructor(scope, id, props) {
		super(scope, id, props);

		this.stepfunctionCallbackHandler = new aws_lambda.Function(
			this,
			'StepFunctionCallbackHandler',
			{
				code: aws_lambda.Code.fromInline(`exports.handler = async (event, context) => {
    console.log({ event, context });
    return 'Hello World!';
};`),
				handler: 'index.handler',
				runtime: aws_lambda.Runtime.NODEJS_16_X,
				timeout: Duration.minutes(15),
				memorySize: 128,
				logRetention: 7
			}
		);

		this.stateMachine = new aws_stepfunctions.StateMachine(this, 'StepFunctionStateMachine', {
			definition: new aws_stepfunctions_tasks.LambdaInvoke(this, 'LambdaCallbackFunction', {
				integrationPattern: aws_stepfunctions.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
				lambdaFunction: this.stepfunctionCallbackHandler,
				payload: aws_stepfunctions.TaskInput.fromObject({
					id: randomUUID(),
					taskToken: aws_stepfunctions.JsonPath.taskToken
				})
			}).next(new aws_stepfunctions.Succeed(this, 'Hello World'))
		});

		this.stateMachine.grantTaskResponse(props.serverHandler);
		this.stateMachine.grantStartExecution(props.serverHandler);
	}
}
