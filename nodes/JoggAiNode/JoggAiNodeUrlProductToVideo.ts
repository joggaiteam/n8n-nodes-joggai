import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import {
	uploadUrlCreateProductProperties,
	executeUploadUrlCreateProductOperation,
} from './UrlToVideoOperation/UploadUrlCreateProduct';
import {
	updateProductInformationProperties,
	executeUpdateProductInformationOperation,
} from './UrlToVideoOperation/UpdateProductInformation';
import {
	generateVideoFromProductInformationProperties,
	executeGenerateVideoFromProductOperation,
} from './UrlToVideoOperation/GenerateVideoFromProduct';
import {
	generatePreviewVideoFromProductProperties,
	executeGeneratePreviewVideoFromProductOperation,
} from './UrlToVideoOperation/GeneratePreviewVideoFromProduct';

import { URL_TO_VIDEO_RESOURCE } from '../../const/joggAiNode';

export const urlProductToVideoProperties: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [URL_TO_VIDEO_RESOURCE.value],
			},
		},
		options: [
			{
				name: URL_TO_VIDEO_RESOURCE.operation.UPLOAD_URL_TO_CREATE_PRODUCT.name,
				value: URL_TO_VIDEO_RESOURCE.operation.UPLOAD_URL_TO_CREATE_PRODUCT.value,
				description: URL_TO_VIDEO_RESOURCE.operation.UPLOAD_URL_TO_CREATE_PRODUCT.description,
				action: URL_TO_VIDEO_RESOURCE.operation.UPLOAD_URL_TO_CREATE_PRODUCT.name,
			},
			{
				name: URL_TO_VIDEO_RESOURCE.operation.UPDATE_PRODUCT_INFORMATION.name,
				value: URL_TO_VIDEO_RESOURCE.operation.UPDATE_PRODUCT_INFORMATION.value,
				description: URL_TO_VIDEO_RESOURCE.operation.UPDATE_PRODUCT_INFORMATION.description,
				action: URL_TO_VIDEO_RESOURCE.operation.UPDATE_PRODUCT_INFORMATION.name,
			},
			{
				name: URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.name,
				value: URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value,
				description:
					URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.description,
				action: URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.name,
			},
			{
				name: URL_TO_VIDEO_RESOURCE.operation.GENERATE_PREVIEW_VIDEO_FROM_PRODUCT_INFORMATION.name,
				value:
					URL_TO_VIDEO_RESOURCE.operation.GENERATE_PREVIEW_VIDEO_FROM_PRODUCT_INFORMATION.value,
				description:
					URL_TO_VIDEO_RESOURCE.operation.GENERATE_PREVIEW_VIDEO_FROM_PRODUCT_INFORMATION
						.description,
				action:
					URL_TO_VIDEO_RESOURCE.operation.GENERATE_PREVIEW_VIDEO_FROM_PRODUCT_INFORMATION.name,
			},
		],
		default: URL_TO_VIDEO_RESOURCE.operation.UPLOAD_URL_TO_CREATE_PRODUCT.value,
		required: true,
	},
	...uploadUrlCreateProductProperties,
	...updateProductInformationProperties,
	...generateVideoFromProductInformationProperties,
	...generatePreviewVideoFromProductProperties,
];

export async function executeUrlProductToVideoOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case URL_TO_VIDEO_RESOURCE.operation.UPLOAD_URL_TO_CREATE_PRODUCT.value:
			return await executeUploadUrlCreateProductOperation.call(this, i);
		case URL_TO_VIDEO_RESOURCE.operation.UPDATE_PRODUCT_INFORMATION.value:
			return await executeUpdateProductInformationOperation.call(this, i);
		case URL_TO_VIDEO_RESOURCE.operation.GENERATE_VIDEO_FROM_PRODUCT_INFORMATION.value:
			return await executeGenerateVideoFromProductOperation.call(this, i);
		case URL_TO_VIDEO_RESOURCE.operation.GENERATE_PREVIEW_VIDEO_FROM_PRODUCT_INFORMATION.value:
			return await executeGeneratePreviewVideoFromProductOperation.call(this, i);
		default:
			return [];
	}
}
