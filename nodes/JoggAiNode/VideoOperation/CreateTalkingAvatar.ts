import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';

import { VIDEO_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

import { screenStyleOptions } from '../../../const/screenStyle';
import { talkingAvatarTypeOptions } from '../../../const/avatarType';
import { productVideoAspectRatioOptions } from '../../../const/aspectRatio';

export const createTalkingAvatarProperties: INodeProperties[] = [
	// ----------------------------------
	//         Required Fields
	// ----------------------------------
	{
		displayName: 'Avatar Type',
		name: 'avatar_type',
		type: 'options',
		required: true,
		options: talkingAvatarTypeOptions,
		default: 0,
		description: 'Source type of the avatar',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.value],
			},
		},
	},
	{
		displayName: 'Avatar ID',
		name: 'avatar_id',
		type: 'number',
		required: true,
		default: '',
		placeholder: '405',
		description: 'ID of the avatar to use',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.value],
			},
		},
	},
	{
		displayName: 'Voice ID',
		name: 'voice_id',
		type: 'string',
		required: true,
		default: 'tb_e63bb35b3c2445809f8ee3d5c5bd1197',
		placeholder: 'tb_e63bb35b3c2445809f8ee3d5c5bd1197',
		description: 'ID of the text-to-speech (TTS) voice to use',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.value],
			},
		},
	},
	{
		displayName: 'Screen Style',
		name: 'screen_style',
		type: 'options',
		required: true,
		options: screenStyleOptions,
		default: 1,
		description: 'Background style for the output video',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.value],
			},
		},
	},

	// ----------------------------------
	//  Script/Audio Source (Mutually Exclusive)(Required)
	// ----------------------------------
	{
		displayName: 'Audio Source',
		name: 'audioSource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Text Script',
				value: 'script',
			},
			{
				name: 'Audio File URL',
				value: 'audio_url',
			},
		],
		default: 'script',
		description: 'Choose to provide a text script for the AI to speak, or a direct URL to an audio file',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.value],
			},
		},
	},
	{
		displayName: 'Script',
		name: 'script',
		type: 'string',
		default: '',
		description: 'Script content for the avatar to speak',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.value],
				audioSource: ['script'],
			},
		},
	},
	{
		displayName: 'Audio URL',
		name: 'audio_url',
		type: 'string',
		default: '',
		description: 'URL for the audio file that the avatar will lip-sync to',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.value],
				audioSource: ['audio_url'],
			},
		},
	},
	// ----------------------------------
	//         Additional Options
	// ----------------------------------
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.value],
			},
		},
		options: [
			{
				displayName: 'Aspect Ratio',
				name: 'aspect_ratio',
				type: 'options',
				options: productVideoAspectRatioOptions,
				default: 0,
				description: 'Aspect ratio of the output video',
			},
			{
				displayName: 'Enable Caption',
				name: 'caption',
				type: 'boolean',
				default: false,
				description: 'Whether to generate and display captions in the video',
			},
			{
				displayName: 'Video Name',
				name: 'video_name',
				type: 'string',
				default: '',
				placeholder: 'My First Avatar Video',
				description: 'Specify a name for the generated video file',
			},
		],
	},
];

export async function executeCreateTalkingAvatarOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const audioSource = this.getNodeParameter('audioSource', i) as string;
	let script = '';
	let audioUrl = '';

	if (audioSource === 'script') {
		script = this.getNodeParameter('script', i) as string;
	} else {
		audioUrl = this.getNodeParameter('audio_url', i) as string;
	}

	const avatarId = this.getNodeParameter('avatar_id', i) as number;
	const avatarType = this.getNodeParameter('avatar_type', i) as number;
	const voiceId = this.getNodeParameter('voice_id', i) as string;
	const screenStyle = this.getNodeParameter('screen_style', i) as number;

	const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;
	const aspectRatio = (additionalOptions.aspect_ratio as number) || 0;
	const caption = (additionalOptions.caption as boolean) || false;
	const videoName = (additionalOptions.video_name as string) || 'My Video';

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
