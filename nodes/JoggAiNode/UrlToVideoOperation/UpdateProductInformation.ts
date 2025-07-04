import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { URL_TO_VIDEO_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode';

import { mediaTypeOptions } from '../../../const/mediaType';

export const updateProductInformationProperties: INodeProperties[] = [
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		description: 'Product ID obtained from Step 1 (POST /open/product) response data.id',
		required: true,
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.UPDATE_PRODUCT_INFORMATION.value],
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
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.UPDATE_PRODUCT_INFORMATION.value],
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
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.UPDATE_PRODUCT_INFORMATION.value],
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
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.UPDATE_PRODUCT_INFORMATION.value],
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
		description: 'Media resources array (will replace existing media if provided)',
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.UPDATE_PRODUCT_INFORMATION.value],
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
						description: 'Media type',
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

export async function executeUpdateProductInformationOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const productId = this.getNodeParameter('productId', i) as string;
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
		product_id: productId,
		name,
		description,
		target_audience: targetAudience,
		media,
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'PUT',
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
