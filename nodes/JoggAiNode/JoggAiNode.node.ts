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

export class JoggAiNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JoggAI',
		name: 'joggAiNode',
		icon: 'file:joggai.png',
		group: ['transform'],
		version: 1,
		// subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'JoggAI Open API Node',
		defaults: {
			name: 'JoggAI',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'joggAiCredentialsApi',
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
						name: 'Jogg.ai Lookup',
						value: 'lookup',
					},
					{
						name: 'Jogg.ai Assets',
						value: 'assets',
					},
					{
						name: 'Jogg.ai Template',
						value: 'template',
					},
					{
						name: 'Talking Avatar',
						value: 'talkingAvatar',
					},
					{
						name: 'URL / Product to video',
						value: 'urlProductToVideo',
					},
					{
						name: 'Get Generate Video',
						value: 'getGeneratedVideoAction',
					},
				],
				default: 'lookup',
				required: true,
			},
			...lookupProperties,
			...assetsProperties,
			...templateProperties,
			...talkingAvatarProperties,
			...urlProductToVideoProperties,
			...getGenerateVideoActionProperties,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// 对每个输入项执行操作
		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;

				if (resource === 'lookup') {
					const lookupResults = await executeLookupOperation.call(this, i);
					returnData.push(...lookupResults);
				} else if (resource === 'assets') {
					const assetsResults = await executeAssetsOperation.call(this, i);
					returnData.push(...assetsResults);
				} else if (resource === 'template') {
					const templateResults = await executeTemplateOperation.call(this, i);
					returnData.push(...templateResults);
				} else if (resource === 'talkingAvatar') {
					const talkingAvatarResults = await executeTalkingAvatarOperation.call(this, i);
					returnData.push(...talkingAvatarResults);
				} else if (resource === 'urlProductToVideo') {
					const urlProductToVideoResults = await executeUrlProductToVideoOperation.call(this, i);
					returnData.push(...urlProductToVideoResults);
				} else if (resource === 'getGeneratedVideoAction') {
					const getGenerateVideoResults = await executeGetGenerateVideoActionOperation.call(
						this,
						i,
					);
					returnData.push(...getGenerateVideoResults);
				}
			} catch (error) {
				// 打印错误信息
				this.logger.error('请求失败: ' + error.message);

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
