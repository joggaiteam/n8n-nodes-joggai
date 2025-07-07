import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { aiScriptProperties, executeAiScriptOperation } from './AssetsOperation/AiScript';
import { uploadMediaProperties, executeUploadMediaOperation } from './AssetsOperation/UploadMedia';
import {
	generateAiAvatarPhotoProperties,
	executeGenerateAiAvatarPhotoOperation,
} from './AssetsOperation/GenerateAiAvatarPhoto';
import {
	generateAvatarNewLookPhotoProperties,
	executeGenerateAvatarNewLookPhotoOperation,
} from './AssetsOperation/GenerateAvatarNewLookPhoto';
import { addMotionProperties, executeAddMotionOperation } from './AssetsOperation/AddMotion';
import {
	checkPhotoStatusProperties,
	executeCheckPhotoStatusOperation,
} from './AssetsOperation/CheckPhotoGenerationStatus';
import {
	checkMotionStatusProperties,
	executeCheckMotionStatusOperation,
} from './AssetsOperation/CheckMotionGenerationStatus';

import { ASSETS_RESOURCE } from '../../const/joggAiNode';

export const assetsProperties: INodeProperties[] = [
	// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [ASSETS_RESOURCE.value],
			},
		},
		options: [
			{
				name: ASSETS_RESOURCE.operation.AI_SCRIPTS.name,
				value: ASSETS_RESOURCE.operation.AI_SCRIPTS.value,
				description: ASSETS_RESOURCE.operation.AI_SCRIPTS.description,
				action: ASSETS_RESOURCE.operation.AI_SCRIPTS.name,
			},
			{
				name: ASSETS_RESOURCE.operation.UPLOAD_MEDIA.name,
				value: ASSETS_RESOURCE.operation.UPLOAD_MEDIA.value,
				description: ASSETS_RESOURCE.operation.UPLOAD_MEDIA.description,
				action: ASSETS_RESOURCE.operation.UPLOAD_MEDIA.name,
			},
			{
				name: ASSETS_RESOURCE.operation.GENERATE_AI_AVATAR_PHOTO.name,
				value: ASSETS_RESOURCE.operation.GENERATE_AI_AVATAR_PHOTO.value,
				description: ASSETS_RESOURCE.operation.GENERATE_AI_AVATAR_PHOTO.description,
				action: ASSETS_RESOURCE.operation.GENERATE_AI_AVATAR_PHOTO.name,
			},
			{
				name: ASSETS_RESOURCE.operation.GENERATE_AVATAR_NEW_LOOK_PHOTO.name,
				value: ASSETS_RESOURCE.operation.GENERATE_AVATAR_NEW_LOOK_PHOTO.value,
				description: ASSETS_RESOURCE.operation.GENERATE_AVATAR_NEW_LOOK_PHOTO.description,
				action: ASSETS_RESOURCE.operation.GENERATE_AVATAR_NEW_LOOK_PHOTO.name,
			},
			{
				name: ASSETS_RESOURCE.operation.ADD_MOTION.name,
				value: ASSETS_RESOURCE.operation.ADD_MOTION.value,
				description: ASSETS_RESOURCE.operation.ADD_MOTION.description,
				action: ASSETS_RESOURCE.operation.ADD_MOTION.name,
			},
			{
				name: ASSETS_RESOURCE.operation.CHECK_PHOTO_GENERATION_STATUS.name,
				value: ASSETS_RESOURCE.operation.CHECK_PHOTO_GENERATION_STATUS.value,
				description: ASSETS_RESOURCE.operation.CHECK_PHOTO_GENERATION_STATUS.description,
				action: ASSETS_RESOURCE.operation.CHECK_PHOTO_GENERATION_STATUS.name,
			},
			{
				name: ASSETS_RESOURCE.operation.CHECK_MOTION_GENERATION_STATUS.name,
				value: ASSETS_RESOURCE.operation.CHECK_MOTION_GENERATION_STATUS.value,
				description: ASSETS_RESOURCE.operation.CHECK_MOTION_GENERATION_STATUS.description,
				action: ASSETS_RESOURCE.operation.CHECK_MOTION_GENERATION_STATUS.name,
			},
		],
		default: ASSETS_RESOURCE.operation.AI_SCRIPTS.value,
		required: true,
	},
	...aiScriptProperties,
	...uploadMediaProperties,
	...generateAiAvatarPhotoProperties,
	...generateAvatarNewLookPhotoProperties,
	...addMotionProperties,
	...checkPhotoStatusProperties,
	...checkMotionStatusProperties,
];

export async function executeAssetsOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;

	switch (operation) {
		case ASSETS_RESOURCE.operation.AI_SCRIPTS.value:
			return await executeAiScriptOperation.call(this, i);
		case ASSETS_RESOURCE.operation.UPLOAD_MEDIA.value:
			return await executeUploadMediaOperation.call(this, i);
		case ASSETS_RESOURCE.operation.GENERATE_AI_AVATAR_PHOTO.value:
			return await executeGenerateAiAvatarPhotoOperation.call(this, i);
		case ASSETS_RESOURCE.operation.GENERATE_AVATAR_NEW_LOOK_PHOTO.value:
			return await executeGenerateAvatarNewLookPhotoOperation.call(this, i);
		case ASSETS_RESOURCE.operation.ADD_MOTION.value:
			return await executeAddMotionOperation.call(this, i);
		case ASSETS_RESOURCE.operation.CHECK_PHOTO_GENERATION_STATUS.value:
			return await executeCheckPhotoStatusOperation.call(this, i);
		case ASSETS_RESOURCE.operation.CHECK_MOTION_GENERATION_STATUS.value:
			return await executeCheckMotionStatusOperation.call(this, i);
		default:
			return [];
	}
}
