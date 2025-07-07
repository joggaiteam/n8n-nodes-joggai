import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

import { WEBHOOK_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode';

export const deleteWebhookProperties: INodeProperties[] = [
	{
		displayName: 'Endpoint ID',
		name: 'endpointId',
		type: 'string',
		default: '',
		description: 'Webhook endpoint ID to delete',
		displayOptions: {
			show: {
				resource: [WEBHOOK_RESOURCE.value],
				operation: [WEBHOOK_RESOURCE.operation.DELETE_WEBHOOK.value],
			},
		},
		required: true,
	},
];

export async function executeDeleteWebhookOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const endpointId = this.getNodeParameter('endpointId', i) as string;
	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'DELETE',
		url: `${credentials.domain as string}/v1/endpoint/${endpointId}`,
		headers: {
			'x-api-key': credentials.apiKey as string,
		},
		json: true,
	};

	this.logger.info('send request: ' + JSON.stringify(options));

	const responseData = await this.helpers.httpRequest(options);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);

	returnData.push(...executionData);

	return returnData;
}
