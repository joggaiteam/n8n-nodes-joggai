import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

import { AVATAR_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

import { notSelectOption } from '../../../const/notSelect';
import { photoAgeOptions } from '../../../const/age';
import { photoAspectRatioOptions } from '../../../const/aspectRatio';
import { avatarStyleOptions } from '../../../const/avatarStyle';
import { genderCapitalOptions } from '../../../const/gender';
import { photoModelOptions } from '../../../const/model';
import { ethnicityOptions } from '../../../const/ethnicity';

export const generateAiAvatarPhotoProperties: INodeProperties[] = [
	{
		displayName: 'Age',
		name: 'age',
		type: 'options',
		options: photoAgeOptions,
		default: 'Adult',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value],
			},
		},
		required: true,
	},
	{
		displayName: 'Aspect Ratio',
		name: 'aspectRatio',
		type: 'options',
		options: photoAspectRatioOptions,
		default: 0,
		description: 'Photo aspect ratio',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value],
			},
		},
		required: true,
	},
	{
		displayName: 'Avatar Style',
		name: 'avatarStyle',
		type: 'options',
		options: avatarStyleOptions,
		default: 'Professional',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value],
			},
		},
		required: true,
	},
	{
		displayName: 'Gender',
		name: 'gender',
		type: 'options',
		options: genderCapitalOptions,
		default: 'Female',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value],
			},
		},
		required: true,
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		options: photoModelOptions,
		default: 'classic',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value],
			},
		},
		required: true,
	},
	{
		displayName: 'Appearance',
		name: 'appearance',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value],
			},
		},
	},
	{
		displayName: 'Background',
		name: 'background',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value],
			},
		},
	},
	{
		displayName: 'Ethnicity',
		name: 'ethnicity',
		type: 'options',
		options: [notSelectOption, ...ethnicityOptions],
		default: '',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value],
			},
		},
	},
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value],
			},
		},
	},
];

export async function executeGenerateAiAvatarPhotoOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const age = this.getNodeParameter('age', i) as string;
	const appearance = this.getNodeParameter('appearance', i) as string;
	const aspectRatio = this.getNodeParameter('aspectRatio', i) as number;
	const avatarStyle = this.getNodeParameter('avatarStyle', i) as string;
	const background = this.getNodeParameter('background', i) as string;
	const ethnicity = this.getNodeParameter('ethnicity', i) as string;
	const gender = this.getNodeParameter('gender', i) as string;
	const imageUrl = this.getNodeParameter('imageUrl', i) as string;
	const model = this.getNodeParameter('model', i) as string;

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const body = {
		age,
		appearance,
		aspect_ratio: aspectRatio,
		avatar_style: avatarStyle,
		background,
		ethnicity,
		gender,
		image_url: imageUrl,
		model,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/photo_avatar/photo/generate`,
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
