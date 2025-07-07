import crypto from 'crypto';
import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
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
		properties: [
			{
				displayName: 'Webhook Secret',
				name: 'webhookSecret',
				// eslint-disable-next-line n8n-nodes-base/node-param-type-options-password-missing
				type: 'string',
				default: '',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<any> {
		const webhookSecret = this.getNodeParameter('webhookSecret', '') as string;
		const headerData = this.getHeaderData();
		const body = this.getBodyData();

		// Get signature
		let signature = '';
		const headerKeys = Object.keys(headerData);
		const signatureHeaderKey = headerKeys.find(
			(key) => key.toLowerCase() === 'x-webhook-signature',
		);
		if (signatureHeaderKey) {
			signature = headerData[signatureHeaderKey] as string;
		}

		if (webhookSecret && signature) {
			this.logger.info('If the secret is set and the signature is not empty, verify the signature');
			// Calculate signature
			const mac = crypto.createHmac('sha256', webhookSecret);
			mac.update(JSON.stringify(body));
			const calculatedSignature = mac.digest('hex');

			// Compare signature
			if (calculatedSignature !== signature) {
				throw new NodeOperationError(this.getNode(), 'JoggAI Webhook signature validation failed');
			}
		}

		return {
			workflowData: [
				[
					{
						json: body,
					},
				],
			],
		};
	}
}
