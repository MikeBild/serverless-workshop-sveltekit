import { Stack, aws_iam } from 'aws-cdk-lib';
// import { DnsValidatedDomainIdentity } from 'aws-cdk-ses-domain-identity';

export class SESStack extends Stack {
	constructor(scope, id, props) {
		super(scope, id, props);

		const [_, zoneName, TLD] = process.env.FQDN?.split('.') || [];
		const domainName = `${zoneName}.${TLD}`;

		// new DnsValidatedDomainIdentity(this, 'DomainIdentity', {
		// 	domainName,
		// 	dkim: true,
		// 	hostedZone: props.hostedZone
		// });

		props.serverHandler.addToRolePolicy(
			new aws_iam.PolicyStatement({
				effect: aws_iam.Effect.ALLOW,
				actions: ['ses:SendEmail', 'ses:SendRawEmail', 'ses:SendTemplatedEmail'],
				resources: [
					`arn:aws:ses:${Stack.of(this).region}:${Stack.of(this).account}:identity/${domainName}`
				]
			})
		);
	}
}
