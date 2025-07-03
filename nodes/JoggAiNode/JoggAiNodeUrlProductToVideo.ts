import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

export const urlProductToVideoProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
			},
		},
		options: [
			{
				name: 'Upload URL to Create Product',
				value: 'uploadUrlCreateProduct',
				description:
					'Get product information by crawling the provided URL or create a new product with provided information',
				action: 'Upload URL to Create Product',
			},
			{
				name: 'Update Product Information',
				value: 'updateProductInformation',
				description: 'Optional step to update product details.',
				action: 'Update Product Information',
			},
			// https://docs.jogg.ai/api-reference/URL-to-Video/CreateVideo
			{
				name: 'Generate Video from Product Information',
				value: 'generateVideoFromProductInformation',
				description: 'Final step to generate the product video. ',
				action: 'Generate Video from Product Information',
			},
			// https://docs.jogg.ai/api-reference/URL-to-Video/GeneratePreview
			{
				name: 'Generate Preview Video from Product Information',
				value: 'generatePreviewVideoFromProductInformation',
				description:
					'You can generate a preview video using the product_id obtained from the Upload URL to create a product.',
				action: 'Generate Preview Video from Product Information',
			},
		],
		default: 'uploadUrlCreateProduct',
		required: true,
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		description: 'The URL of the product to crawl',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: ['uploadUrlCreateProduct'],
			},
		},
	},
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
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		description: 'The ID of the product to generate video',
		required: true,
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
			},
		},
	},
	{
		displayName: 'Video Name',
		name: 'videoName',
		type: 'string',
		default: '',
		description: 'The name of the generated video',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: ['generateVideoFromProductInformation'],
			},
		},
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'options',
		default: 'english',
		description: 'Script generation language',
		required: true,
		options: [
			{
				name: 'English',
				value: 'english',
			},
			{
				name: 'Filipino',
				value: 'filipino',
			},
			{
				name: 'French',
				value: 'french',
			},
			{
				name: 'German',
				value: 'german',
			},
			{
				name: 'Hindi',
				value: 'hindi',
			},
			{
				name: 'Indonesian',
				value: 'indonesian',
			},
			{
				name: 'Italian',
				value: 'italian',
			},
			{
				name: 'Japanese',
				value: 'japanese',
			},
			{
				name: 'Korean',
				value: 'korean',
			},
			{
				name: 'Malay',
				value: 'malay',
			},
			{
				name: 'Portuguese',
				value: 'portuguese',
			},
			{
				name: 'Russian',
				value: 'russian',
			},
			{
				name: 'Spanish',
				value: 'spanish',
			},
			{
				name: 'Thai',
				value: 'thai',
			},
			{
				name: 'Vietnamese',
				value: 'vietnamese',
			},
			{
				name: 'Arabic',
				value: 'arabic',
			},
			{
				name: 'Greek',
				value: 'greek',
			},
			{
				name: 'Turkish',
				value: 'turkish',
			},
			{
				name: 'Slovenian',
				value: 'slovenian',
			},
			{
				name: 'Croatian',
				value: 'croatian',
			},
			{
				name: 'Romanian',
				value: 'romanian',
			},
			{
				name: 'Simplified Chinese',
				value: 'chinese',
			},
			{
				name: 'Bengali',
				value: 'bengali',
			},
			{
				name: 'Urdu',
				value: 'urdu',
			},
			{
				name: 'Hungarian',
				value: 'hungarian',
			},
			{
				name: 'Traditional Chinese',
				value: 'traditional-chinese',
			},
			{
				name: 'Polish',
				value: 'polish',
			},
			{
				name: 'Cantonese',
				value: 'cantonese',
			},
			{
				name: 'Danish',
				value: 'danish',
			},
			{
				name: 'Malayalam',
				value: 'malayalam',
			},
			{
				name: 'Tamil',
				value: 'tamil',
			},
			{
				name: 'Telugu',
				value: 'telugu',
			},
			{
				name: 'Czech',
				value: 'czech',
			},
			{
				name: 'Hebrew',
				value: 'hebrew',
			},
			{
				name: 'Zulu',
				value: 'zulu',
			},
			{
				name: 'Swedish',
				value: 'swedish',
			},
			{
				name: 'Lithuanian',
				value: 'lithuanian',
			},
			{
				name: 'Dutch',
				value: 'dutch',
			},
			{
				name: 'Flemish',
				value: 'flemish',
			},
			{
				name: 'Norwegian',
				value: 'norwegian',
			},
			{
				name: 'Finnish',
				value: 'finnish',
			},
			{
				name: 'Bulgarian',
				value: 'bulgarian',
			},
			{
				name: 'Latvian',
				value: 'latvian',
			},
			{
				name: 'Ukrainian',
				value: 'ukrainian',
			},
			{
				name: 'Mongolian',
				value: 'mongolian',
			},
			{
				name: 'Persian',
				value: 'persian',
			},
			{
				name: 'Odia',
				value: 'odia',
			},
			{
				name: 'Assamese',
				value: 'assamese',
			},
			{
				name: 'Kannada',
				value: 'kannada',
			},
			{
				name: 'Tagalog',
				value: 'tagalog',
			},
			{
				name: 'Amharic',
				value: 'amharic',
			},
			{
				name: 'Serbian',
				value: 'serbian',
			},
			{
				name: 'Slovak',
				value: 'slovak',
			},
			{
				name: 'Swahili',
				value: 'swahili',
			},
		],
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
			},
		},
	},
	{
		displayName: 'Script Style',
		name: 'scriptStyle',
		type: 'options',
		default: 'Soft Selling',
		description: 'Script writing style for video content',
		required: true,
		options: [
			{
				name: "Don't Worry - Casual and reassuring tone",
				value: "Don't Worry",
			},
			{
				name: 'Discovery - Exploratory and revealing style',
				value: 'Discovery',
			},
			{
				name: 'Data - Fact-based and analytical presentation',
				value: 'Data',
			},
			{
				name: 'Top 3 reasons - List-based persuasive format',
				value: 'Top 3 reasons',
			},
			{
				name: 'Soft Selling - Gentle persuasion focusing on trust-building over hard pitching',
				value: 'Soft Selling',
			},
			{
				name: 'Humor & Meme - Light-hearted engagement with funny, relatable content',
				value: 'Humor & Meme',
			},
			{
				name: 'Feature Explainer - Clear breakdown of product/service functionalities',
				value: 'Feature Explainer',
			},
			{
				name: 'Soft Storytelling with Twist - Emotional narrative with an unexpected plot turn',
				value: 'Soft Storytelling with Twist',
			},
			{
				name: 'Expert Advice - Authoritative guidance based on industry experience',
				value: 'Expert Advice',
			},
			{
				name: 'Unboxing & Review - Immersive first-hand experience sharing',
				value: 'Unboxing & Review',
			},
			{
				name: 'Challenge - Interactive task prompting audience participation',
				value: 'Challenge',
			},
			{
				name: 'Problem/Solution - Clear identification of issues with practical remedies',
				value: 'Problem/Solution',
			},
			{
				name: 'Comparison - Side-by-side analysis of pros/cons for informed decisions',
				value: 'Comparison',
			},
			{
				name: 'Creative/Innovative - Original concepts breaking conventional boundaries',
				value: 'Creative/Innovative',
			},
			{
				name: 'Emotional Appeal - Empathetic connection through shared feelings',
				value: 'Emotional Appeal',
			},
			{
				name: 'Immersive Storytelling - Vivid narrative creating strong audience immersion',
				value: 'Immersive Storytelling',
			},
		],
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
			},
		},
	},
	{
		displayName: 'Visual Style',
		name: 'visualStyle',
		type: 'string',
		default: '',
		description: 'Visual style for the video',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
			},
		},
	},
	{
		displayName: 'Video Length',
		name: 'videoLength',
		type: 'options',
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
		default: '15',
		required: true,
		description: 'The length of the video in seconds',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
			},
		},
	},
	{
		displayName: 'Aspect Ratio',
		name: 'aspectRatio',
		type: 'options',
		options: [
			{
				name: '[9:16]',
				value: 0,
			},
			{
				name: '[16:9]',
				value: 1,
			},
			{
				name: '[1:1]',
				value: 2,
			},
		],
		default: 0,
		required: true,
		description: 'The aspect ratio of the video',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
			},
		},
	},
	{
		displayName: 'Avatar ID',
		name: 'avatarId',
		type: 'number',
		default: 0,
		required: true,
		description: 'The ID of the avatar to use in the video',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
			},
		},
	},
	{
		displayName: 'Avatar Type',
		name: 'avatarType',
		required: true,
		default: 0,
		type: 'options',
		options: [
			{
				name: 'Public avatars',
				value: 0,
			},
			{
				name: 'Custom avatars',
				value: 1,
			},
		],
		description: 'The type of the avatar',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
			},
		},
	},
	{
		displayName: 'Voice ID',
		name: 'voiceId',
		type: 'string',
		default: '',
		description: 'The ID of the voice to use in the video',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
			},
		},
	},
	{
		displayName: 'Music ID',
		name: 'musicId',
		type: 'number',
		default: 0,
		description: 'The ID of the background music to use in the video',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: ['generateVideoFromProductInformation'],
			},
		},
	},
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'number',
		default: 0,
		description: 'The ID of the template to use for the video',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
			},
		},
	},
	{
		displayName: 'Template Type',
		name: 'templateType',
		default: 'public',
		type: 'options',
		options: [
			{
				name: 'Template from template library',
				value: 'public',
			},
			{
				name: 'Template from my templates',
				value: 'custom',
			},
		],
		required: true,
		description: 'The type of the template',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
			},
		},
	},
	{
		displayName: 'Override Script',
		name: 'overrideScript',
		type: 'string',
		default: '',
		description: 'Custom script to override the generated one',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
			},
		},
	},
	{
		displayName: 'Add Captions',
		name: 'caption',
		type: 'boolean',
		default: true,
		description: 'Whether to add captions to the video',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: [
					'generateVideoFromProductInformation',
					'generatePreviewVideoFromProductInformation',
				],
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
				operation: ['uploadUrlCreateProduct', 'updateProductInformation'],
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
				operation: ['uploadUrlCreateProduct', 'updateProductInformation'],
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
				operation: ['uploadUrlCreateProduct', 'updateProductInformation'],
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
				operation: ['uploadUrlCreateProduct', 'updateProductInformation'],
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

export async function executeUrlProductToVideoOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case 'uploadUrlCreateProduct':
			return await executeUploadUrlCreateProductOperation.call(this, i);
		case 'updateProductInformation':
			return await executeUpdateProductInformationOperation.call(this, i);
		case 'generateVideoFromProductInformation':
			return await executeGenerateVideoFromProductInformationOperation.call(this, i);
		case 'generatePreviewVideoFromProductInformation':
			return await executeGeneratePreviewVideoFromProductInformationOperation.call(this, i);
		default:
			return [];
	}
}

async function executeUploadUrlCreateProductOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// 获取所有必要参数
	const url = this.getNodeParameter('url', i) as string;
	const name = this.getNodeParameter('name', i, '') as string;
	const description = this.getNodeParameter('description', i, '') as string;
	const targetAudience = this.getNodeParameter('targetAudience', i, '') as string;

	// 获取媒体数据
	const mediaCollection = this.getNodeParameter('media.mediaValues', i, []) as IDataObject[];
	const media = mediaCollection.map((item: IDataObject) => {
		return {
			type: item.type as number,
			name: item.name as string,
			url: item.url as string,
			description: item.description as string,
		};
	});

	// 构建请求体
	const body: IDataObject = {
		url,
	};

	// 只添加非空值
	if (name) body.name = name;
	if (description) body.description = description;
	if (targetAudience) body.target_audience = targetAudience;
	if (media.length > 0) body.media = media;

	// 获取凭证
	const credentials = await this.getCredentials('joggAiCredentialsApi');

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

	this.logger.info('请求参数: ' + JSON.stringify(options));

	// 发送请求并获取响应
	const responseData = await this.helpers.httpRequest(options);

	// 处理响应数据
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);

	returnData.push(...executionData);

	return returnData;
}

async function executeUpdateProductInformationOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// 获取产品ID和其他参数
	const productId = this.getNodeParameter('productId', i) as string;
	const name = this.getNodeParameter('name', i, '') as string;
	const description = this.getNodeParameter('description', i, '') as string;
	const targetAudience = this.getNodeParameter('targetAudience', i, '') as string;

	// 获取媒体数据
	const mediaCollection = this.getNodeParameter('media.mediaValues', i, []) as IDataObject[];
	const media = mediaCollection.map((item: IDataObject) => {
		return {
			type: item.type as number,
			name: item.name as string,
			url: item.url as string,
			description: item.description as string,
		};
	});

	// 构建请求体
	const body: IDataObject = {
		product_id: productId,
	};

	// 只添加非空值
	if (name) body.name = name;
	if (description) body.description = description;
	if (targetAudience) body.target_audience = targetAudience;
	if (media.length > 0) body.media = media;

	// 获取凭证
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

	this.logger.info('请求参数: ' + JSON.stringify(options));

	// 发送请求并获取响应
	const responseData = await this.helpers.httpRequest(options);

	// 处理响应数据
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);

	returnData.push(...executionData);

	return returnData;
}

async function executeGenerateVideoFromProductInformationOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// 获取所有必要参数
	const productId = this.getNodeParameter('productId', i) as string;
	const videoName = this.getNodeParameter('videoName', i, '') as string;
	const language = this.getNodeParameter('language', i) as string;
	const scriptStyle = this.getNodeParameter('scriptStyle', i) as string;
	const visualStyle = this.getNodeParameter('visualStyle', i, '') as string;
	const videoLength = this.getNodeParameter('videoLength', i, '15') as string;
	const aspectRatio = this.getNodeParameter('aspectRatio', i, 0) as number;
	const avatarId = this.getNodeParameter('avatarId', i, 1) as number;
	const avatarType = this.getNodeParameter('avatarType', i, 0) as number;
	const voiceId = this.getNodeParameter('voiceId', i, 'en-US-ChristopherNeural') as string;
	const musicId = this.getNodeParameter('musicId', i, 13) as number;
	const templateId = this.getNodeParameter('templateId', i, 123) as number;
	const templateType = this.getNodeParameter('templateType', i, 'public') as string;
	const overrideScript = this.getNodeParameter('overrideScript', i, '') as string;
	const caption = this.getNodeParameter('caption', i, true) as boolean;

	// 构建请求体
	const body: IDataObject = {
		product_id: productId,
		aspect_ratio: aspectRatio,
		video_length: videoLength,
		language,
		avatar_id: avatarId,
		avatar_type: avatarType,
		voice_id: voiceId,
		music_id: musicId,
		script_style: scriptStyle,
		visual_style: visualStyle,
		template_id: templateId,
		template_type: templateType,
		caption,
	};

	// 只添加非空值
	if (videoName) body.video_name = videoName;
	if (overrideScript) body.override_script = overrideScript;

	// 获取凭证
	const credentials = await this.getCredentials('joggAiCredentialsApi');

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/create_video_from_url`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		body,
		json: true,
	};

	this.logger.info('请求参数: ' + JSON.stringify(options));

	// 发送请求并获取响应
	const responseData = await this.helpers.httpRequest(options);

	// 处理响应数据
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);

	returnData.push(...executionData);

	return returnData;
}

async function executeGeneratePreviewVideoFromProductInformationOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// 获取所有必要参数
	const productId = this.getNodeParameter('productId', i) as string;
	const language = this.getNodeParameter('language', i) as string;
	const scriptStyle = this.getNodeParameter('scriptStyle', i) as string;
	const visualStyle = this.getNodeParameter('visualStyle', i, '') as string;
	const videoLength = this.getNodeParameter('videoLength', i, '15') as string;
	const aspectRatio = this.getNodeParameter('aspectRatio', i, 0) as number;
	const avatarId = this.getNodeParameter('avatarId', i, 1) as number;
	const avatarType = this.getNodeParameter('avatarType', i, 0) as number;
	const voiceId = this.getNodeParameter('voiceId', i, 'en-US-ChristopherNeural') as string;
	const templateId = this.getNodeParameter('templateId', i, 0) as number;
	const templateType = this.getNodeParameter('templateType', i, 'custom') as string;
	const overrideScript = this.getNodeParameter('overrideScript', i, '') as string;
	const caption = this.getNodeParameter('caption', i, true) as boolean;

	// 构建请求体
	const body: IDataObject = {
		product_id: productId,
		aspect_ratio: aspectRatio,
		video_length: videoLength,
		language,
		avatar_id: avatarId,
		avatar_type: avatarType,
		voice_id: voiceId,
		script_style: scriptStyle,
		visual_style: visualStyle,
		template_id: templateId,
		template_type: templateType,
		caption,
	};

	// 只添加非空值
	if (overrideScript) body.override_script = overrideScript;

	// 获取凭证
	const credentials = await this.getCredentials('joggAiCredentialsApi');

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/preview`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		body,
		json: true,
	};

	this.logger.info('请求参数: ' + JSON.stringify(options));

	// 发送请求并获取响应
	const responseData = await this.helpers.httpRequest(options);

	// 处理响应数据
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);

	returnData.push(...executionData);

	return returnData;
}

// 添加缺失的接口定义
interface IDataObject {
	[key: string]: unknown;
}
