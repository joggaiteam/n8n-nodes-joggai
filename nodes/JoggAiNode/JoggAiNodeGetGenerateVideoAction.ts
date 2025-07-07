import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import {
	getGeneratedVideoProperties,
	executeGetGeneratedVideoOperation,
} from './GetGeneratedVideoOperation/GetGeneratedVideo';

import { GET_GENERATED_VIDEO_RESOURCE } from '../../const/joggAiNode';

export const getGenerateVideoActionProperties: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [GET_GENERATED_VIDEO_RESOURCE.value],
			},
		},
		options: [
			{
				name: GET_GENERATED_VIDEO_RESOURCE.operation.GET_GENERATED_VIDEO.name,
				value: GET_GENERATED_VIDEO_RESOURCE.operation.GET_GENERATED_VIDEO.value,
				description: GET_GENERATED_VIDEO_RESOURCE.operation.GET_GENERATED_VIDEO.description,
				action: GET_GENERATED_VIDEO_RESOURCE.operation.GET_GENERATED_VIDEO.name,
			},
		],
		default: GET_GENERATED_VIDEO_RESOURCE.operation.GET_GENERATED_VIDEO.value,
		required: true,
	},
	...getGeneratedVideoProperties,
];

export async function executeGetGenerateVideoActionOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case GET_GENERATED_VIDEO_RESOURCE.operation.GET_GENERATED_VIDEO.value:
			return await executeGetGeneratedVideoOperation.call(this, i);
		default:
			return [];
	}
}
