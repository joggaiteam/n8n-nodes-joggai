import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

import { FILE_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

export const uploadMediaProperties: INodeProperties[] = [
	{
		displayName: 'Filename',
		name: 'filename',
		type: 'string',
		default: '',
		description: 'Data required for file upload',
		displayOptions: {
			show: {
				resource: [FILE_RESOURCE.value],
				operation: [FILE_RESOURCE.operation.UPLOAD.value],
			},
		},
		required: true,
	},
	{
		displayName: 'File Data',
		name: 'fileData',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [FILE_RESOURCE.value],
				operation: [FILE_RESOURCE.operation.UPLOAD.value],
			},
		},
		required: true,
	},
];

export async function executeUploadMediaOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const filename = this.getNodeParameter('filename', i) as string;
	const fileData = this.getNodeParameter('fileData', i) as string;

	const items = this.getInputData();
	if (!items[i].binary) {
		throw new Error('no binary data input');
	}

	const binaryPropertyName = fileData;
	if (!items[i].binary[binaryPropertyName]) {
		throw new Error(`cannot find the binary property: ${binaryPropertyName}`);
	}

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const body = {
		filename: filename,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/upload/asset`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		body,
		json: true,
	};

	this.logger.info('send request: ' + JSON.stringify(options));

	const resultData = {
		assetResponse: undefined,
		uploadStatus: '',
		uploadResponse: undefined,
		uploadError: undefined,
	};

	const responseData = await this.helpers.httpRequest(options);
	resultData.assetResponse = responseData;

	if (responseData?.code === 0) {
		const sign_url = responseData?.data?.sign_url;

		try {
			const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

			const uploadOptions: IHttpRequestOptions = {
				method: 'PUT',
				url: sign_url,
				headers: {
					'Content-Type': 'application/octet-stream',
				},
				body: binaryDataBuffer,
				json: false,
			};

			this.logger.info('upload file...');
			const uploadResponse = await this.helpers.httpRequest(uploadOptions);
			resultData.uploadStatus = 'success';
			resultData.uploadResponse = uploadResponse;
		} catch (error) {
			resultData.uploadStatus = 'error';
			resultData.uploadError = error.message;
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([resultData]),
		{ itemData: { item: i } },
	);

	returnData.push(...executionData);

	return returnData;
}
