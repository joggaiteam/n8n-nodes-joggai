import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { LOOKUP_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode';

import { aspectRatioOptions } from '../../../const/aspectRatio';

export const visualStyleListProperties: INodeProperties[] = [
	{
		displayName: 'Aspect Ratio',
		description: 'Screen aspect ratio',
		name: 'aspectRatio',
		type: 'options',
		default: -1,
		displayOptions: {
			show: {
				resource: [LOOKUP_RESOURCE.value],
				operation: [LOOKUP_RESOURCE.operation.LIST_VISUAL_STYLE.value],
			},
		},
		options: aspectRatioOptions,
	},
];

export async function executeVisualStyleListOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	let endpoint = `/v1/visual_styles`;

	const qs: IDataObject = {};
	const aspectRatio = this.getNodeParameter('aspectRatio', i) as string;
	qs.aspect_ratio = aspectRatio;

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
