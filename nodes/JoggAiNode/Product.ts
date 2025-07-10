import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { PRODUCT_RESOURCE } from '../../const/joggAiNode2';

import {
	uploadUrlCreateProductProperties,
	executeUploadUrlCreateProductOperation,
} from './ProductOperation/UploadUrlCreateProduct';
import {
	updateProductInformationProperties,
	executeUpdateProductInformationOperation,
} from './ProductOperation/UpdateProductInformation';

export const productProperties: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [PRODUCT_RESOURCE.value],
			},
		},
		options: [
			{
				name: PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.name,
				value: PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value,
				description: PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.description,
				action: PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.action,
			},
			{
				name: PRODUCT_RESOURCE.operation.UPDATE_PRODUCT.name,
				value: PRODUCT_RESOURCE.operation.UPDATE_PRODUCT.value,
				description: PRODUCT_RESOURCE.operation.UPDATE_PRODUCT.description,
				action: PRODUCT_RESOURCE.operation.UPDATE_PRODUCT.action,
			},
		],
		default: PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value,
		required: true,
	},
	...uploadUrlCreateProductProperties,
	...updateProductInformationProperties,
];

export async function executeProductOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case PRODUCT_RESOURCE.operation.UPLOAD_PRODUCT.value:
			return await executeUploadUrlCreateProductOperation.call(this, i);
		case PRODUCT_RESOURCE.operation.UPDATE_PRODUCT.value:
			return await executeUpdateProductInformationOperation.call(this, i);
		default:
			return [];
	}
}
