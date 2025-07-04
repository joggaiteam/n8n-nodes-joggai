import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { voiceListProperties, executeVoiceListOperation } from './LookupOperation/GetVoice';
import {
	templateListProperties,
	executeTemplateListOperation,
} from './LookupOperation/GetTemplate';
import {
	visualStyleListProperties,
	executeVisualStyleListOperation,
} from './LookupOperation/GetVisualStyle';
import { musicListProperties, executeMusicListOperation } from './LookupOperation/GetMusic';

export const lookupProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lookup'],
			},
		},
		options: [
			{
				name: 'Get My Voice',
				value: 'voice:list',
				description: 'Retrieve a list of your available voice with specified gender filter',
				action: 'Get My Voice',
			},
			{
				name: 'Get Visual Style',
				value: 'visualStyle:list',
				description: 'Get list of Visual Style',
				action: 'Get Visual Style',
			},
			{
				name: 'Get My Template',
				value: 'template:list',
				description: 'Get list of your custom templates',
				action: 'Get My Template',
			},
			{
				name: 'Get Music List from JoggAI',
				value: 'music:list',
				description: 'Get a list of jogg music',
				action: 'Get Music List from JoggAI',
			},
		],
		default: 'voice:list',
		required: true,
	},
	...voiceListProperties,
	...templateListProperties,
	...visualStyleListProperties,
	...musicListProperties,
];

export async function executeLookupOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case 'voice:list':
			return await executeVoiceListOperation.call(this, i);
		case 'visualStyle:list':
			return await executeVisualStyleListOperation.call(this, i);
		case 'template:list':
			return await executeTemplateListOperation.call(this, i);
		case 'music:list':
			return await executeMusicListOperation.call(this, i);
		default:
			return [];
	}
}
