import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import {
	createTalkingAvatarProperties,
	executeCreateTalkingAvatarOperation,
} from './TalkingAvatarOperation/CreateTalkingAvatar';

export const talkingAvatarProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['talkingAvatar'],
			},
		},
		options: [
			{
				name: 'Create Talking Avatar Videos',
				value: 'createTalkingAvatar',
				description: 'Creates a talking avatar video with specified parameters',
				action: 'Create Talking Avatar Videos',
			},
		],
		default: 'createTalkingAvatar',
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
		case 'createTalkingAvatar':
			return await executeCreateTalkingAvatarOperation.call(this, i);
		default:
			return [];
	}
}
