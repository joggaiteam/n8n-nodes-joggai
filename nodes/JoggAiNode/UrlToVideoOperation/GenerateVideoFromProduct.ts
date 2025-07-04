import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

import { languageOptions } from '../../../const/language';
import { scriptStyleOptions } from '../../../const/scriptStyle';

export const generateVideoFromProductInformationProperties: INodeProperties[] = [
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
				operation: ['generateVideoFromProductInformation'],
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
		options: languageOptions,
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: ['generateVideoFromProductInformation'],
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
		options: scriptStyleOptions,
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: ['generateVideoFromProductInformation'],
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
				operation: ['generateVideoFromProductInformation'],
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
				operation: ['generateVideoFromProductInformation'],
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
				operation: ['generateVideoFromProductInformation'],
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
				operation: ['generateVideoFromProductInformation'],
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
				name: 'Public Avatars',
				value: 0,
			},
			{
				name: 'Custom Avatars',
				value: 1,
			},
		],
		description: 'The type of the avatar',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: ['generateVideoFromProductInformation'],
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
				operation: ['generateVideoFromProductInformation'],
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
				operation: ['generateVideoFromProductInformation'],
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
				name: 'Template From Template Library',
				value: 'public',
			},
			{
				name: 'Template From My Templates',
				value: 'custom',
			},
		],
		required: true,
		description: 'The type of the template',
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
				operation: ['generateVideoFromProductInformation'],
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
				operation: ['generateVideoFromProductInformation'],
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
				operation: ['generateVideoFromProductInformation'],
			},
		},
	},
];

export async function executeGenerateVideoFromProductOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

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

	if (videoName) body.video_name = videoName;
	if (overrideScript) body.override_script = overrideScript;

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
