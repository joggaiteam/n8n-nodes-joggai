import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { TEMPLATE_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

import { aspectRatioOptions } from '../../../const/aspectRatio';

export const getMyTemplateProperties: INodeProperties[] = [
	{
		displayName: 'Aspect Ratio',
		description: 'Screen aspect ratio',
		name: 'aspectRatio',
		type: 'options',
		default: -1,
		displayOptions: {
			show: {
				resource: [TEMPLATE_RESOURCE.value],
				operation: [TEMPLATE_RESOURCE.operation.GET_MY_TEMPLATES.value],
			},
		},
		options: aspectRatioOptions,
	},
];

export async function executeGetMyTemplateOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	let endpoint = `/v1/templates/custom`;

	const aspectRatio = this.getNodeParameter('aspectRatio', i) as string;
	const qs: IDataObject = {
		aspect_ratio: aspectRatio,
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}${endpoint}`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		qs: qs,
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
