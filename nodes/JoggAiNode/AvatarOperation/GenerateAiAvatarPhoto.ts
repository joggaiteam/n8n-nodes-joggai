import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	NodeOperationError,
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
		description: 'The age group of the avatar',
	},
	{
		displayName: 'Aspect Ratio',
		name: 'aspectRatio',
		type: 'options',
		options: photoAspectRatioOptions,
		default: 0,
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value],
			},
		},
		required: true,
		description: 'The aspect ratio of the generated photo',
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
		description: 'The overall style of the avatar photo',
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
		description: 'The gender of the avatar',
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
		description: 'The generation model to use',
	},
	{
		displayName: 'Optional Details',
		name: 'optionalDetails',
		type: 'collection',
		placeholder: 'Add Detail',
		default: {},
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value],
			},
		},
		description: 'Add optional details to further customize the avatar photo',
		options: [
			{
				displayName: 'Ethnicity',
				name: 'ethnicity',
				type: 'options',
				options: [notSelectOption, ...ethnicityOptions],
				default: '',
				description: 'The ethnicity of the avatar',
			},
			{
				displayName: 'Appearance',
				name: 'appearance',
				type: 'string',
				typeOptions: {
					multiline: true,
				},
				default: '',
				placeholder: 'e.g., wearing a red dress, has blonde hair',
				description: 'Describe the desired appearance of the avatar',
			},
			{
				displayName: 'Background',
				name: 'background',
				type: 'string',
				typeOptions: {
					multiline: true,
				},
				default: '',
				placeholder: 'e.g., in a modern office, outdoor cafe',
				description: 'Describe the desired background of the photo',
			},
			{
				displayName: 'Reference Image URL',
				name: 'imageUrl',
				type: 'string',
				default: '',
				placeholder: 'https://example.com/image.png',
				description: 'URL of an image to use for reference',
			},
		],
	},
];

export async function executeGenerateAiAvatarPhotoOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const age = this.getNodeParameter('age', i) as string;
	const aspectRatio = this.getNodeParameter('aspectRatio', i) as number;
	const avatarStyle = this.getNodeParameter('avatarStyle', i) as string;
	const gender = this.getNodeParameter('gender', i) as string;
	const model = this.getNodeParameter('model', i) as string;

	const optionalDetails = this.getNodeParameter('optionalDetails', i) as {
		ethnicity?: string;
		appearance?: string;
		background?: string;
		imageUrl?: string;
	};

	const body = {
		age,
		aspect_ratio: aspectRatio,
		avatar_style: avatarStyle,
		gender,
		model,
		ethnicity: optionalDetails.ethnicity || '',
		appearance: optionalDetails.appearance || '',
		background: optionalDetails.background || '',
		image_url: optionalDetails.imageUrl || '',
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/photo_avatar/photo/generate`,
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
			`${responseData.msg} (code: ${responseData.code})`,
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
