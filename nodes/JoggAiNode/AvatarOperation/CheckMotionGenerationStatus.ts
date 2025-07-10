import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

import { AVATAR_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

export const checkMotionStatusProperties: INodeProperties[] = [
	{
		displayName: 'Motion ID',
		name: 'motionId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.CHECK_PHOTO_AVATAR_STATUS.value],
			},
		},
		required: true,
	},
];

export async function executeCheckMotionStatusOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const motionId = this.getNodeParameter('motionId', i) as string;

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}/v1/photo_avatar`,
		headers: {
			'x-api-key': credentials.apiKey as string,
		},
		qs: {
			motion_id: motionId,
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
