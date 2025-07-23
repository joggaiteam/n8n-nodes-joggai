import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

import { VOICE_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

import { notSelectOption } from '../../../const/notSelect';
import { languageOptions } from '../../../const/language';
import { ageOptions } from '../../../const/age';
import { genderOptions } from '../../../const/gender';

export const getLibraryVoicesProperties: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		description: 'Filter the list of voices by specific criteria',
		options: [
			{
				displayName: 'Age',
				name: 'age',
				type: 'options',
				options: [notSelectOption, ...ageOptions],
				default: '',
				description: 'Filter voices by age',
			},
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				options: [notSelectOption, ...genderOptions],
				default: '',
				description: 'Filter voices by gender',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				options: [notSelectOption, ...languageOptions],
				default: '',
				description: 'Filter voices by language',
			},
		],
		displayOptions: {
			show: {
				resource: [VOICE_RESOURCE.value],
				operation: [VOICE_RESOURCE.operation.GET_LIBRARY_VOICES.value],
			},
		},
	},
	{
		displayName: 'Pagination',
		name: 'pagination',
		type: 'collection',
		placeholder: 'Add Pagination Options',
		default: {},
		description: 'Set the page and number of results to return',
		options: [
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'The page number to retrieve',
			},
			{
				displayName: 'Page Size',
				name: 'page_size',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 10,
				description: 'The number of results to return per page',
			},
		],
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

	const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
	const pagination = this.getNodeParameter('pagination', i, {}) as IDataObject;

	const language = (filters.language as string) || '';
	const age = (filters.age as string) || '';
	const gender = (filters.gender as string) || '';

	const page = (pagination.page as number) || 1;
	const pageSize = (pagination.page_size as number) || 10;

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
		url: `${credentials.domain as string}/v1/voices`,
		json: true,
		qs: qs,
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
