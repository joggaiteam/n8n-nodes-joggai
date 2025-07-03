import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

export const lookupProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lookup'],
			},
		},
		options: [
			{
				name: 'Get My Voice',
				value: 'voice:list',
				description: 'Retrieve a list of your available voice with specified gender filter',
				action: 'Get My Voice',
			},
			{
				name: 'Get Visual Style',
				value: 'visualStyle:list',
				description: 'Get list of Visual Style',
				action: 'Get Visual Style',
			},
			{
				name: 'Get My Template',
				value: 'template:list',
				description: 'Get list of your custom templates',
				action: 'Get My Template',
			},
			{
				name: 'Get Music List from JoggAI',
				value: 'music:list',
				description: 'Get a list of jogg music',
				action: 'Get Music List from JoggAI',
			},
		],
		default: 'voice:list',
		required: true,
	},
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
	{
		displayName: 'Source',
		name: 'templateSource',
		type: 'options',
		required: true,
		default: 'templates',
		displayOptions: {
			show: {
				resource: ['lookup'],
				operation: ['template:list'],
			},
		},
		options: [
			{
				name: 'Public',
				value: 'templates',
				description: 'Get list of templates',
			},
			{
				name: 'My Templates',
				value: 'templates/custom',
				description: 'Get list of your custom templates',
			},
		],
	},
	{
		displayName: 'Aspect Ratio',
		description: 'Screen aspect ratio',
		name: 'aspectRatio',
		type: 'options',
		required: false,
		default: -1,
		displayOptions: {
			show: {
				resource: ['lookup'],
				operation: ['visualStyle:list', 'template:list'],
			},
		},
		options: [
			{
				name: 'All',
				value: -1,
			},
			{
				name: '[9:16]',
				value: 0,
			},
			{
				name: '[16:9]',
				value: 1,
			},
			{
				name: '[1:1]',
				value: 2,
			},
		],
	},
];

export async function executeLookupOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case 'voice:list':
			return await executeVoiceListOperation.call(this, i);
		case 'visualStyle:list':
			return await executeVisualStyleListOperation.call(this, i);
		case 'template:list':
			return await executeTemplateListOperation.call(this, i);
		case 'music:list':
			return await executeMusicListOperation.call(this, i);
		default:
			return [];
	}
}

async function executeVoiceListOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// 获取来源参数
	const source = this.getNodeParameter('source', i) as string;

	// 根据来源选择不同的API端点
	let endpoint = `/v1/${source}`;

	// 如果是公共声音，添加查询参数
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

		// 添加查询参数到端点
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

	// 调试输出请求参数
	this.logger.info('请求参数: ' + JSON.stringify(options));

	const responseData = await this.helpers.httpRequest(options);

	// 直接返回整个响应数据
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);
	returnData.push(...executionData);

	return returnData;
}

async function executeVisualStyleListOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const credentials = await this.getCredentials('joggAiCredentialsApi');

	let endpoint = `/v1/visual_styles`;
	const aspectRatio = this.getNodeParameter('aspectRatio', i) as string;
	const queryParams = [];
	if (aspectRatio !== undefined) {
		queryParams.push(`aspect_ratio=${aspectRatio}`);
	}
	if (queryParams.length > 0) {
		endpoint += `?${queryParams.join('&')}`;
	}

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}${endpoint}`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	// 调试输出请求参数
	this.logger.info('请求参数: ' + JSON.stringify(options));

	const responseData = await this.helpers.httpRequest(options);

	// 直接返回整个响应数据
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);
	returnData.push(...executionData);

	return returnData;
}

async function executeTemplateListOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// 获取模板来源参数
	const templateSource = this.getNodeParameter('templateSource', i) as string;

	// 根据来源选择不同的API端点
	let endpoint = `/v1/${templateSource}`;

	const aspectRatio = this.getNodeParameter('aspectRatio', i) as string;
	const queryParams = [];
	if (aspectRatio !== undefined) {
		queryParams.push(`aspect_ratio=${aspectRatio}`);
	}
	if (queryParams.length > 0) {
		endpoint += `?${queryParams.join('&')}`;
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

	// 调试输出请求参数
	this.logger.info('请求参数: ' + JSON.stringify(options));

	const responseData = await this.helpers.httpRequest(options);

	// 直接返回整个响应数据
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);
	returnData.push(...executionData);

	return returnData;
}

async function executeMusicListOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const credentials = await this.getCredentials('joggAiCredentialsApi');

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}/v1/musics`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	// 调试输出请求参数
	this.logger.info('请求参数: ' + JSON.stringify(options));

	const responseData = await this.helpers.httpRequest(options);

	// 直接返回整个响应数据
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);
	returnData.push(...executionData);

	return returnData;
}
