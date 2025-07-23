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

export const updateWebhookProperties: INodeProperties[] = [
	{
		displayName: 'Endpoint ID',
		name: 'endpointId',
		type: 'string',
		default: '',
		description: 'Webhook endpoint ID',
		displayOptions: {
			show: {
				resource: [WEBHOOK_RESOURCE.value],
				operation: [WEBHOOK_RESOURCE.operation.UPDATE_WEBHOOK.value],
			},
		},
		required: true,
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		description: 'New webhook URL (must be HTTPS)',
		displayOptions: {
			show: {
				resource: [WEBHOOK_RESOURCE.value],
				operation: [WEBHOOK_RESOURCE.operation.UPDATE_WEBHOOK.value],
			},
		},
		required: true,
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		default: [],
		description: 'New list of events to subscribe to',
		displayOptions: {
			show: {
				resource: [WEBHOOK_RESOURCE.value],
				operation: [WEBHOOK_RESOURCE.operation.UPDATE_WEBHOOK.value],
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
		description: 'New webhook status',
		displayOptions: {
			show: {
				resource: [WEBHOOK_RESOURCE.value],
				operation: [WEBHOOK_RESOURCE.operation.UPDATE_WEBHOOK.value],
			},
		},
		options: webhookStatusOptions,
	},
];

export async function executeUpdateWebhookOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const endpointId = this.getNodeParameter('endpointId', i) as string;
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
		method: 'PUT',
		url: `${credentials.domain as string}/v1/endpoint/${endpointId}`,
		body,
		json: true,
	};

	this.logger.debug('send request: ' + JSON.stringify(options));

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
