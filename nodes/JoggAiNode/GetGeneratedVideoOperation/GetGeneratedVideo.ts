import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

export const getGeneratedVideoProperties: INodeProperties[] = [
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

export async function executeGetGeneratedVideoOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const projectId = this.getNodeParameter('projectId', i) as number;

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

	this.logger.info('send request: ' + JSON.stringify(options));

	const responseData = await this.helpers.httpRequest(options);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);

	returnData.push(...executionData);

	return returnData;
}
