import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { VOICE_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

import { notSelectOption } from '../../../const/notSelect';
import { languageOptions } from '../../../const/language';
import { ageOptions } from '../../../const/age';
import { genderOptions } from '../../../const/gender';

export const getLibraryVoicesProperties: INodeProperties[] = [
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 1,
		description: 'Page number',
		displayOptions: {
			show: {
				resource: [VOICE_RESOURCE.value],
				operation: [VOICE_RESOURCE.operation.GET_LIBRARY_VOICES.value],
			},
		},
	},
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 10,
		displayOptions: {
			show: {
				resource: [VOICE_RESOURCE.value],
				operation: [VOICE_RESOURCE.operation.GET_LIBRARY_VOICES.value],
			},
		},
	},

	{
		displayName: 'Age',
		name: 'age',
		type: 'options',
		options: [notSelectOption, ...ageOptions],
		default: '',
		description: 'Filter voices by age',
		displayOptions: {
			show: {
				resource: [VOICE_RESOURCE.value],
				operation: [VOICE_RESOURCE.operation.GET_LIBRARY_VOICES.value],
			},
		},
	},
	{
		displayName: 'Gender',
		name: 'gender',
		type: 'options',
		options: [notSelectOption, ...genderOptions],
		default: '',
		description: 'Filter voices by gender',
		displayOptions: {
			show: {
				resource: [VOICE_RESOURCE.value],
				operation: [VOICE_RESOURCE.operation.GET_LIBRARY_VOICES.value],
			},
		},
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'options',
		options: [notSelectOption, ...languageOptions],
		default: '',
		description: 'Filter voices by language',
		displayOptions: {
			show: {
				resource: [VOICE_RESOURCE.value],
				operation: [VOICE_RESOURCE.operation.GET_LIBRARY_VOICES.value],
			},
		},
	},
];

export async function executeGetLibraryVoicesOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	let endpoint = `/v1/voices`;

	const language = this.getNodeParameter('language', i) as string;
	const page = this.getNodeParameter('page', i) as number;
	const pageSize = this.getNodeParameter('pageSize', i) as number;
	const age = this.getNodeParameter('age', i) as string;
	const gender = this.getNodeParameter('gender', i) as string;

	const qs: IDataObject = {
		language: language,
		page: page,
		page_size: pageSize,
		age: age,
		gender: gender,
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}${endpoint}`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		json: true,
		qs: qs,
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
