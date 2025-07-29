import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';

import { AVATAR_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

import { motionModelOptions } from '../../../const/model';

export const addMotionProperties: INodeProperties[] = [
	// ----------------------------------
	//         Required Fields
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'A name for the motion avatar',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.CREATE_PHOTO_AVATAR.value],
			},
		},
	},
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/photo.png',
		description: 'The URL of the source photo',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.CREATE_PHOTO_AVATAR.value],
			},
		},
	},
	{
		displayName: 'Voice ID',
		name: 'voiceId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'en-US-ChristopherNeural',
		description: 'The voice ID to use for text-to-speech',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.CREATE_PHOTO_AVATAR.value],
			},
		},
	},
	{
		displayName: 'Model',
		name: 'modelVersion',
		type: 'options',
		options: motionModelOptions,
		required: true,
		default: '3.0',
		description: 'The generation model to use',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.CREATE_PHOTO_AVATAR.value],
			},
		},
	},
	// ----------------------------------
	//         Optional Fields
	// ----------------------------------
	{
		displayName: 'Optional Fields',
		name: 'optionalFields',
		type: 'collection',
		placeholder: 'Add Optional Field',
		default: {},
		description: 'Add optional parameters to customize the motion avatar',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.CREATE_PHOTO_AVATAR.value],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					multiline: true,
				},
				default: '',
				description: 'The script or description for the avatar to speak',
			},
			{
				displayName: 'Description Limit Notice',
				name: 'descriptionNotice',
				type: 'notice',
				default:
					'For Model 1.0, the description must be under 300 bytes. For other models, it must not exceed 1500 bytes.',
				description: 'Note the character limits for the description field',
			},
			{
				displayName: 'Photo ID',
				name: 'photoId',
				type: 'string',
				default: '',
				description: 'The ID of a previously generated photo to use',
			},
			{
				displayName: 'Welcome Message',
				name: 'welcomeMsg',
				type: 'string',
				typeOptions: {
					multiline: true,
				},
				default: '',
				description: 'Use this parameter to replace the default greeting message',
			},
		],
	},
];

export async function executeAddMotionOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const imageUrl = this.getNodeParameter('imageUrl', i) as string;
	const name = this.getNodeParameter('name', i) as string;
	const voiceId = this.getNodeParameter('voiceId', i) as string;
	const modelVersion = this.getNodeParameter('modelVersion', i) as string;

	const optionalFields = this.getNodeParameter('optionalFields', i) as {
		description?: string;
		photoId?: string;
		welcomeMsg?: string;
	};

	const description = optionalFields.description || '';
	const photoId = optionalFields.photoId || '';
	const welcomeMsg = optionalFields.welcomeMsg || '';

	const body = {
		description,
		image_url: imageUrl,
		model: modelVersion,
		name,
		photo_id: photoId,
		welcome_msg: welcomeMsg,
		voice_id: voiceId,
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/photo_avatar/add_motion`,
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
