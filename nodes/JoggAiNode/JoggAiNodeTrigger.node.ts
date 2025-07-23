import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHookFunctions,
	IHttpRequestOptions,
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
				name: 'event',
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

	webhookMethods = {
		default: {
			async create(this: IHookFunctions): Promise<boolean> {
				const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event', 0);

				const options: IHttpRequestOptions = {
					method: 'POST',
					url: `${credentials.domain}/v1/endpoint`,
					body: {
						url: webhookUrl,
						events: [event],
						status: 'enabled',
					},
					json: true,
				};

				this.logger.debug('send webhook create request: ' + JSON.stringify(options));

				let responseData;
				try {
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						CREDENTIALS_API_NAME,
						options,
					);

					this.logger.debug('send webhook create result: ' + JSON.stringify(responseData));
				} catch (error) {
					return false;
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = responseData?.data?.endpoint_id as string;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId !== undefined) {
					const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

					const options: IHttpRequestOptions = {
						method: 'DELETE',
						url: `${credentials.domain as string}/v1/endpoint/${webhookData.webhookId}`,
						json: true,
					};

					this.logger.debug('send webhook del request: ' + JSON.stringify(options));

					try {
						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							CREDENTIALS_API_NAME,
							options,
						);

						this.logger.debug('send webhook del result: ' + JSON.stringify(responseData));
					} catch (error) {
						return false;
					}
				}

				return true;
			},

			async checkExists(this: IHookFunctions): Promise<boolean> {
				const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

				const options: IHttpRequestOptions = {
					method: 'GET',
					url: `${credentials.domain}/v1/endpoints`,
					json: true,
				};

				this.logger.debug('send webhook list request: ' + JSON.stringify(options));

				const responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					CREDENTIALS_API_NAME,
					options,
				);

				this.logger.debug('send webhook list result: ' + JSON.stringify(responseData));

				if (responseData.code !== 0) {
					return false;
				}

				const registeredWebhooks = responseData?.data?.endpoints || [];
				const webhookUrl = this.getNodeWebhookUrl('default');

				return registeredWebhooks.some((w: any) => w.url === webhookUrl);
			},
		},
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
