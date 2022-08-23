import { Stack, CfnOutput, RemovalPolicy, aws_cognito } from 'aws-cdk-lib';

export class CognitoStack extends Stack {
	constructor(parent, id, props) {
		super(parent, id, props);

		this.userPool = new aws_cognito.UserPool(this, `user-pool`, {
			removalPolicy: RemovalPolicy.DESTROY,
			autoVerify: { email: true },
			selfSignUpEnabled: true,
			userInvitation: {
				emailSubject: 'Temporary Password',
				emailBody: 'Your username is {username} and temporary password is {####}'
			},
			userVerification: {
				emailSubject: 'Verification Code',
				emailBody: 'Verification code for your account is {####}'
			},
			schema: [
				{
					attributeDataType: 'String',
					name: 'email',
					required: true
				}
			],
			customAttributes: {
				role: new aws_cognito.StringAttribute({ mutable: true }),
				tenant: new aws_cognito.StringAttribute({ mutable: true })
			}
		});

		new CfnOutput(this, `userPoolId`, {
			value: this.userPool.userPoolId
		});

		this.userPoolDomain = new aws_cognito.UserPoolDomain(this, `user-pool-domain`, {
			userPool: this.userPool,
			cognitoDomain: {
				domainPrefix: `serverless-workshop`
			}
		});

		const clientWriteAttributes = new aws_cognito.ClientAttributes()
			.withStandardAttributes({
				familyName: true,
				givenName: true,
				middleName: true,
				nickname: true,
				email: true
			})
			.withCustomAttributes('role', 'tenant');

		const clientReadAttributes = clientWriteAttributes
			.withStandardAttributes({
				familyName: true,
				givenName: true,
				middleName: true,
				nickname: true,
				email: true,
				emailVerified: true
			})
			.withCustomAttributes('role', 'tenant');

		this.userPoolClient = new aws_cognito.UserPoolClient(this, `user-pool-client`, {
			generateSecret: false,
			userPool: this.userPool,
			preventUserExistenceErrors: true,
			supportedIdentityProviders: [aws_cognito.UserPoolClientIdentityProvider.COGNITO],
			oAuth: {
				flows: { authorizationCodeGrant: true },
				callbackUrls: [`https://${process.env.FQDN}`, 'http://localhost:5173'],
				scopes: [
					aws_cognito.OAuthScope.COGNITO_ADMIN,
					aws_cognito.OAuthScope.OPENID,
					aws_cognito.OAuthScope.PROFILE,
					aws_cognito.OAuthScope.EMAIL
				]
			},
			readAttributes: clientReadAttributes,
			writeAttributes: clientWriteAttributes
		});

		new CfnOutput(this, `userPoolClientId`, {
			value: this.userPoolClient.userPoolClientId
		});
	}
}
