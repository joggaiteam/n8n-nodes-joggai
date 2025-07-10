import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { PRODUCT_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

import { mediaTypeOptions } from '../../../const/mediaType';

export const uploadUrlCreateProductProperties: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		description: 'URL of the product to crawl',
		displayOptions: {
			show: {
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value],
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
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value],
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
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value],
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
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value],
			},
		},
	},
	{
		displayName: 'Media',
		name: 'media',
		placeholder: 'Add Media',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Media resources array',
		displayOptions: {
			show: {
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value],
			},
		},
		options: [
			{
				name: 'mediaValues',
				displayName: 'Media',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 1,
						description: 'The type of media',
						options: mediaTypeOptions,
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Media name',
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
						description: 'Media URL',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Media description',
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
	const targetAudience = this.getNodeParameter('targetAudience', i, '') as string;

	const mediaCollection = this.getNodeParameter('media.mediaValues', i, []) as IDataObject[];
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
