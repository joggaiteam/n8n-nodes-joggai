import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import {
	getGeneratedVideoProperties,
	executeGetGeneratedVideoOperation,
} from './GetGeneratedVideoOperation/GetGeneratedVideo';

export const getGenerateVideoActionProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['getGeneratedVideoAction'],
			},
		},
		options: [
			{
				name: 'Get Generated Video',
				value: 'getGeneratedVideo',
				description: 'Get information about a specific project using its ID',
				action: 'Get Generated Video',
			},
		],
		default: 'getGeneratedVideo',
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
		case 'getGeneratedVideo':
			return await executeGetGeneratedVideoOperation.call(this, i);
		default:
			return [];
	}
}
