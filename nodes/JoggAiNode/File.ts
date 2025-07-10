import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { FILE_RESOURCE } from '../../const/joggAiNode2';

import { uploadMediaProperties, executeUploadMediaOperation } from './FileOperation/UploadMedia';

export const fileProperties: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [FILE_RESOURCE.value],
			},
		},
		options: [
			{
				name: FILE_RESOURCE.operation.UPLOAD.name,
				value: FILE_RESOURCE.operation.UPLOAD.value,
				description: FILE_RESOURCE.operation.UPLOAD.description,
				action: FILE_RESOURCE.operation.UPLOAD.action,
			},
		],
		default: FILE_RESOURCE.operation.UPLOAD.value,
		required: true,
	},
	...uploadMediaProperties,
];

export async function executeFileOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case FILE_RESOURCE.operation.UPLOAD.value:
			return await executeUploadMediaOperation.call(this, i);
		default:
			return [];
	}
}
