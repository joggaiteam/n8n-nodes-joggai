import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { AI_SCRIPT_RESOURCE } from '../../const/joggAiNode2';

import { aiScriptProperties, executeAiScriptOperation } from './AiScriptOperation/AiScript';

export const aiScriptActionProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		default: 'generate',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [AI_SCRIPT_RESOURCE.value],
			},
		},
		options: [
			{
				name: AI_SCRIPT_RESOURCE.operation.GENERATE.name,
				value: AI_SCRIPT_RESOURCE.operation.GENERATE.value,
				description: AI_SCRIPT_RESOURCE.operation.GENERATE.description,
				action: AI_SCRIPT_RESOURCE.operation.GENERATE.action,
			},
		],
		required: true,
	},
	...aiScriptProperties,
];

export async function executeAiScriptActionOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case AI_SCRIPT_RESOURCE.operation.GENERATE.value:
			return await executeAiScriptOperation.call(this, i);
		default:
			return [];
	}
}
