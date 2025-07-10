import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { AVATAR_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';
import { avatarStyle2Options } from '../../../const/avatarStyle';
import { genderOptions } from '../../../const/gender';
import { talkingAvatarAspectRatioOptions } from '../../../const/aspectRatio';
import { avatarAgeOptions } from '../../../const/age';
import { ethnicity2Options } from '../../../const/ethnicity';
import { notSelectOption } from '../../../const/notSelect';
import { sceneOptions } from '../../../const/scene';

export const getAvatarListFromLibraryProperties: INodeProperties[] = [
	{
		displayName: 'Aspect Ratio',
		description: 'Screen aspect ratio',
		name: 'aspectRatio',
		type: 'options',
		default: 0,
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.value],
			},
		},
		options: talkingAvatarAspectRatioOptions,
	},
	{
		displayName: 'Style',
		description: 'Avatar style',
		name: 'style',
		type: 'options',
		default: '',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.value],
			},
		},
		options: [notSelectOption, ...avatarStyle2Options],
	},
	{
		displayName: 'Gender',
		description: 'Avatar gender',
		name: 'gender',
		type: 'options',
		default: '',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.value],
			},
		},
		options: [notSelectOption, ...genderOptions],
	},

	{
		displayName: 'Age',
		description: 'Avatar age',
		name: 'age',
		type: 'options',
		default: '',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.value],
			},
		},
		options: [notSelectOption, ...avatarAgeOptions],
	},
	{
		displayName: 'Scene',
		description: 'Avatar scene',
		name: 'scene',
		type: 'options',
		default: '',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.value],
			},
		},
		options: [notSelectOption, ...sceneOptions],
	},
	{
		displayName: 'Ethnicity',
		description: 'Avatar ethnicity',
		name: 'ethnicity',
		type: 'options',
		default: '',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.value],
			},
		},
		options: [notSelectOption, ...ethnicity2Options],
	},
];

export async function executeGetAvatarListFromLibraryOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const style = this.getNodeParameter('style', i, '') as string;
	const gender = this.getNodeParameter('gender', i, '') as string;
	const aspectRatio = this.getNodeParameter('aspectRatio', i, -1) as number;
	const age = this.getNodeParameter('age', i, '') as string;
	const scene = this.getNodeParameter('scene', i, '') as string;
	const ethnicity = this.getNodeParameter('ethnicity', i, '') as string;

	const qs: IDataObject = {
		style: style,
		gender: gender,
		aspect_ratio: aspectRatio,
		age: age,
		scene: scene,
		ethnicity: ethnicity,
	};

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}/v1/avatars`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		qs,
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
