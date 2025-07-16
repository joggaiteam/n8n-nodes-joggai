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
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		description: 'Filter the list of avatars by specific criteria',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.value],
			},
		},
		options: [
			{
				displayName: 'Age',
				name: 'age',
				type: 'options',
				options: [notSelectOption, ...avatarAgeOptions],
				default: '',
				description: 'Filter by avatar age',
			},
			{
				displayName: 'Aspect Ratio',
				name: 'aspect_ratio',
				type: 'options',
				options: talkingAvatarAspectRatioOptions,
				default: 0,
				description: 'Filter by screen aspect ratio',
			},
			{
				displayName: 'Ethnicity',
				name: 'ethnicity',
				type: 'options',
				options: [notSelectOption, ...ethnicity2Options],
				default: '',
				description: 'Filter by avatar ethnicity',
			},
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				options: [notSelectOption, ...genderOptions],
				default: '',
				description: 'Filter by avatar gender',
			},
			{
				displayName: 'Scene',
				name: 'scene',
				type: 'options',
				options: [notSelectOption, ...sceneOptions],
				default: '',
				description: 'Filter by avatar scene',
			},
			{
				displayName: 'Style',
				name: 'style',
				type: 'options',
				options: [notSelectOption, ...avatarStyle2Options],
				default: '',
				description: 'Filter by avatar style',
			},
		],
	},
];

export async function executeGetAvatarListFromLibraryOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

	const style = (filters.style as string) || '';
	const gender = (filters.gender as string) || '';
	const aspectRatio = (filters.aspect_ratio as number) || 0;
	const age = (filters.age as string) || '';
	const scene = (filters.scene as string) || '';
	const ethnicity = (filters.ethnicity as string) || '';

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
