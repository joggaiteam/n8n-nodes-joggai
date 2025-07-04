import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { LOOKUP_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode';

import { notSelectOption } from '../../../const/notSelect';
import { languageOptions } from '../../../const/language';
import { ageOptions } from '../../../const/age';
import { genderOptions } from '../../../const/gender';

export const voiceListProperties: INodeProperties[] = [
	{
		displayName: 'Source',
		name: 'source',
		type: 'options',
		required: true,
		default: 'voices',
		displayOptions: {
			show: {
				resource: [LOOKUP_RESOURCE.value],
				operation: [LOOKUP_RESOURCE.operation.LIST_VOICE.value],
			},
		},
		options: [
			{
				name: 'Public',
				value: 'voices',
				description: 'Retrieve a list of available voices with specified filters',
			},
			{
				name: 'My Voices',
				value: 'voices/custom',
				description: 'Retrieve a list of your available voice with specified gender filter',
			},
		],
	},
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
				resource: [LOOKUP_RESOURCE.value],
				operation: [LOOKUP_RESOURCE.operation.LIST_VOICE.value],
				source: ['voices'],
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
				resource: [LOOKUP_RESOURCE.value],
				operation: [LOOKUP_RESOURCE.operation.LIST_VOICE.value],
				source: ['voices'],
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
				resource: [LOOKUP_RESOURCE.value],
				operation: [LOOKUP_RESOURCE.operation.LIST_VOICE.value],
				source: ['voices'],
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
				resource: [LOOKUP_RESOURCE.value],
				operation: [LOOKUP_RESOURCE.operation.LIST_VOICE.value],
				source: ['voices'],
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
				resource: [LOOKUP_RESOURCE.value],
				operation: [LOOKUP_RESOURCE.operation.LIST_VOICE.value],
				source: ['voices', 'voices/custom'],
			},
		},
	},
];

export async function executeVoiceListOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const source = this.getNodeParameter('source', i) as string;

	let endpoint = `/v1/${source}`;

	const qs: IDataObject = {};

	const language = this.getNodeParameter('language', i) as string;
	qs.language = language;

	if (source === 'voices') {
		const page = this.getNodeParameter('page', i) as number;
		qs.page = page;

		const pageSize = this.getNodeParameter('pageSize', i) as number;
		qs.page_size = pageSize;

		const age = this.getNodeParameter('age', i) as string;
		qs.age = age;

		const gender = this.getNodeParameter('gender', i) as string;
		qs.gender = gender;
	}

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
