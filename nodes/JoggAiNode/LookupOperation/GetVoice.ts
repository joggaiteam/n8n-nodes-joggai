import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

export const voiceListProperties: INodeProperties[] = [
	{
		displayName: 'Source',
		name: 'source',
		type: 'options',
		required: true,
		default: 'voices',
		displayOptions: {
			show: {
				resource: ['lookup'],
				operation: ['voice:list'],
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
				resource: ['lookup'],
				operation: ['voice:list'],
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
				resource: ['lookup'],
				operation: ['voice:list'],
				source: ['voices'],
			},
		},
	},

	{
		displayName: 'Age',
		name: 'age',
		type: 'options',
		options: [
			{
				name: 'No Select',
				value: '',
			},
			{
				name: 'Young',
				value: 'young',
			},
			{
				name: 'Middle Aged',
				value: 'middle_aged',
			},
			{
				name: 'Old',
				value: 'old',
			},
		],
		default: '',
		description: 'Filter voices by age',
		displayOptions: {
			show: {
				resource: ['lookup'],
				operation: ['voice:list'],
				source: ['voices'],
			},
		},
	},
	{
		displayName: 'Gender',
		name: 'gender',
		type: 'options',
		options: [
			{
				name: 'No Select',
				value: '',
			},
			{
				name: 'Male',
				value: 'male',
			},
			{
				name: 'Female',
				value: 'female',
			},
		],
		default: '',
		description: 'Filter voices by gender',
		displayOptions: {
			show: {
				resource: ['lookup'],
				operation: ['voice:list'],
				source: ['voices'],
			},
		},
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'options',
		options: [
			{
				name: 'No Select',
				value: '',
			},
			{
				name: 'English',
				value: 'english',
			},
			{
				name: 'Filipino',
				value: 'filipino',
			},
			{
				name: 'French',
				value: 'french',
			},
		],
		default: '',
		description: 'Filter voices by language',
		displayOptions: {
			show: {
				resource: ['lookup'],
				operation: ['voice:list'],
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

	if (source === 'voices') {
		const page = this.getNodeParameter('page', i) as number;
		const pageSize = this.getNodeParameter('pageSize', i) as number;
		const age = this.getNodeParameter('age', i) as string;
		const gender = this.getNodeParameter('gender', i) as string;
		const language = this.getNodeParameter('language', i) as string;

		// 构建查询参数
		const queryParams = [];
		queryParams.push(`page=${page}`);
		queryParams.push(`page_size=${pageSize}`);

		if (age) {
			queryParams.push(`age=${age}`);
		}

		if (gender) {
			queryParams.push(`gender=${gender}`);
		}

		if (language) {
			queryParams.push(`language=${language}`);
		}

		if (queryParams.length > 0) {
			endpoint += `?${queryParams.join('&')}`;
		}
	}

	const credentials = await this.getCredentials('joggAiCredentialsApi');

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}${endpoint}`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	this.logger.info('send request: ' + JSON.stringify(options));

	const responseData = await this.helpers.httpRequest(options);

	// 直接返回整个响应数据
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);
	returnData.push(...executionData);

	return returnData;
}
