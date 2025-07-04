import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

import { languageOptions } from '../../../const/language';

export const aiScriptProperties: INodeProperties[] = [
	{
		displayName: 'Language',
		name: 'language',
		type: 'options',
		default: 'english',
		description: 'Script generation language',
		options: languageOptions,
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['createScript'],
			},
		},
		required: true,
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		description:
			'Simply provide the product information or the product_id generated at the "Upload URL to Create Product" endpoint, and you can create several different styles of product introduction scripts',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['createScript'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Product name',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['createScript'],
			},
		},
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Product introduction and selling points',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['createScript'],
			},
		},
	},
	{
		displayName: 'Target Audience',
		name: 'targetAudience',
		type: 'string',
		default: '',
		description: 'Target audience for the product',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['createScript'],
			},
		},
	},
	{
		displayName: 'Video Length',
		name: 'videoLength',
		type: 'options',
		default: '15',
		options: [
			{
				name: '15',
				value: '15',
			},
			{
				name: '30',
				value: '30',
			},
			{
				name: '60',
				value: '60',
			},
		],
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['createScript'],
			},
		},
	},
];

export async function executeAiScriptOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const productId = this.getNodeParameter('productId', i) as string;
	const language = this.getNodeParameter('language', i) as string;
	const name = this.getNodeParameter('name', i) as string;
	const description = this.getNodeParameter('description', i) as string;
	const targetAudience = this.getNodeParameter('targetAudience', i) as string;
	const videoLength = this.getNodeParameter('videoLength', i) as string;

	const body = {
		product_id: productId,
		language,
		name,
		description,
		target_audience: targetAudience,
		video_length: videoLength,
	};

	const credentials = await this.getCredentials('joggAiCredentialsApi');

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/ai_scripts`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		body,
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
