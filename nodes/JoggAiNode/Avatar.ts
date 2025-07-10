import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import {
	getAvatarListFromLibraryProperties,
	executeGetAvatarListFromLibraryOperation,
} from './AvatarOperation/GetAvatarListFromLibrary';
import {
	getInstantAvatarListProperties,
	executeGetInstantAvatarListOperation,
} from './AvatarOperation/GetInstantAvatarList';
import {
	getPhotoAvatarListProperties,
	executeGetPhotoAvatarListOperation,
} from './AvatarOperation/GetPhotoAvatarList';
import {
	generateAiAvatarPhotoProperties,
	executeGenerateAiAvatarPhotoOperation,
} from './AvatarOperation/GenerateAiAvatarPhoto';
import {
	checkPhotoStatusProperties,
	executeCheckPhotoStatusOperation,
} from './AvatarOperation/CheckPhotoGenerationStatus';
import { addMotionProperties, executeAddMotionOperation } from './AvatarOperation/AddMotion';
import {
	checkMotionStatusProperties,
	executeCheckMotionStatusOperation,
} from './AvatarOperation/CheckMotionGenerationStatus';

import { AVATAR_RESOURCE } from '../../const/joggAiNode2';

export const avatarProperties: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [AVATAR_RESOURCE.value],
			},
		},
		options: [
			{
				name: AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.name,
				value: AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.value,
				description: AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.description,
				action: AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.name,
			},
			{
				name: AVATAR_RESOURCE.operation.GET_INSTANT_AVATARS.name,
				value: AVATAR_RESOURCE.operation.GET_INSTANT_AVATARS.value,
				description: AVATAR_RESOURCE.operation.GET_INSTANT_AVATARS.description,
				action: AVATAR_RESOURCE.operation.GET_INSTANT_AVATARS.name,
			},
			{
				name: AVATAR_RESOURCE.operation.GET_PHOTO_AVATARS.name,
				value: AVATAR_RESOURCE.operation.GET_PHOTO_AVATARS.value,
				description: AVATAR_RESOURCE.operation.GET_PHOTO_AVATARS.description,
				action: AVATAR_RESOURCE.operation.GET_PHOTO_AVATARS.name,
			},
			{
				name: AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.name,
				value: AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value,
				description: AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.description,
				action: AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.name,
			},
			{
				name: AVATAR_RESOURCE.operation.CHECK_PHOTO_STATUS.name,
				value: AVATAR_RESOURCE.operation.CHECK_PHOTO_STATUS.value,
				description: AVATAR_RESOURCE.operation.CHECK_PHOTO_STATUS.description,
				action: AVATAR_RESOURCE.operation.CHECK_PHOTO_STATUS.name,
			},
			{
				name: AVATAR_RESOURCE.operation.CREATE_PHOTO_AVATAR.name,
				value: AVATAR_RESOURCE.operation.CREATE_PHOTO_AVATAR.value,
				description: AVATAR_RESOURCE.operation.CREATE_PHOTO_AVATAR.description,
				action: AVATAR_RESOURCE.operation.CREATE_PHOTO_AVATAR.name,
			},
			{
				name: AVATAR_RESOURCE.operation.CHECK_PHOTO_AVATAR_STATUS.name,
				value: AVATAR_RESOURCE.operation.CHECK_PHOTO_AVATAR_STATUS.value,
				description: AVATAR_RESOURCE.operation.CHECK_PHOTO_AVATAR_STATUS.description,
				action: AVATAR_RESOURCE.operation.CHECK_PHOTO_AVATAR_STATUS.name,
			},
		],
		default: AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.value,
		required: true,
	},
	...getAvatarListFromLibraryProperties,
	...getPhotoAvatarListProperties,
	...getInstantAvatarListProperties,
	...generateAiAvatarPhotoProperties,
	...checkPhotoStatusProperties,
	...addMotionProperties,
	...checkMotionStatusProperties,
];

export async function executeAvatarOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;

	switch (operation) {
		case AVATAR_RESOURCE.operation.GET_LIBRARY_AVATARS.value:
			return await executeGetAvatarListFromLibraryOperation.call(this, i);
		case AVATAR_RESOURCE.operation.GET_INSTANT_AVATARS.value:
			return await executeGetInstantAvatarListOperation.call(this, i);
		case AVATAR_RESOURCE.operation.GET_PHOTO_AVATARS.value:
			return await executeGetPhotoAvatarListOperation.call(this, i);
		case AVATAR_RESOURCE.operation.GENERATE_AI_PHOTO.value:
			return await executeGenerateAiAvatarPhotoOperation.call(this, i);
		case AVATAR_RESOURCE.operation.CHECK_PHOTO_STATUS.value:
			return await executeCheckPhotoStatusOperation.call(this, i);
		case AVATAR_RESOURCE.operation.CREATE_PHOTO_AVATAR.value:
			return await executeAddMotionOperation.call(this, i);
		case AVATAR_RESOURCE.operation.CHECK_PHOTO_AVATAR_STATUS.value:
			return await executeCheckMotionStatusOperation.call(this, i);
		default:
			return [];
	}
}
