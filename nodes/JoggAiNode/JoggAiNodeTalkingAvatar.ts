import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import {
	createTalkingAvatarProperties,
	executeCreateTalkingAvatarOperation,
} from './TalkingAvatarOperation/CreateTalkingAvatar';

import { TALKING_AVATAR_RESOURCE } from '../../const/joggAiNode';

export const talkingAvatarProperties: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [TALKING_AVATAR_RESOURCE.value],
			},
		},
		options: [
			{
				name: TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.name,
				value: TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.value,
				description: TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.description,
				action: TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.name,
			},
		],
		default: TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.value,
		required: true,
	},
	...createTalkingAvatarProperties,
];

export async function executeTalkingAvatarOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case TALKING_AVATAR_RESOURCE.operation.CREATE_TALKING_AVATAR_VIDEOS.value:
			return await executeCreateTalkingAvatarOperation.call(this, i);
		default:
			return [];
	}
}
