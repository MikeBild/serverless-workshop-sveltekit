import { Stack, CfnOutput, RemovalPolicy } from '@aws-cdk/core';
import {
	UserPool,
	UserPoolClient,
	OAuthScope,
	UserPoolClientIdentityProvider,
	ClientAttributes,
	StringAttribute,
	UserPoolDomain
} from '@aws-cdk/aws-cognito';

export class CognitoStack extends Stack {
	constructor(parent, id, props) {
		super(parent, id, props);

		this.userPool = new UserPool(this, `user-pool`, {
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
				role: new StringAttribute({ mutable: true }),
				tenant: new StringAttribute({ mutable: true })
			}
		});

		new CfnOutput(this, `userPoolId`, {
			value: this.userPool.userPoolId
		});

		this.userPoolDomain = new UserPoolDomain(this, `user-pool-domain`, {
			userPool: this.userPool,
			cognitoDomain: {
				domainPrefix: `serverless-workshop`
			}
		});

		const clientWriteAttributes = new ClientAttributes()
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

		this.userPoolClient = new UserPoolClient(this, `user-pool-client`, {
			generateSecret: false,
			userPool: this.userPool,
			preventUserExistenceErrors: true,
			supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
			oAuth: {
				flows: { authorizationCodeGrant: true },
				callbackUrls: [`https://${process.env.FQDN}`, 'http://localhost:5173'],
				scopes: [OAuthScope.COGNITO_ADMIN, OAuthScope.OPENID, OAuthScope.PROFILE, OAuthScope.EMAIL]
			},
			readAttributes: clientReadAttributes,
			writeAttributes: clientWriteAttributes
		});

		new CfnOutput(this, `userPoolClientId`, {
			value: this.userPoolClient.userPoolClientId
		});
	}
}
