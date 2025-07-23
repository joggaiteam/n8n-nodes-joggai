import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { VISUAL_STYLE_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

export const visualStyleListProperties: INodeProperties[] = [
	{
		displayName: 'Aspect Ratio',
		name: 'aspect_ratio',
		type: 'options',
		description: 'Optional. Filter the list of visual styles by aspect ratio.',
		default: -1,
		displayOptions: {
			show: {
				resource: [VISUAL_STYLE_RESOURCE.value],
				operation: [VISUAL_STYLE_RESOURCE.operation.GET.value],
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

export async function executeVisualStyleListOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const qs: IDataObject = {};
	const aspectRatio = this.getNodeParameter('aspect_ratio', i) as string;
	qs.aspect_ratio = aspectRatio;

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}/v1/visual_styles`,
		qs: qs,
		json: true,
	};

	this.logger.info('send request: ' + JSON.stringify(options));

	const responseData = await this.helpers.httpRequestWithAuthentication.call(
		this,
		CREDENTIALS_API_NAME,
		options,
	);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);
	returnData.push(...executionData);

	return returnData;
}
