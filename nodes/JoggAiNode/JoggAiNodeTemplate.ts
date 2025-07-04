import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import {
	createVideoFromTemplateProperties,
	executeCreateVideoFromTemplateOperation,
} from './TemplateOperation/CreateVideoFromTemplate';

export const templateProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['template'],
			},
		},
		options: [
			{
				name: 'Create Video From Template',
				value: 'createVideoFromTemplate',
				description: 'Create video from Your Template',
				action: 'Create Video From Template',
			},
		],
		default: 'createVideoFromTemplate',
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
		case 'createVideoFromTemplate':
			return await executeCreateVideoFromTemplateOperation.call(this, i);
		default:
			return [];
	}
}
