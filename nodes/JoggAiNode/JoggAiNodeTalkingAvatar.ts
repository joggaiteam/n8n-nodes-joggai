import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

export const talkingAvatarProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['talkingAvatar'],
			},
		},
		options: [
			{
				name: 'Create Talking Avatar Videos',
				value: 'createTalkingAvatar',
				description: 'Creates a talking avatar video with specified parameters',
				action: 'Create Talking Avatar Videos',
			},
		],
		default: 'createTalkingAvatar',
		required: true,
	},
	{
		displayName: 'Script',
		name: 'script',
		type: 'string',
		default: '',
		description:
			'Script content for the avatar to speak. Must provide either script or audio_script',
		displayOptions: {
			show: {
				resource: ['talkingAvatar'],
				operation: ['createTalkingAvatar'],
			},
		},
	},
	{
		displayName: 'Audio URL',
		name: 'audioUrl',
		type: 'string',
		default: '',
		description: 'Url for Audio, either script or audio_url must be provided, but not both.',
		displayOptions: {
			show: {
				resource: ['talkingAvatar'],
				operation: ['createTalkingAvatar'],
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
		description: 'Aspect ratio of the output video.',
		displayOptions: {
			show: {
				resource: ['talkingAvatar'],
				operation: ['createTalkingAvatar'],
			},
		},
	},
	{
		displayName: 'Screen Style',
		name: 'screenStyle',
		type: 'options',
		default: 1,
		options: [
			{
				name: 'with background',
				value: 1,
			},
			{
				name: 'green screen',
				value: 2,
			},
			{
				name: 'webm',
				value: 3,
			},
		],
		description: 'Background style.',
		displayOptions: {
			show: {
				resource: ['talkingAvatar'],
				operation: ['createTalkingAvatar'],
			},
		},
		required: true,
	},
	{
		displayName: 'Avatar ID',
		name: 'avatarId',
		type: 'number',
		default: 0,
		description: 'ID of the avatar to use',
		displayOptions: {
			show: {
				resource: ['talkingAvatar'],
				operation: ['createTalkingAvatar'],
			},
		},
		required: true,
	},
	{
		displayName: 'Avatar Type',
		name: 'avatarType',
		type: 'options',
		default: 0,
		description: 'Source type of the avatar',
		options: [
			{
				name: 'Jogg avatar',
				value: 0,
			},
			{
				name: 'Your avatar',
				value: 1,
			},
		],
		displayOptions: {
			show: {
				resource: ['talkingAvatar'],
				operation: ['createTalkingAvatar'],
			},
		},
		required: true,
	},
	{
		displayName: 'Voice ID',
		name: 'voiceId',
		type: 'string',
		default: undefined,
		description: 'ID of the text-to-speech voice to use',
		displayOptions: {
			show: {
				resource: ['talkingAvatar'],
				operation: ['createTalkingAvatar'],
			},
		},
		required: true,
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'boolean',
		default: true,
		description: 'Subtitle option. true: enable subtitles, false: disable subtitles',
		displayOptions: {
			show: {
				resource: ['talkingAvatar'],
				operation: ['createTalkingAvatar'],
			},
		},
	},
	{
		displayName: 'Video Name',
		name: 'videoName',
		type: 'string',
		default: undefined,
		description:
			'If you want to specify the name of the generated video, please use this parameter.',
		displayOptions: {
			show: {
				resource: ['talkingAvatar'],
				operation: ['createTalkingAvatar'],
			},
		},
	},
];

export async function executeTalkingAvatarOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case 'createTalkingAvatar':
			return await executeCreateTalkingAvatarOperation.call(this, i);
		default:
			return [];
	}
}

async function executeCreateTalkingAvatarOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// 获取所有必要参数
	const script = this.getNodeParameter('script', i) as string;
	const audioUrl = this.getNodeParameter('audioUrl', i, '') as string;
	const aspectRatio = this.getNodeParameter('aspectRatio', i) as number;
	const screenStyle = this.getNodeParameter('screenStyle', i) as number;
	const avatarId = this.getNodeParameter('avatarId', i) as number;
	const avatarType = this.getNodeParameter('avatarType', i) as number;
	const voiceId = this.getNodeParameter('voiceId', i) as string;
	const caption = this.getNodeParameter('caption', i) as boolean;
	const videoName = this.getNodeParameter('videoName', i, 'My Video') as string;

	// 构建请求体
	const body: IDataObject = {};

	// 必填参数
	body.avatar_id = avatarId;
	body.avatar_type = avatarType;
	body.voice_id = voiceId;
	body.screen_style = screenStyle;

	// 非必填参数需要检查
	if (script !== undefined) {
		body.script = script;
	}
	if (audioUrl !== undefined) {
		body.audio_url = audioUrl;
	}
	if (aspectRatio !== undefined) {
		body.aspect_ratio = aspectRatio;
	}
	if (caption !== undefined) {
		body.caption = caption;
	}
	if (videoName !== undefined) {
		body.video_name = videoName;
	}

	// 获取凭证
	const credentials = await this.getCredentials('joggAiCredentialsApi');

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/create_video_from_talking_avatar`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		body,
		json: true,
	};

	// 调试输出请求参数
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
