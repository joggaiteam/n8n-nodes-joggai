import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

import { PRODUCT_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

export const uploadUrlCreateProductProperties: INodeProperties[] = [
	{
		displayName: 'Creation Method',
		name: 'creationMethod',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'From URL',
				value: 'url',
				description: 'Crawl a URL to get product information',
			},
			{
				name: 'Manual Entry',
				value: 'manual',
				description: 'Provide product information manually',
			},
		],
		default: 'url',
		description: 'Choose how to provide the product information',
		displayOptions: {
			show: {
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value],
			},
		},
	},

	// ----------------------------------
	//         Create from URL
	// ----------------------------------
	{
		displayName: 'Product URL',
		name: 'url',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value],
				creationMethod: ['url'],
			},
		},
		placeholder: 'https://example.com/product_page',
		description: 'URL of the product page to crawl for information',
	},

	// ----------------------------------
	//         Manual Entry
	// ----------------------------------
	{
		displayName: 'Product Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value],
				creationMethod: ['manual'],
			},
		},
		description: 'The name of the product',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			multiline: true,
		},
		default: '',
		displayOptions: {
			show: {
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value],
				creationMethod: ['manual'],
			},
		},
		description: 'Product introduction and selling points',
	},
	{
		displayName: 'Target Audience',
		name: 'target_audience',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value],
				creationMethod: ['manual'],
			},
		},
		placeholder: 'e.g., Tech-savvy millennials',
		description: 'The target audience for the product',
	},
	{
		displayName: 'Media',
		name: 'media',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value],
				creationMethod: ['manual'],
			},
		},
		placeholder: 'Add Media',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		description: 'Media resources like images or videos',
		options: [
			{
				name: 'mediaItem',
				displayName: 'Media Item',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						required: true,
						options: [
							{ name: 'Image', value: 1 },
							{ name: 'Video', value: 2 },
						],
						default: 1,
						description: 'The type of the media asset',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'product_front.jpg',
						description: 'The name of the media file',
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'https://example.com/image.jpg',
						description: 'A public URL for the media asset',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						placeholder: 'A front view of the product.',
						description: 'A brief description of the media',
					},
				],
			},
		],
	},
];

export async function executeUploadUrlCreateProductOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const url = this.getNodeParameter('url', i) as string;
	const name = this.getNodeParameter('name', i, '') as string;
	const description = this.getNodeParameter('description', i, '') as string;
	const targetAudience = this.getNodeParameter('target_audience', i, '') as string;

	const mediaCollection = this.getNodeParameter('media.mediaItem', i, []) as IDataObject[];
	const media = mediaCollection.map((item: IDataObject) => {
		return {
			type: item.type as number,
			name: item.name as string,
			url: item.url as string,
			description: item.description as string,
		};
	});

	const body: IDataObject = {
		url,
		name,
		description,
		target_audience: targetAudience,
		media,
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/product`,
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
