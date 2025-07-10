import crypto from 'crypto';
import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import { IWebhookFunctions } from 'n8n-workflow/dist/Interfaces';

import { CREDENTIALS_API_NAME } from '../../const/joggAiNode';

export class JoggAiNodeTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JoggAI Webhook Trigger',
		name: 'joggAiNodeTrigger',
		group: ['trigger'],
		version: 1,
		description: 'Trigger from JoggAI webhook',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:joggai.png',
		defaults: {
			name: 'JoggAI Trigger',
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
				displayName: 'Trigger On',
				name: 'events',
				options: [
					{
						name: 'Generated Video Success',
						value: 'generated_video_success',
						description: 'Triggers when generated video is success',
					},
					{
						name: 'Generated Video Failed',
						value: 'generated_video_failed',
						description: 'Triggers when generated video is failed',
					},
					{
						name: 'Create Avatar Success',
						value: 'create_avatar_success',
						description: 'Triggers when create avatar is success',
					},
					{
						name: 'Create Avatar Failed',
						value: 'create_avatar_failed',
						description: 'Triggers when create avatar is failed',
					},
				],
				default: 'generated_video_success',
				required: true,
				// type: 'multiOptions',
				type: 'options',
			},
			{
				displayName: 'Webhook Secret',
				name: 'webhookSecret',
				// eslint-disable-next-line n8n-nodes-base/node-param-type-options-password-missing
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						events: [
							'generated_video_success',
							'generated_video_failed',
							'create_avatar_success',
							'create_avatar_failed',
						],
					},
				},
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
