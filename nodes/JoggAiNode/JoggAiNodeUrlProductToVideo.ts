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

export const urlProductToVideoProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['urlProductToVideo'],
			},
		},
		options: [
			{
				name: 'Upload URL to Create Product',
				value: 'uploadUrlCreateProduct',
				description:
					'Get product information by crawling the provided URL or create a new product with provided information',
				action: 'Upload URL to Create Product',
			},
			{
				name: 'Update Product Information',
				value: 'updateProductInformation',
				description: 'Optional step to update product details',
				action: 'Update Product Information',
			},
			{
				name: 'Generate Video From Product Information',
				value: 'generateVideoFromProductInformation',
				description: 'Final step to generate the product video',
				action: 'Generate Video from Product Information',
			},
			{
				name: 'Generate Preview Video From Product Information',
				value: 'generatePreviewVideoFromProductInformation',
				description: 'You can generate a preview video using the product_id obtained from the Upload URL to create a product',
				action: 'Generate Preview Video from Product Information',
			},
		],
		default: 'uploadUrlCreateProduct',
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
		case 'uploadUrlCreateProduct':
			return await executeUploadUrlCreateProductOperation.call(this, i);
		case 'updateProductInformation':
			return await executeUpdateProductInformationOperation.call(this, i);
		case 'generateVideoFromProductInformation':
			return await executeGenerateVideoFromProductOperation.call(this, i);
		case 'generatePreviewVideoFromProductInformation':
			return await executeGeneratePreviewVideoFromProductOperation.call(this, i);
		default:
			return [];
	}
}
