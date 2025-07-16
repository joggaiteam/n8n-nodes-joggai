import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';

import { VIDEO_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

import { languageOptions } from '../../../const/language';
import { contentTypeOptions } from '../../../const/contentType';

export const createVideoFromTemplateProperties: INodeProperties[] = [
	// ----------------------------------
	//         Core Required Fields
	// ----------------------------------
	{
		displayName: 'Template Type',
		name: 'template_type',
		type: 'options',
		default: 'common',
		required: true,
		options: [
			{
				name: 'Public Template',
				value: 'common',
			},
			{
				name: 'My Template',
				value: 'user',
			},
		],
		description: 'The source of the template to use',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value],
			},
		},
	},
	{
		displayName: 'Template ID',
		name: 'template_id',
		type: 'number',
		default: '',
		placeholder: '1234',
		description: 'The ID of the template you want to use',
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
		name: 'lang',
		type: 'options',
		default: 'english',
		description: 'Language for text-to-speech (TTS) conversion',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value],
			},
		},
		options: languageOptions,
		required: true,
	},

	// ----------------------------------
	//         Template Variables
	// ----------------------------------
	{
		displayName: 'Template Variables',
		name: 'variables',
		description: 'A list of variables to replace placeholders in the template',
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
						type: 'collection',
						required: true,
						default: {},
						displayOptions: {
							show: {
								type: ['text', 'script'],
							},
						},
						options: [
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								default: '',
								description: 'The text content for the variable',
							},
						],
					},
					{
						displayName: 'Properties',
						name: 'properties',
						type: 'collection',
						required: true,
						default: {},
						displayOptions: {
							show: {
								type: ['image', 'video'],
							},
						},
						options: [
							{
								displayName: 'URL',
								name: 'url',
								type: 'string',
								default: '',
								description: 'The URL for media content',
							},
						],
					},
				],
			},
		],
	},

	// ----------------------------------
	//         Optional Overrides
	// ----------------------------------
	{
		displayName: 'Optional Overrides',
		name: 'overrides',
		type: 'collection',
		placeholder: 'Add Override',
		default: {},
		description: 'Optional settings to override those predefined in the template',
		displayOptions: {
			show: {
				resource: [VIDEO_RESOURCE.value],
				operation: [VIDEO_RESOURCE.operation.CREATE_FROM_TEMPLATE.value],
			},
		},
		options: [
			{
				displayName: 'Avatar ID',
				name: 'avatar_id',
				type: 'number',
				default: '',
				description: "Override the template's avatar ID",
			},
			{
				displayName: 'Avatar Type',
				name: 'avatar_type',
				type: 'options',
				options: [
					{ name: 'Public Avatar', value: 0 },
					{ name: 'Custom Avatar', value: 1 },
				],
				default: 0,
				description: "Override the template's avatar source",
			},
			{
				displayName: 'Enable Captions',
				name: 'caption',
				type: 'boolean',
				default: true,
				description: 'Whether to enable captions for the video',
			},
			{
				displayName: 'Music ID',
				name: 'music_id',
				type: 'number',
				default: '',
				description: "Override the template's background music ID",
			},
			{
				displayName: 'Voice ID',
				name: 'voice_id',
				type: 'string',
				default: '',
				placeholder: 'en-US-ChristopherNeural',
				description: "Override the template's voice ID",
			},
		],
	},
];

export async function executeCreateVideoFromTemplateOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const templateId = this.getNodeParameter('template_id', i) as number;
	const language = this.getNodeParameter('lang', i) as string;
	const templateType = this.getNodeParameter('template_type', i) as string;

	// Get variables
	const variablesData = this.getNodeParameter('variables.variableValues', i, []) as IDataObject[];
	const variables = parseVariables(variablesData);

	// Get optional overrides
	const overrides = this.getNodeParameter('overrides', i, {}) as IDataObject;
	const avatarType = overrides.avatar_type as number;
	const avatarId = overrides.avatar_id as number;
	const voiceId = overrides.voice_id as string;
	const caption = overrides.caption as boolean;
	const musicId = overrides.music_id as number;

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
			'x-api-platform': 'n8n',
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
		const variableType = variable.type as string;
		const properties = variable.properties as IDataObject;

		return {
			type: variableType,
			name: variable.name as string,
			properties: {
				content: variableType === 'text' ? (properties?.content as string) || '' : '',
				url: ['image', 'video'].includes(variableType) ? (properties?.url as string) || '' : '',
				asset_id: ['image', 'video'].includes(variableType)
					? (properties?.asset_id as number) || 0
					: 0,
			},
		};
	});
}
