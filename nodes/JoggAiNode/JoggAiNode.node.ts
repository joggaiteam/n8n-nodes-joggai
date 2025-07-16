import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { videoProperties, executeVideoOperation } from './Video';
import { avatarProperties, executeAvatarOperation } from './Avatar';
import { voiceProperties, executeVoiceOperation } from './Voice';
import { templateProperties, executeTemplateOperation } from './Template';
import { productProperties, executeProductOperation } from './Product';
import { aiScriptActionProperties, executeAiScriptActionOperation } from './AiScript';
import { fileProperties, executeFileOperation } from './File';
import { musicProperties, executeMusicOperation } from './Music';
import { visualStyleProperties, executeVisualStyleOperation } from './VisualStyle';
import { webhookProperties, executeWebhookOperation } from './JoggAiNodeWebhook';

import {
	CREDENTIALS_API_NAME,
	VIDEO_RESOURCE,
	AVATAR_RESOURCE,
	VOICE_RESOURCE,
	TEMPLATE_RESOURCE,
	PRODUCT_RESOURCE,
	AI_SCRIPT_RESOURCE,
	FILE_RESOURCE,
	MUSIC_RESOURCE,
	VISUAL_STYLE_RESOURCE,
	WEBHOOK_RESOURCE,
} from '../../const/joggAiNode2';

export class JoggAiNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JoggAI',
		name: 'joggAiNode',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:joggai.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Interact with the JoggAI API to create and manage AI videos',
		defaults: {
			name: 'JoggAI',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: CREDENTIALS_API_NAME,
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: VIDEO_RESOURCE.name,
						value: VIDEO_RESOURCE.value,
					},
					{
						name: AVATAR_RESOURCE.name,
						value: AVATAR_RESOURCE.value,
					},
					{
						name: VOICE_RESOURCE.name,
						value: VOICE_RESOURCE.value,
					},
					{
						name: TEMPLATE_RESOURCE.name,
						value: TEMPLATE_RESOURCE.value,
					},
					{
						name: PRODUCT_RESOURCE.name,
						value: PRODUCT_RESOURCE.value,
					},
					{
						name: AI_SCRIPT_RESOURCE.name,
						value: AI_SCRIPT_RESOURCE.value,
					},
					{
						name: FILE_RESOURCE.name,
						value: FILE_RESOURCE.value,
					},
					{
						name: MUSIC_RESOURCE.name,
						value: MUSIC_RESOURCE.value,
					},
					{
						name: VISUAL_STYLE_RESOURCE.name,
						value: VISUAL_STYLE_RESOURCE.value,
					},
					{
						name: WEBHOOK_RESOURCE.name,
						value: WEBHOOK_RESOURCE.value,
					},
				],
				default: 'video',
				required: true,
			},
			...videoProperties,
			...avatarProperties,
			...voiceProperties,
			...templateProperties,
			...productProperties,
			...aiScriptActionProperties,
			...fileProperties,
			...musicProperties,
			...visualStyleProperties,
			...webhookProperties,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];

		const items = this.getInputData();
		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				switch (resource) {
					// TODO
					case VIDEO_RESOURCE.value:
						const videoResults = await executeVideoOperation.call(this, i);
						returnData.push(...videoResults);
						break;
					case AVATAR_RESOURCE.value:
						const avatarResults = await executeAvatarOperation.call(this, i);
						returnData.push(...avatarResults);
						break;
					case VOICE_RESOURCE.value:
						const voiceResults = await executeVoiceOperation.call(this, i);
						returnData.push(...voiceResults);
						break;
					case TEMPLATE_RESOURCE.value:
						const templateResults = await executeTemplateOperation.call(this, i);
						returnData.push(...templateResults);
						break;
					case PRODUCT_RESOURCE.value:
						const productResults = await executeProductOperation.call(this, i);
						returnData.push(...productResults);
						break;
					case AI_SCRIPT_RESOURCE.value:
						const aiScriptResults = await executeAiScriptActionOperation.call(this, i);
						returnData.push(...aiScriptResults);
						break;
					case FILE_RESOURCE.value:
						const fileResults = await executeFileOperation.call(this, i);
						returnData.push(...fileResults);
						break;
					case MUSIC_RESOURCE.value:
						const musicResults = await executeMusicOperation.call(this, i);
						returnData.push(...musicResults);
						break;
					case VISUAL_STYLE_RESOURCE.value:
						const visualStyleResults = await executeVisualStyleOperation.call(this, i);
						returnData.push(...visualStyleResults);
						break;
					case WEBHOOK_RESOURCE.value:
						const webhookResults = await executeWebhookOperation.call(this, i);
						returnData.push(...webhookResults);
						break;
				}
			} catch (error) {
				this.logger.error('[joggAiNode] request failed: ' + error.message);

				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
			}
		}

		return this.prepareOutputData(returnData);
	}
}
