import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';

import { AVATAR_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

export const checkPhotoStatusProperties: INodeProperties[] = [
	{
		displayName: 'Photo ID',
		name: 'photo_id',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the photo generation task to check',
		placeholder: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
				operation: [AVATAR_RESOURCE.operation.CHECK_PHOTO_STATUS.value],
			},
		},
	},
];

export async function executeCheckPhotoStatusOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const photoId = this.getNodeParameter('photo_id', i) as string;

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}/v1/photo_avatar/generation`,
		qs: {
			photo_id: photoId,
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
