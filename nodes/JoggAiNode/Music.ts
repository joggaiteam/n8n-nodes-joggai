import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { MUSIC_RESOURCE } from '../../const/joggAiNode2';

import { musicListProperties, executeMusicListOperation } from './MusicOperation/GetMusic';

export const musicProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [MUSIC_RESOURCE.value],
			},
		},
		options: [
			{
				name: MUSIC_RESOURCE.operation.GET.name,
				value: MUSIC_RESOURCE.operation.GET.value,
				description: MUSIC_RESOURCE.operation.GET.description,
				action: MUSIC_RESOURCE.operation.GET.action,
			},
		],
		default: 'get',
		required: true,
	},
	...musicListProperties,
];

export async function executeMusicOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case MUSIC_RESOURCE.operation.GET.value:
			return await executeMusicListOperation.call(this, i);
		default:
			return [];
	}
}
