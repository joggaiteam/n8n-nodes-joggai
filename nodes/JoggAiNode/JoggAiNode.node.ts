import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';
import { lookupProperties, executeLookupOperation } from './JoggAiNodeLookup';
import { assetsProperties, executeAssetsOperation } from './JoggAiNodeAssets';
import { templateProperties, executeTemplateOperation } from './JoggAiNodeTemplate';
import { talkingAvatarProperties, executeTalkingAvatarOperation } from './JoggAiNodeTalkingAvatar';
import {
	urlProductToVideoProperties,
	executeUrlProductToVideoOperation,
} from './JoggAiNodeUrlProductToVideo';
import {
	getGenerateVideoActionProperties,
	executeGetGenerateVideoActionOperation,
} from './JoggAiNodeGetGenerateVideoAction';
import { webhookProperties, executeWebhookOperation } from './JoggAiNodeWebhook';

import {
	CREDENTIALS_API_NAME,
	LOOKUP_RESOURCE,
	ASSETS_RESOURCE,
	TEMPLATE_RESOURCE,
	TALKING_AVATAR_RESOURCE,
	URL_TO_VIDEO_RESOURCE,
	GET_GENERATED_VIDEO_RESOURCE,
	WEBHOOK_RESOURCE,
} from '../../const/joggAiNode';

export class JoggAiNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JoggAI',
		name: 'joggAiNode',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:joggai.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'JoggAI Open API Node',
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
			// eslint-disable-next-line n8n-nodes-base/node-param-default-missing
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: LOOKUP_RESOURCE.name,
						value: LOOKUP_RESOURCE.value,
					},
					{
						name: ASSETS_RESOURCE.name,
						value: ASSETS_RESOURCE.value,
					},
					{
						name: TEMPLATE_RESOURCE.name,
						value: TEMPLATE_RESOURCE.value,
					},
					{
						name: TALKING_AVATAR_RESOURCE.name,
						value: TALKING_AVATAR_RESOURCE.value,
					},
					{
						name: URL_TO_VIDEO_RESOURCE.name,
						value: URL_TO_VIDEO_RESOURCE.value,
					},
					{
						name: GET_GENERATED_VIDEO_RESOURCE.name,
						value: GET_GENERATED_VIDEO_RESOURCE.value,
					},
					{
						name: WEBHOOK_RESOURCE.name,
						value: WEBHOOK_RESOURCE.value,
					},
				],
				default: LOOKUP_RESOURCE.value,
				required: true,
			},
			...lookupProperties,
			...assetsProperties,
			...templateProperties,
			...talkingAvatarProperties,
			...urlProductToVideoProperties,
			...getGenerateVideoActionProperties,
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
					case LOOKUP_RESOURCE.value:
						const lookupResults = await executeLookupOperation.call(this, i);
						returnData.push(...lookupResults);
						break;
					case ASSETS_RESOURCE.value:
						const assetsResults = await executeAssetsOperation.call(this, i);
						returnData.push(...assetsResults);
						break;
					case TEMPLATE_RESOURCE.value:
						const templateResults = await executeTemplateOperation.call(this, i);
						returnData.push(...templateResults);
						break;
					case TALKING_AVATAR_RESOURCE.value:
						const talkingAvatarResults = await executeTalkingAvatarOperation.call(this, i);
						returnData.push(...talkingAvatarResults);
						break;
					case URL_TO_VIDEO_RESOURCE.value:
						const urlProductToVideoResults = await executeUrlProductToVideoOperation.call(this, i);
						returnData.push(...urlProductToVideoResults);
						break;
					case GET_GENERATED_VIDEO_RESOURCE.value:
						const getGenerateVideoResults = await executeGetGenerateVideoActionOperation.call(
							this,
							i,
						);
						returnData.push(...getGenerateVideoResults);
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
