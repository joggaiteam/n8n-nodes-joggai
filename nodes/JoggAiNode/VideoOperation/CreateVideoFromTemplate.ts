import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';

import { VIDEO_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

import { templateTypeOptions } from '../../../const/templateType';
import { avatarTypeOptions } from '../../../const/avatarType';
import { contentTypeOptions } from '../../../const/contentType';

export const createVideoFromTemplateProperties: INodeProperties[] = [
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value],
			},
		},
		required: true,
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: '',
		description: 'Language for text-to-speech conversion',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value],
			},
		},
		required: true,
	},
	{
		displayName: 'Template Type',
		name: 'templateType',
		type: 'options',
		default: 'common',
		description: 'Template source type',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value],
			},
		},
		options: templateTypeOptions,
		required: true,
	},
	{
		displayName: 'Avatar ID',
		name: 'avatarId',
		type: 'number',
		default: 0,
		description: 'Digital person ID',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value],
			},
		},
	},
	{
		displayName: 'Avatar Type',
		name: 'avatarType',
		type: 'options',
		default: 0,
		description: 'Avatar source type',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value],
			},
		},
		options: avatarTypeOptions,
	},
	{
		displayName: 'Voice ID',
		name: 'voiceId',
		type: 'string',
		default: '',
		description: 'Voice ID for text-to-speech',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value],
			},
		},
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'boolean',
		default: false,
		description: 'Whether to enable captions',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value],
			},
		},
	},
	{
		displayName: 'Music ID',
		name: 'musicId',
		type: 'number',
		default: 0,
		description: 'Background music ID',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value],
			},
		},
	},
	{
		displayName: 'Variables',
		name: 'variables',
		placeholder: 'Add Variable',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		required: true,
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value],
			},
		},
		options: [
			{
				name: 'variableValues',
				displayName: 'Variable',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: contentTypeOptions,
						required: true,
						default: 'text',
						description: 'The type of variable',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						required: true,
						description: 'The name of the variable',
					},
					{
						displayName: 'Properties',
						name: 'properties',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: false,
						},
						required: true,
						default: {
							values: {},
						},
						options: [
							{
								name: 'values',
								displayName: 'Properties Values',
								values: [
									{
										displayName: 'Content',
										name: 'content',
										type: 'string',
										default: '',
										description: 'The text content for the variable',
									},
									{
										displayName: 'URL',
										name: 'url',
										type: 'string',
										default: '',
										description: 'The URL for the variable',
									},
									{
										displayName: 'Asset ID',
										name: 'assetId',
										type: 'number',
										default: 0,
										description: 'The asset ID for the variable',
									},
								],
							},
						],
					},
				],
			},
		],
	},
];

export async function executeCreateVideoFromTemplateOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const templateId = this.getNodeParameter('templateId', i) as number;
	const language = this.getNodeParameter('language', i) as string;
	const templateType = this.getNodeParameter('templateType', i) as string;
	const avatarId = this.getNodeParameter('avatarId', i) as number;
	const avatarType = this.getNodeParameter('avatarType', i) as number;
	const voiceId = this.getNodeParameter('voiceId', i) as string;
	const caption = this.getNodeParameter('caption', i) as boolean;
	const musicId = this.getNodeParameter('musicId', i) as number;

	const variablesCollection = this.getNodeParameter(
		'variables.variableValues',
		i,
		[],
	) as IDataObject[];
	const variables = parseVariables(variablesCollection);

	const body = {
		template_id: templateId,
		lang: language,
		template_type: templateType,
		avatar_id: avatarId,
		avatar_type: avatarType,
		voice_id: voiceId,
		caption,
		music_id: musicId,
		variables,
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/create_video_with_template`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		body,
		json: true,
	};

	this.logger.info('send request: ' + JSON.stringify(options));

	const responseData = await this.helpers.httpRequest(options);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray([responseData]),
		{ itemData: { item: i } },
	);

	returnData.push(...executionData);

	return returnData;
}

function parseVariables(variablesCollection: IDataObject[]) {
	return variablesCollection.map((variable: IDataObject) => {
		const properties = variable.properties as IDataObject;
		const propertiesValues =
			properties && properties.values ? (properties.values as IDataObject) : {};

		return {
			type: variable.type as string,
			name: variable.name as string,
			properties: {
				content: (propertiesValues.content as string) || '',
				url: (propertiesValues.url as string) || '',
				asset_id: (propertiesValues.assetId as number) || 0,
			},
		};
	});
}
