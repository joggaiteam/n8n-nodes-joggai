import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { VOICE_RESOURCE } from '../../const/joggAiNode2';

import { voiceListProperties, executeVoiceListOperation } from './VoiceOperation/GetVoice';
import {
	getLibraryVoicesProperties,
	executeGetLibraryVoicesOperation,
} from './VoiceOperation/GetLibraryVoices';

export const voiceProperties: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [VOICE_RESOURCE.value],
			},
		},
		options: [
			{
				name: VOICE_RESOURCE.operation.GET_LIBRARY_VOICES.name,
				value: VOICE_RESOURCE.operation.GET_LIBRARY_VOICES.value,
				description: VOICE_RESOURCE.operation.GET_LIBRARY_VOICES.description,
				action: VOICE_RESOURCE.operation.GET_LIBRARY_VOICES.action,
			},
			{
				name: VOICE_RESOURCE.operation.GET_MY_VOICES.name,
				value: VOICE_RESOURCE.operation.GET_MY_VOICES.value,
				description: VOICE_RESOURCE.operation.GET_MY_VOICES.description,
				action: VOICE_RESOURCE.operation.GET_MY_VOICES.action,
			},
		],
		default: VOICE_RESOURCE.operation.GET_LIBRARY_VOICES.value,
		required: true,
	},
	...voiceListProperties,
	...getLibraryVoicesProperties,
];

export async function executeVoiceOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case VOICE_RESOURCE.operation.GET_LIBRARY_VOICES.value:
			return await executeGetLibraryVoicesOperation.call(this, i);
		case VOICE_RESOURCE.operation.GET_MY_VOICES.value:
			return await executeVoiceListOperation.call(this, i);
		default:
			return [];
	}
}
