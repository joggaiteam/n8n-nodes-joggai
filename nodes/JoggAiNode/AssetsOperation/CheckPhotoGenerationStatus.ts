import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

import { ASSETS_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode';

export const checkPhotoStatusProperties: INodeProperties[] = [
	{
		displayName: 'Photo ID',
		name: 'photoId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [ASSETS_RESOURCE.value],
				operation: [ASSETS_RESOURCE.operation.CHECK_PHOTO_GENERATION_STATUS.value],
			},
		},
		required: true,
	},
];

export async function executeCheckPhotoStatusOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const photoId = this.getNodeParameter('photoId', i) as string;

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}/v1/photo_avatar/generation`,
		headers: {
			'x-api-key': credentials.apiKey as string,
		},
		qs: {
			photo_id: photoId,
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
