import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { VIDEO_RESOURCE } from '../../const/joggAiNode2';

import {
	createTalkingAvatarProperties,
	executeCreateTalkingAvatarOperation,
} from './VideoOperation/CreateTalkingAvatar';
import {
	generateVideoFromProductInformationProperties,
	executeGenerateVideoFromProductOperation,
} from './VideoOperation/GenerateVideoFromProduct';
import {
	createVideoFromTemplateProperties,
	executeCreateVideoFromTemplateOperation,
} from './VideoOperation/CreateVideoFromTemplate';
import {
	getGeneratedVideoProperties,
	executeGetGeneratedVideoOperation,
} from './VideoOperation/GetGeneratedVideo';
import {
	generatePreviewVideoFromProductProperties,
	executeGeneratePreviewVideoFromProductOperation,
} from './VideoOperation/GeneratePreviewVideoFromProduct';

export const videoProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
			},
		},
		options: [
			{
				name: VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.name,
				value: VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.value,
				description: VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.description,
				action: VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.action,
			},
			{
				name: VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.name,
				value: VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value,
				description: VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.description,
				action: VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.action,
			},
			{
				name: VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.name,
				value: VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value,
				description: VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.description,
				action: VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.action,
			},
			{
				name: VIDEO_RESOURCE.operation.GET.name,
				value: VIDEO_RESOURCE.operation.GET.value,
				description: VIDEO_RESOURCE.operation.GET.description,
				action: VIDEO_RESOURCE.operation.GET.action,
			},
			{
				name: VIDEO_RESOURCE.operation.GENERATE_PREVIEW.name,
				value: VIDEO_RESOURCE.operation.GENERATE_PREVIEW.value,
				description: VIDEO_RESOURCE.operation.GENERATE_PREVIEW.description,
				action: VIDEO_RESOURCE.operation.GENERATE_PREVIEW.action,
			},
		],
		default: 'get',
		required: true,
	},
	...createTalkingAvatarProperties,
	...generateVideoFromProductInformationProperties,
	...createVideoFromTemplateProperties,
	...getGeneratedVideoProperties,
	...generatePreviewVideoFromProductProperties,
];

export async function executeVideoOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case VIDEO_RESOURCE.operation.CREATE_FROM_AVATAR.value:
			return await executeCreateTalkingAvatarOperation.call(this, i);
		case VIDEO_RESOURCE.operation.CREATE_FROM_PRODUCT.value:
			return await executeGenerateVideoFromProductOperation.call(this, i);
		case VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value:
			return await executeCreateVideoFromTemplateOperation.call(this, i);
		case VIDEO_RESOURCE.operation.GET.value:
			return await executeGetGeneratedVideoOperation.call(this, i);
		case VIDEO_RESOURCE.operation.GENERATE_PREVIEW.value:
			return await executeGeneratePreviewVideoFromProductOperation.call(this, i);
		default:
			return [];
	}
}
