import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

export const getGenerateVideoActionProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['getGeneratedVideoAction'],
			},
		},
		options: [
			{
				name: 'Get Generated Video',
				value: 'getGeneratedVideo',
				description: 'Get information about a specific project using its ID.',
				action: 'Get Generated Video',
			},
		],
		default: 'getGeneratedVideo',
		required: true,
	},
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		default: '',
		description: 'The ID of the project to retrieve',
		displayOptions: {
			show: {
				resource: ['getGeneratedVideoAction'],
				operation: ['getGeneratedVideo'],
			},
		},
		required: true,
	},
];

export async function executeGetGenerateVideoActionOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case 'getGeneratedVideo':
			return await executeGetGenerateVideoOperation.call(this, i);
		default:
			return [];
	}
}

async function executeGetGenerateVideoOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// 获取项目ID
	const projectId = this.getNodeParameter('projectId', i) as number;

	// 获取凭证
	const credentials = await this.getCredentials('joggAiCredentialsApi');

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}/v1/project`,
		headers: {
			'x-api-key': credentials.apiKey as string,
		},
		qs: {
			project_id: projectId,
		},
		json: true,
	};

	this.logger.info('请求参数: ' + JSON.stringify(options));

	// 发送请求并获取响应
	const responseData = await this.helpers.httpRequest(options);

	// 处理响应数据
	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);

	returnData.push(...executionData);

	return returnData;
}
