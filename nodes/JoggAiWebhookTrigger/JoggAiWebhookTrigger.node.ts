import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { IWebhookFunctions } from 'n8n-workflow/dist/Interfaces';

import { CREDENTIALS_API_NAME } from '../../const/joggAiNode';

export class JoggAiWebhookTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JoggAI Webhook Trigger',
		name: 'joggAiWebhookTrigger',
		group: ['trigger'],
		version: 1,
		description: 'Trigger from JoggAI webhook',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:joggai.png',
		defaults: {
			name: 'JoggAI Webhook Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: CREDENTIALS_API_NAME,
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'jogg',
			},
		],
		properties: [],
	};

	async webhook(this: IWebhookFunctions): Promise<any> {
		const body = this.getBodyData();
		return {
			workflowData: [[{ json: body }]],
		};
	}
}
