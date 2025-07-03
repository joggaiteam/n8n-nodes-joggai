import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class JoggAiCredentialsApi implements ICredentialType {
	name = 'joggAiCredentialsApi';
	displayName = 'JoggAI Credentials API';
	documentationUrl = 'https://docs.jogg.ai/api-reference/QuickStart/GettingStarted';

	properties: INodeProperties[] = [
		{
			displayName: 'API-KEY',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: 'https://api.jogg.ai',
			required: true,
		},
	];

	// This credential is currently not used by any node directly
	// but the HTTP Request node can use it to make requests.
	// The credential is also testable due to the `test` property below
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.domain}}',
			url: '/v1/whoami',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	};
}
