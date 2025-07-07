import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import {
	createVideoFromTemplateProperties,
	executeCreateVideoFromTemplateOperation,
} from './TemplateOperation/CreateVideoFromTemplate';

import { TEMPLATE_RESOURCE } from '../../const/joggAiNode';

export const templateProperties: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [TEMPLATE_RESOURCE.value],
			},
		},
		options: [
			{
				name: TEMPLATE_RESOURCE.operation.CREATE_VIDEO_FROM_TEMPLATE.name,
				value: TEMPLATE_RESOURCE.operation.CREATE_VIDEO_FROM_TEMPLATE.value,
				description: TEMPLATE_RESOURCE.operation.CREATE_VIDEO_FROM_TEMPLATE.description,
				action: TEMPLATE_RESOURCE.operation.CREATE_VIDEO_FROM_TEMPLATE.name,
			},
		],
		default: TEMPLATE_RESOURCE.operation.CREATE_VIDEO_FROM_TEMPLATE.value,
		required: true,
	},
	...createVideoFromTemplateProperties,
];

export async function executeTemplateOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case TEMPLATE_RESOURCE.operation.CREATE_VIDEO_FROM_TEMPLATE.value:
			return await executeCreateVideoFromTemplateOperation.call(this, i);
		default:
			return [];
	}
}
