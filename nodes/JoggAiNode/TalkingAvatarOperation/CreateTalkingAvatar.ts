import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';

import { TALKING_AVATAR_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode';

import { screenStyleOptions } from '../../../const/screenStyle';
import { talkingAvatarTypeOptions } from '../../../const/avatarType';
import { talkingAvatarAspectRatioOptions } from '../../../const/aspectRatio';

export const createTalkingAvatarProperties: INodeProperties[] = [
	{
		displayName: 'Screen Style',
		name: 'screenStyle',
		type: 'options',
		default: 1,
		options: screenStyleOptions,
		description: 'Background style',
		displayOptions: {
			show: {
				resource: [TALKING_AVATAR_RESOURCE.value],
				operation: [TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.value],
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
				resource: [TALKING_AVATAR_RESOURCE.value],
				operation: [TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.value],
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
		options: talkingAvatarTypeOptions,
		displayOptions: {
			show: {
				resource: [TALKING_AVATAR_RESOURCE.value],
				operation: [TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.value],
			},
		},
		required: true,
	},
	{
		displayName: 'Voice ID',
		name: 'voiceId',
		type: 'string',
		default: '',
		description: 'ID of the text-to-speech voice to use',
		displayOptions: {
			show: {
				resource: [TALKING_AVATAR_RESOURCE.value],
				operation: [TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.value],
			},
		},
		required: true,
	},
	{
		displayName: 'Script',
		name: 'script',
		type: 'string',
		default: '',
		description: 'Script content for the avatar to speak. Must provide either script or audio_script.',
		displayOptions: {
			show: {
				resource: [TALKING_AVATAR_RESOURCE.value],
				operation: [TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.value],
			},
		},
	},
	{
		displayName: 'Audio URL',
		name: 'audioUrl',
		type: 'string',
		default: '',
		description: 'URL for Audio, either script or audio_url must be provided, but not both',
		displayOptions: {
			show: {
				resource: [TALKING_AVATAR_RESOURCE.value],
				operation: [TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.value],
			},
		},
	},
	{
		displayName: 'Aspect Ratio',
		name: 'aspectRatio',
		type: 'options',
		options: talkingAvatarAspectRatioOptions,
		default: 0,
		description: 'Aspect ratio of the output video',
		displayOptions: {
			show: {
				resource: [TALKING_AVATAR_RESOURCE.value],
				operation: [TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.value],
			},
		},
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'boolean',
		default: false,
		// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
		description: 'Subtitle option',
		displayOptions: {
			show: {
				resource: [TALKING_AVATAR_RESOURCE.value],
				operation: [TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.value],
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
				resource: [TALKING_AVATAR_RESOURCE.value],
				operation: [TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.value],
			},
		},
	},
];

export async function executeCreateTalkingAvatarOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const script = this.getNodeParameter('script', i) as string;
	const audioUrl = this.getNodeParameter('audioUrl', i, '') as string;
	const aspectRatio = this.getNodeParameter('aspectRatio', i) as number;
	const screenStyle = this.getNodeParameter('screenStyle', i) as number;
	const avatarId = this.getNodeParameter('avatarId', i) as number;
	const avatarType = this.getNodeParameter('avatarType', i) as number;
	const voiceId = this.getNodeParameter('voiceId', i) as string;
	const caption = this.getNodeParameter('caption', i) as boolean;
	const videoName = this.getNodeParameter('videoName', i, 'My Video') as string;

	const body: IDataObject = {
		avatar_id: avatarId,
		avatar_type: avatarType,
		voice_id: voiceId,
		screen_style: screenStyle,
		script: script,
		audio_url: audioUrl,
		aspect_ratio: aspectRatio,
		caption: caption,
		video_name: videoName,
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

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

	this.logger.info('send request: ' + JSON.stringify(options));

	const responseData = await this.helpers.httpRequest(options);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);

	returnData.push(...executionData);

	return returnData;
}
