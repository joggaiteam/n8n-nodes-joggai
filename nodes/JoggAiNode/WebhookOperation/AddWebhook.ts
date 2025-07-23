import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

import { WEBHOOK_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

import { webhookStatusOptions, webhookEventOptions } from '../../../const/webhookStatus';

export const addWebhookProperties: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		description: 'Webhook endpoint URL (must be HTTPS)',
		displayOptions: {
			show: {
				resource: [WEBHOOK_RESOURCE.value],
				operation: [WEBHOOK_RESOURCE.operation.ADD_WEBHOOK.value],
			},
		},
		required: true,
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		default: [],
		description: 'List of events to subscribe to',
		displayOptions: {
			show: {
				resource: [WEBHOOK_RESOURCE.value],
				operation: [WEBHOOK_RESOURCE.operation.ADD_WEBHOOK.value],
			},
		},
		options: webhookEventOptions,
		required: true,
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'enabled',
		description: 'Webhook status',
		displayOptions: {
			show: {
				resource: [WEBHOOK_RESOURCE.value],
				operation: [WEBHOOK_RESOURCE.operation.ADD_WEBHOOK.value],
			},
		},
		options: webhookStatusOptions,
	},
];

export async function executeAddWebhookOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const url = this.getNodeParameter('url', i) as string;
	const status = this.getNodeParameter('status', i) as string;
	const events = this.getNodeParameter('events', i) as string[];
	const body: IDataObject = {
		url,
		status,
		events,
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/endpoint`,
		body,
		json: true,
	};

	this.logger.info('send request: ' + JSON.stringify(options));

	const responseData = await this.helpers.httpRequestWithAuthentication.call(
		this,
		CREDENTIALS_API_NAME,
		options,
	);

	if (responseData.code !== 0) {
		throw new NodeOperationError(
			this.getNode(),
			`${responseData.msg} (code: ${responseData.code})`,
			{ itemIndex: i },
		);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);

	returnData.push(...executionData);

	return returnData;
}
