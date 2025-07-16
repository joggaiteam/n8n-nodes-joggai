import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { PRODUCT_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

export const updateProductInformationProperties: INodeProperties[] = [
	{
		displayName: 'Product ID',
		name: 'product_id',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the product to update, obtained from the "Create Product" step',
		placeholder: '3924',
		displayOptions: {
			show: {
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPDATE_PRODUCT.value],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updates',
		type: 'collection',
		placeholder: 'Add Field to Update',
		default: {},
		description: 'Select the product fields you want to update. Any fields added here will overwrite existing data.',
		displayOptions: {
			show: {
				resource: [PRODUCT_RESOURCE.value],
				operation: [PRODUCT_RESOURCE.operation.UPDATE_PRODUCT.value],
			},
		},
		options: [
			{
				displayName: 'Product Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Update the name of the product',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					multiline: true,
				},
				default: '',
				description: 'Update the product introduction and selling points',
			},
			{
				displayName: 'Target Audience',
				name: 'target_audience',
				type: 'string',
				default: '',
				placeholder: 'e.g., Tech-savvy millennials',
				description: 'Update the target audience for the product',
			},
			{
				displayName: 'Media',
				name: 'media',
				type: 'fixedCollection',
				placeholder: 'Add Media Item',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				description:
					'A new list of media assets. This will replace all existing media for the product.',
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
								placeholder: 'product_side.jpg',
								description: 'The name of the media file',
							},
							{
								displayName: 'URL',
								name: 'url',
								type: 'string',
								required: true,
								default: '',
								placeholder: 'https://example.com/new_image.jpg',
								description: 'A public URL for the media asset',
							},
							{
								displayName: 'Description',
								name: 'description',
								type: 'string',
								default: '',
								placeholder: 'A side view of the product.',
								description: 'A brief description of the media',
							},
						],
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

	const productId = this.getNodeParameter('product_id', i) as string;
	const updates = this.getNodeParameter('updates', i, {}) as IDataObject;
	const name = (updates.name as string) || '';
	const description = (updates.description as string) || '';
	const targetAudience = (updates.target_audience as string) || '';

	const mediaCollection = (updates.media as IDataObject) || {};
	const mediaItems = (mediaCollection.mediaItem as IDataObject[]) || [];
	const media = mediaItems.map((item: IDataObject) => {
		return {
			type: item.type as number,
			name: item.name as string,
			url: item.url as string,
			description: item.description as string,
		};
	});

	const body: IDataObject = {
		product_id: productId,
	};

	if (name) body.name = name;
	if (description) body.description = description;
	if (targetAudience) body.target_audience = targetAudience;
	if (media.length > 0) body.media = media;

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'PUT',
		url: `${credentials.domain as string}/v1/product`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
			'x-api-platform': 'n8n',
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
