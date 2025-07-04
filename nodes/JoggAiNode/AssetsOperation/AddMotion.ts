import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

export const addMotionProperties: INodeProperties[] = [
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['addMotion'],
			},
		},
		required: true,
	},
	{
		displayName: 'Model',
		name: 'modelVersion',
		type: 'options',
		options: [
			{
				name: '1.0',
				value: '1.0',
			},
			{
				name: '2.0',
				value: '2.0',
			},
			{
				name: '2.0-Pro',
				value: '2.0-Pro',
			},
			{
				name: '3.0',
				value: '3.0',
			},
		],
		default: '1.0',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['addMotion'],
			},
		},
		required: true,
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['addMotion'],
			},
		},
		required: true,
	},
	{
		displayName: 'Voice ID',
		name: 'voiceId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['addMotion'],
			},
		},
		required: true,
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description:
			'For Model 1.0, descriptions must be under 300 bytes, and for other models, they must not exceed 1500 bytes',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['addMotion'],
			},
		},
	},
	{
		displayName: 'Photo ID',
		name: 'photoId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['addMotion'],
			},
		},
	},
	{
		displayName: 'Welcome Message',
		name: 'welcomeMsg',
		type: 'string',
		default: '',
		description:
			'If you want to change the default greeting message of the avatar, you can use this parameter to replace it',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['addMotion'],
			},
		},
	},
];

export async function executeAddMotionOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const imageUrl = this.getNodeParameter('imageUrl', i) as string;
	const photoId = this.getNodeParameter('photoId', i) as string;
	const name = this.getNodeParameter('name', i) as string;
	const description = this.getNodeParameter('description', i) as string;
	const welcomeMsg = this.getNodeParameter('welcomeMsg', i) as string;
	const voiceId = this.getNodeParameter('voiceId', i) as string;
	const modelVersion = this.getNodeParameter('modelVersion', i) as string;

	const credentials = await this.getCredentials('joggAiCredentialsApi');

	const body = {
		description,
		image_url: imageUrl,
		model: modelVersion,
		name,
		photo_id: photoId,
		welcome_msg: welcomeMsg,
		voice_id: voiceId,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/photo_avatar/add_motion`,
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
