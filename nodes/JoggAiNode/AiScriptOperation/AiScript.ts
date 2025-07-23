import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';

import { languageOptions } from '../../../const/language';

import { AI_SCRIPT_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

export const aiScriptProperties: INodeProperties[] = [
	{
		displayName: 'Language',
		name: 'language',
		type: 'options',
		required: true,
		default: 'english',
		description: 'The language for script generation',
		options: languageOptions,
		displayOptions: {
			show: {
				resource: [AI_SCRIPT_RESOURCE.value],
				operation: [AI_SCRIPT_RESOURCE.operation.GENERATE.value],
			},
		},
	},
	{
		displayName: 'Product Source',
		name: 'productSource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'By Product ID',
				value: 'productId',
				description: 'Use an existing product ID',
			},
			{
				name: 'By Manual Details',
				value: 'manual',
				description: 'Enter product details manually',
			},
		],
		default: 'productId',
		description: 'Choose the source of the product information',
		displayOptions: {
			show: {
				resource: [AI_SCRIPT_RESOURCE.value],
				operation: [AI_SCRIPT_RESOURCE.operation.GENERATE.value],
			},
		},
	},
	{
		displayName: 'Product ID',
		name: 'product_id',
		type: 'string',
		default: '',
		placeholder: 'NTQ0MTkzNjg',
		description: 'The ID of a product previously created',
		displayOptions: {
			show: {
				resource: [AI_SCRIPT_RESOURCE.value],
				operation: [AI_SCRIPT_RESOURCE.operation.GENERATE.value],
				productSource: ['productId'],
			},
		},
	},
	{
		displayName: 'Product Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the product. Required if Product ID is not provided.',
		displayOptions: {
			show: {
				resource: [AI_SCRIPT_RESOURCE.value],
				operation: [AI_SCRIPT_RESOURCE.operation.GENERATE.value],
				productSource: ['manual'],
			},
		},
	},
	{
		displayName: 'Product Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			multiline: true,
		},
		required: true,
		default: '',
		description: 'Product introduction and selling points. Required if Product ID is not provided.',
		displayOptions: {
			show: {
				resource: [AI_SCRIPT_RESOURCE.value],
				operation: [AI_SCRIPT_RESOURCE.operation.GENERATE.value],
				productSource: ['manual'],
			},
		},
	},
	{
		displayName: 'Target Audience',
		name: 'target_audience',
		type: 'string',
		default: '',
		placeholder: 'e.g., Tech-savvy millennials',
		description: 'The target audience for the product',
		displayOptions: {
			show: {
				resource: [AI_SCRIPT_RESOURCE.value],
				operation: [AI_SCRIPT_RESOURCE.operation.GENERATE.value],
				productSource: ['manual'],
			},
		},
	},
	{
		displayName: 'Video Length',
		name: 'video_length',
		type: 'options',
		options: [
			{
				name: '15 Seconds',
				value: '15',
			},
			{
				name: '30 Seconds',
				value: '30',
			},
			{
				name: '60 Seconds',
				value: '60',
			},
		],
		default: '15',
		description: 'Optional. The target length for the generated scripts.',
		displayOptions: {
			show: {
				resource: [AI_SCRIPT_RESOURCE.value],
				operation: [AI_SCRIPT_RESOURCE.operation.GENERATE.value],
			},
		},
	},
];

export async function executeAiScriptOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const productSource = this.getNodeParameter('productSource', i) as string;
	const language = this.getNodeParameter('language', i) as string;
	const videoLength = this.getNodeParameter('video_length', i) as string;

	let productId = '';
	let name = '';
	let description = '';
	let targetAudience = '';

	if (productSource === 'productId') {
		productId = this.getNodeParameter('product_id', i) as string;
	} else {
		name = this.getNodeParameter('name', i) as string;
		description = this.getNodeParameter('description', i) as string;
		targetAudience = this.getNodeParameter('target_audience', i) as string;
	}

	const body = {
		product_id: productId,
		language,
		name,
		description,
		target_audience: targetAudience,
		video_length: videoLength,
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/ai_scripts`,
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
