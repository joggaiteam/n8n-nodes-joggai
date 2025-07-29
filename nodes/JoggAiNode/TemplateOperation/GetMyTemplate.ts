import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

import { TEMPLATE_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

export const getMyTemplateProperties: INodeProperties[] = [
	{
		displayName: 'Aspect Ratio',
		name: 'aspect_ratio',
		type: 'options',
		description: 'Optional. Filter the list of your custom templates by aspect ratio.',
		default: -1,
		displayOptions: {
			show: {
				resource: [TEMPLATE_RESOURCE.value],
				operation: [TEMPLATE_RESOURCE.operation.GET_MY_TEMPLATES.value],
			},
		},
		options: [
			{
				name: 'All',
				value: -1,
			},
			{
				name: 'Portrait (9:16)',
				value: 0,
			},
			{
				name: 'Landscape (16:9)',
				value: 1,
			},
			{
				name: 'Square (1:1)',
				value: 2,
			},
		],
	},
];

export async function executeGetMyTemplateOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	let endpoint = `/v1/templates/custom`;

	const aspectRatio = this.getNodeParameter('aspect_ratio', i) as string;
	const qs: IDataObject = {
		aspect_ratio: aspectRatio,
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}${endpoint}`,
		qs: qs,
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
			`${responseData.msg} (code: ${responseData.code}, rid: ${responseData.rid})`,
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
