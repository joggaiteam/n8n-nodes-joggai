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

import { LOOKUP_RESOURCE } from '../../const/joggAiNode';

export const lookupProperties: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [LOOKUP_RESOURCE.value],
			},
		},
		options: [
			{
				name: LOOKUP_RESOURCE.operation.LIST_VOICE.name,
				value: LOOKUP_RESOURCE.operation.LIST_VOICE.value,
				description: LOOKUP_RESOURCE.operation.LIST_VOICE.description,
				action: LOOKUP_RESOURCE.operation.LIST_VOICE.name,
			},
			{
				name: LOOKUP_RESOURCE.operation.LIST_VISUAL_STYLE.name,
				value: LOOKUP_RESOURCE.operation.LIST_VISUAL_STYLE.value,
				description: LOOKUP_RESOURCE.operation.LIST_VISUAL_STYLE.description,
				action: LOOKUP_RESOURCE.operation.LIST_VISUAL_STYLE.name,
			},
			{
				name: LOOKUP_RESOURCE.operation.LIST_TEMPLATE.name,
				value: LOOKUP_RESOURCE.operation.LIST_TEMPLATE.value,
				description: LOOKUP_RESOURCE.operation.LIST_TEMPLATE.description,
				action: LOOKUP_RESOURCE.operation.LIST_TEMPLATE.name,
			},
			{
				name: LOOKUP_RESOURCE.operation.LIST_MUSIC.name,
				value: LOOKUP_RESOURCE.operation.LIST_MUSIC.value,
				description: LOOKUP_RESOURCE.operation.LIST_MUSIC.description,
				action: LOOKUP_RESOURCE.operation.LIST_MUSIC.name,
			},
		],
		default: LOOKUP_RESOURCE.operation.LIST_VOICE.value,
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
		case LOOKUP_RESOURCE.operation.LIST_VOICE.value:
			return await executeVoiceListOperation.call(this, i);
		case LOOKUP_RESOURCE.operation.LIST_VISUAL_STYLE.value:
			return await executeVisualStyleListOperation.call(this, i);
		case LOOKUP_RESOURCE.operation.LIST_TEMPLATE.value:
			return await executeTemplateListOperation.call(this, i);
		case LOOKUP_RESOURCE.operation.LIST_MUSIC.value:
			return await executeMusicListOperation.call(this, i);
		default:
			return [];
	}
}
