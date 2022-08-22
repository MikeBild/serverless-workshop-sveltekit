import { Stack, RemovalPolicy, CfnOutput } from '@aws-cdk/core';
import { Table, BillingMode, AttributeType, StreamViewType } from '@aws-cdk/aws-dynamodb';

export class DynamoDBStack extends Stack {
	constructor(scope, id, props) {
		super(scope, id, props);

		this.table = new Table(this, 'DynamoDBTable', {
			billingMode: BillingMode.PAY_PER_REQUEST,
			partitionKey: {
				name: 'id',
				type: AttributeType.STRING
			},
			sortKey: {
				name: 'type',
				type: AttributeType.STRING
			},
			stream: StreamViewType.NEW_AND_OLD_IMAGES,
			timeToLiveAttribute: 'expiresAt',
			removalPolicy: RemovalPolicy.DESTROY
		});
		
		this.table.grantReadWriteData(props.serverHandler);

		new CfnOutput(this, 'tableName', { value: this.table.tableName });
	}
}
