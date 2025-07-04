import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

export const createVideoFromTemplateProperties: INodeProperties[] = [
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'number',
		default: 1234,
		description: 'The ID of the template to use',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['createVideoFromTemplate'],
			},
		},
		required: true,
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: 'english',
		description: 'The language to use for the video',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['createVideoFromTemplate'],
			},
		},
		required: true,
	},
	{
		displayName: 'Template Type',
		name: 'templateType',
		type: 'options',
		default: 'common',
		description: 'The type of template to use',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['createVideoFromTemplate'],
			},
		},
		options: [
			{
				name: 'Template From Template Library',
				value: 'common',
			},
			{
				name: 'Template From User Templates',
				value: 'user',
			},
		],
		required: true,
	},
	{
		displayName: 'Avatar ID',
		name: 'avatarId',
		type: 'number',
		default: 1,
		description: 'The ID of the avatar to use',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['createVideoFromTemplate'],
			},
		},
		required: true,
	},
	{
		displayName: 'Avatar Type',
		name: 'avatarType',
		type: 'options',
		default: 0,
		description: 'The type of avatar to use',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['createVideoFromTemplate'],
			},
		},
		options: [
			{
				name: 'Public Avatars',
				value: 0,
			},
			{
				name: 'Custom Avatars',
				value: 1,
			},
		],
		required: true,
	},
	{
		displayName: 'Voice ID',
		name: 'voiceId',
		type: 'string',
		default: 'en-US-ChristopherNeural',
		description: 'Voice ID for text-to-speech',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['createVideoFromTemplate'],
			},
		},
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'boolean',
		default: true,
		description: 'Whether to include captions in the video',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['createVideoFromTemplate'],
			},
		},
	},
	{
		displayName: 'Music ID',
		name: 'musicId',
		type: 'number',
		default: 1,
		description: 'The ID of the music to use',
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['createVideoFromTemplate'],
			},
		},
	},
	{
		displayName: 'Variables',
		name: 'variables',
		placeholder: 'Add Variable',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		displayOptions: {
			show: {
				resource: ['template'],
				operation: ['createVideoFromTemplate'],
			},
		},
		options: [
			{
				name: 'variableValues',
				displayName: 'Variable',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Text Content',
								value: 'text',
							},
							{
								name: 'Image Content',
								value: 'image',
							},
							{
								name: 'Video Content',
								value: 'video',
							},
							{
								name: 'Script Content',
								value: 'script',
							},
						],
						required: true,
						default: 'text',
						description: 'The type of variable',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						required: true,
						description: 'The name of the variable',
					},
					{
						displayName: 'Properties',
						name: 'properties',
						type: 'collection',
						required: true,
						default: {},
						options: [
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								default: '',
								description: 'The text content for the variable',
							},
							{
								displayName: 'URL',
								name: 'url',
								type: 'string',
								default: '',
								description: 'The URL for the variable',
							},
							{
								displayName: 'Asset ID',
								name: 'assetId',
								type: 'number',
								default: 0,
								description: 'The asset ID for the variable',
							},
						],
					},
				],
			},
		],
	},
];

export async function executeCreateVideoFromTemplateOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// 获取所有必要参数
	const templateId = this.getNodeParameter('templateId', i) as number;
	const language = this.getNodeParameter('language', i) as string;
	const templateType = this.getNodeParameter('templateType', i) as string;
	const avatarId = this.getNodeParameter('avatarId', i) as number;
	const avatarType = this.getNodeParameter('avatarType', i) as number;
	const voiceId = this.getNodeParameter('voiceId', i) as string;
	const caption = this.getNodeParameter('caption', i) as boolean;
	const musicId = this.getNodeParameter('musicId', i) as number;

	// 获取变量数据
	const variablesCollection = this.getNodeParameter(
		'variables.variableValues',
		i,
		[],
	) as IDataObject[];
	const variables = variablesCollection.map((variable: IDataObject) => {
		const properties = (variable.properties as IDataObject) || {};
		return {
			type: variable.type as string,
			name: variable.name as string,
			properties: {
				content: (properties.content as string) || '',
				url: (properties.url as string) || '',
				asset_id: (properties.assetId as number) || 0,
			},
		};
	});

	// 构建请求体
	const body = {
		template_id: templateId,
		lang: language,
		template_type: templateType,
		avatar_id: avatarId,
		avatar_type: avatarType,
		voice_id: voiceId,
		caption,
		music_id: musicId,
		variables,
	};

	// 获取凭证
	const credentials = await this.getCredentials('joggAiCredentialsApi');

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/create_video_with_template`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		body,
		json: true,
	};

	this.logger.info('send request: ' + JSON.stringify(options));

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

interface IDataObject {
	[key: string]: unknown;
}
