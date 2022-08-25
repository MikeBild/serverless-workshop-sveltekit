import AWS from 'aws-sdk';
import { AWS_REGION, STATEMACHINEARN } from '$env/static/private';

const sf = new AWS.StepFunctions({ region: AWS_REGION });

export async function startExecution<T>(input: T & { id: string }) {
	const stateMaschineExecution = await sf
		.startExecution({
			stateMachineArn: STATEMACHINEARN!,
			input: JSON.stringify(input),
			name: input.id,
		})
		.promise();
	stateMaschineExecution.executionArn;

	return { ...stateMaschineExecution, $response: undefined };
}

export async function stopExecution(executionArn: string) {
	const stateMaschineExecution = await sf.stopExecution({ executionArn }).promise();

	return { ...stateMaschineExecution, $response: undefined };
}

export async function sendTaskSuccess(taskToken: string, item = {}) {
	await sf.sendTaskSuccess({ taskToken, output: JSON.stringify(item) }).promise();
}
