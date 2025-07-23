import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

import { CREDENTIALS_API_NAME, DOCUMENTATION_URL, DOMAIN_URL } from '../const/joggAiNode2';

export class JoggAiCredentialsApi implements ICredentialType {
	name = CREDENTIALS_API_NAME;
	displayName = 'JoggAI Credentials API';
	documentationUrl = DOCUMENTATION_URL;

	properties: INodeProperties[] = [
		{
			displayName: 'API-KEY',
			name: 'apiKey',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
		},
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: DOMAIN_URL,
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
				'x-api-platform': 'n8n',
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
