import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { TEMPLATE_RESOURCE } from '../../const/joggAiNode2';

import {
	getLibraryTemplateProperties,
	executeGetLibraryTemplateOperation,
} from './TemplateOperation/GetTemplate';
import {
	getMyTemplateProperties,
	executeGetMyTemplateOperation,
} from './TemplateOperation/GetMyTemplate';

export const templateProperties: INodeProperties[] = [
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
				name: TEMPLATE_RESOURCE.operation.GET_LIBRARY_TEMPLATES.name,
				value: TEMPLATE_RESOURCE.operation.GET_LIBRARY_TEMPLATES.value,
				description: TEMPLATE_RESOURCE.operation.GET_LIBRARY_TEMPLATES.description,
				action: TEMPLATE_RESOURCE.operation.GET_LIBRARY_TEMPLATES.action,
			},
			{
				name: TEMPLATE_RESOURCE.operation.GET_MY_TEMPLATES.name,
				value: TEMPLATE_RESOURCE.operation.GET_MY_TEMPLATES.value,
				description: TEMPLATE_RESOURCE.operation.GET_MY_TEMPLATES.description,
				action: TEMPLATE_RESOURCE.operation.GET_MY_TEMPLATES.action,
			},
		],
		default: 'getMyTemplates',
		required: true,
	},
	...getLibraryTemplateProperties,
	...getMyTemplateProperties,
];

export async function executeTemplateOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case TEMPLATE_RESOURCE.operation.GET_LIBRARY_TEMPLATES.value:
			return await executeGetLibraryTemplateOperation.call(this, i);
		case TEMPLATE_RESOURCE.operation.GET_MY_TEMPLATES.value:
			return await executeGetMyTemplateOperation.call(this, i);
		default:
			return [];
	}
}
