import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { languageOptions } from '../../../const/language';
import { scriptStyleOptions } from '../../../const/scriptStyle';

import { URL_TO_VIDEO_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode';
import { productVideoTemplateTypeOptions } from '../../../const/templateType';
import { avatarTypeOptions } from '../../../const/avatarType';
import { productVideoAspectRatioOptions } from '../../../const/aspectRatio';
import { videoLengthOptions } from '../../../const/videoLength';

export const generateVideoFromProductInformationProperties: INodeProperties[] = [
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		description: 'Product ID obtained from Step 1 (POST /product) response data.product_id',
		required: true,
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},
	{
		displayName: 'Aspect Ratio',
		name: 'aspectRatio',
		type: 'options',
		options: productVideoAspectRatioOptions,
		default: 0,
		required: true,
		description: 'Video aspect ratio',
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},
	{
		displayName: 'Video Length',
		name: 'videoLength',
		type: 'options',
		options: videoLengthOptions,
		default: '15',
		required: true,
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
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
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},
	{
		displayName: 'Avatar ID',
		name: 'avatarId',
		type: 'number',
		default: 0,
		required: true,
		description: 'Avatar id from Jogg Avatar or Your Avatar',
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},
	{
		displayName: 'Avatar Type',
		name: 'avatarType',
		required: true,
		default: 0,
		type: 'options',
		options: avatarTypeOptions,
		description: 'Avatar source type',
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},
	{
		displayName: 'Script Style',
		name: 'scriptStyle',
		type: 'options',
		default: "Don't Worry",
		description: 'Script writing style for video content',
		required: true,
		options: scriptStyleOptions,
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},
	{
		displayName: 'Template Type',
		name: 'templateType',
		default: 'public',
		type: 'options',
		options: productVideoTemplateTypeOptions,
		required: true,
		description: 'Template source type',
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},
	{
		displayName: 'Voice ID',
		name: 'voiceId',
		type: 'string',
		default: '',
		description: 'Voice id from voice list',
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},
	{
		displayName: 'Music ID',
		name: 'musicId',
		type: 'number',
		default: 0,
		description: 'Music id from music list',
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},
	{
		displayName: 'Visual Style',
		name: 'visualStyle',
		type: 'string',
		default: '',
		description: 'Visual style of the video from visual list(GET /visual)',
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'number',
		default: 0,
		description: 'Template ID from template library or custom template',
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},

	{
		displayName: 'Override Script',
		name: 'overrideScript',
		type: 'string',
		default: '',
		description: 'You can enter the script you want to use here to override the existing script',
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},
	{
		displayName: 'Captions',
		name: 'caption',
		type: 'boolean',
		default: false,
		description: 'Controls subtitle rendering',
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
			},
		},
	},
	{
		displayName: 'Video Name',
		name: 'videoName',
		type: 'string',
		default: '',
		description:
			'If you want to specify the name of the generated video, please use this parameter',
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
				operation: [URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value],
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
		video_name: videoName,
		override_script: overrideScript,
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

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
