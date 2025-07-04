import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

export const updateProductInformationProperties: INodeProperties[] = [
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		description: 'The ID of the product to update',
		required: true,
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: ['updateProductInformation'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'The name of the product',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: ['updateProductInformation'],
			},
		},
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'The description of the product',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: ['updateProductInformation'],
			},
		},
	},
	{
		displayName: 'Target Audience',
		name: 'targetAudience',
		type: 'string',
		default: '',
		description: 'The target audience for the product',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: ['updateProductInformation'],
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
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: ['updateProductInformation'],
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
						options: [
							{
								name: 'Image',
								value: 1,
							},
							{
								name: 'Video',
								value: 2,
							},
						],
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The name of the media file',
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
						description: 'The URL of the media file',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The description of the media file',
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
	};

	if (name) body.name = name;
	if (description) body.description = description;
	if (targetAudience) body.target_audience = targetAudience;
	if (media.length > 0) body.media = media;

	const credentials = await this.getCredentials('joggAiCredentialsApi');

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

interface IDataObject {
	[key: string]: unknown;
}
