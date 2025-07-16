import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { IWebhookFunctions } from 'n8n-workflow/dist/Interfaces';

import { CREDENTIALS_API_NAME } from '../../const/joggAiNode2';

export class JoggAiNodeTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JoggAI Webhook Trigger',
		name: 'joggAiNodeTrigger',
		group: ['trigger'],
		version: 1,
		description: 'Interact with the JoggAI API to create and manage AI videos',
		icon: 'file:joggai.svg',
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
		],
	};

	async webhook(this: IWebhookFunctions): Promise<any> {
		const body = this.getBodyData();
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
