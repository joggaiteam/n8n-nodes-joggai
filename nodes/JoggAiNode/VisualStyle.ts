import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { VISUAL_STYLE_RESOURCE } from '../../const/joggAiNode2';

import {
	visualStyleListProperties,
	executeVisualStyleListOperation,
} from './VisualStyleOperation/GetVisualStyle';

export const visualStyleProperties: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [VISUAL_STYLE_RESOURCE.value],
			},
		},
		options: [
			{
				name: VISUAL_STYLE_RESOURCE.operation.GET.name,
				value: VISUAL_STYLE_RESOURCE.operation.GET.value,
				description: VISUAL_STYLE_RESOURCE.operation.GET.description,
				action: VISUAL_STYLE_RESOURCE.operation.GET.action,
			},
		],
		default: VISUAL_STYLE_RESOURCE.operation.GET.value,
		required: true,
	},
	...visualStyleListProperties,
];

export async function executeVisualStyleOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case VISUAL_STYLE_RESOURCE.operation.GET.value:
			return await executeVisualStyleListOperation.call(this, i);
		default:
			return [];
	}
}
