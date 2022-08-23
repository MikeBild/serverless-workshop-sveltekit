import { Stack, RemovalPolicy, CfnOutput, aws_dynamodb } from 'aws-cdk-lib';

export class DynamoDBStack extends Stack {
	constructor(scope, id, props) {
		super(scope, id, props);

		this.table = new aws_dynamodb.Table(this, 'DynamoDBTable', {
			billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
			partitionKey: {
				name: 'id',
				type: aws_dynamodb.AttributeType.STRING
			},
			sortKey: {
				name: 'type',
				type: aws_dynamodb.AttributeType.STRING
			},
			stream: aws_dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
			timeToLiveAttribute: 'expiresAt',
			removalPolicy: RemovalPolicy.DESTROY
		});

		this.table.grantReadWriteData(props.serverHandler);

		new CfnOutput(this, 'tableName', { value: this.table.tableName });
	}
}
