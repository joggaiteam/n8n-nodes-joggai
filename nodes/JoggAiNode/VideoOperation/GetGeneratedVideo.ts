import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';

import { VIDEO_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

export const getGeneratedVideoProperties: INodeProperties[] = [
	{
		displayName: 'Video ID',
		name: 'project_id',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the video to retrieve information for',
		placeholder: '30062015eb6742acadf68e17af2937d3',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.GET.value],
			},
		},
	},
];

export async function executeGetGeneratedVideoOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const projectId = this.getNodeParameter('project_id', i) as string;

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}/v1/project`,
		qs: {
			project_id: projectId,
		},
		json: true,
	};

	this.logger.info('send request: ' + JSON.stringify(options));

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
