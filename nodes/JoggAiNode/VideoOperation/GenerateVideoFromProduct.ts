import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

import { languageOptions } from '../../../const/language';
import { scriptStyleOptions } from '../../../const/scriptStyle';

import { VIDEO_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';
import { productVideoTemplateTypeOptions } from '../../../const/templateType';
import { avatarTypeOptions } from '../../../const/avatarType';
import { productVideoAspectRatioOptions } from '../../../const/aspectRatio';
import { videoLengthOptions } from '../../../const/videoLength';

export const generateVideoFromProductInformationProperties: INodeProperties[] = [
	// ----------------------------------
	//         Primary Required Fields
	// ----------------------------------
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		default: '',
		description: 'Product ID obtained from the "Create Product" step',
		placeholder: 'NTIzMzc0NjI5',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
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
		description: 'The aspect ratio of the final video',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
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
		description: 'The target duration of the video',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	// ----------------------------------
	//         Content & Script
	// ----------------------------------
	{
		displayName: 'Content & Script',
		name: 'contentNotice',
		type: 'notice',
		default: 'Define the language and writing style for the video script.',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'options',
		default: 'english',
		description: 'The language for script generation',
		required: true,
		options: languageOptions,
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	{
		displayName: 'Script Style',
		name: 'scriptStyle',
		type: 'options',
		default: 'Soft Selling',
		description: 'The writing style for the video content',
		required: true,
		options: scriptStyleOptions,
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	// ----------------------------------
	//         Avatar
	// ----------------------------------
	{
		displayName: 'Avatar',
		name: 'avatarNotice',
		type: 'notice',
		default: 'Choose the avatar that will present the video.',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
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
		description: 'The source of the avatar to be used',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	{
		displayName: 'Avatar ID',
		name: 'avatarId',
		type: 'number',
		default: 1,
		required: true,
		description: 'The ID of the chosen avatar',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	// ----------------------------------
	//         Styling & Template
	// ----------------------------------
	{
		displayName: 'Styling & Template',
		name: 'stylingNotice',
		type: 'notice',
		default: 'Configure the visual and audio elements of the video.',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
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
		description: 'The source of the template',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'number',
		default: '',
		placeholder: '123',
		required: true,
		description: 'The ID from the selected template library',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	{
		displayName: 'Visual Style',
		name: 'visualStyle',
		type: 'string',
		default: '',
		placeholder: 'Simple Product Switch',
		description: 'Visual style from the visual list (GET /visual)',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	{
		displayName: 'Voice ID',
		name: 'voiceId',
		type: 'string',
		default: 'en-US-ChristopherNeural',
		description: 'The ID of the voice to use',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	{
		displayName: 'Music ID',
		name: 'musicId',
		type: 'number',
		default: '',
		placeholder: '13',
		description: 'The ID of the background music',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	// ----------------------------------
	//         Overrides & Output
	// ----------------------------------
	{
		displayName: 'Overrides & Output',
		name: 'overridesNotice',
		type: 'notice',
		default: 'Optionally override the script and set final output details.',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	{
		displayName: 'Override Script',
		name: 'overrideScript',
		type: 'string',
		typeOptions: {
			multiline: true,
		},
		default: '',
		description: 'Enter a script here to override the one generated by the selected Script Style',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	{
		displayName: 'Video Name',
		name: 'videoName',
		type: 'string',
		default: '',
		placeholder: 'My New Product Video',
		description: 'Specify a custom name for the generated video',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
			},
		},
	},
	{
		displayName: 'Show Captions',
		name: 'caption',
		type: 'boolean',
		default: true,
		description: 'Whether to render subtitles on the video',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value],
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
		body,
		json: true,
	};

	this.logger.debug('send request: ' + JSON.stringify(options));

	const responseData = await this.helpers.httpRequestWithAuthentication.call(
		this,
		CREDENTIALS_API_NAME,
		options,
	);

	if (responseData.code !== 0) {
		throw new NodeOperationError(
			this.getNode(),
			`${responseData.msg} (code: ${responseData.code}, rid: ${responseData.rid})`,
			{ itemIndex: i },
		);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);

	returnData.push(...executionData);

	return returnData;
}
