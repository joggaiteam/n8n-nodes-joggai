import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

export const generateAvatarNewLookPhotoProperties: INodeProperties[] = [
	{
		displayName: 'Age',
		name: 'age',
		type: 'options',
		options: [
			{
				name: 'Teenager',
				value: 'Teenager',
			},
			{
				name: 'Young Adult',
				value: 'Young adult',
			},
			{
				name: 'Adult',
				value: 'Adult',
			},
			{
				name: 'Elderly',
				value: 'Elderly',
			},
		],
		default: 'Adult',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['generateNewLook'],
			},
		},
		required: true,
	},
	{
		displayName: 'Aspect Ratio',
		name: 'aspectRatio',
		type: 'options',
		options: [
			{
				name: 'Portrait [9:16]',
				value: 0,
			},
			{
				name: 'Landscape [16:9]',
				value: 1,
			},
		],
		default: 0,
		description: 'Photo aspect ratio',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['generateNewLook'],
			},
		},
		required: true,
	},
	{
		displayName: 'Avatar Style',
		name: 'avatarStyle',
		type: 'options',
		options: [
			{
				name: 'Professional',
				value: 'Professional',
			},
			{
				name: 'Social',
				value: 'Social',
			},
		],
		default: 'Professional',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['generateNewLook'],
			},
		},
		required: true,
	},
	{
		displayName: 'Gender',
		name: 'gender',
		type: 'options',
		options: [
			{
				name: 'Female',
				value: 'Female',
			},
			{
				name: 'Male',
				value: 'Male',
			},
		],
		default: 'Female',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['generateNewLook'],
			},
		},
		required: true,
	},
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['generateNewLook'],
			},
		},
		required: true,
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		options: [
			{
				name: 'Classic',
				value: 'classic',
			},
			{
				name: 'Modern',
				value: 'modern',
			},
		],
		default: 'classic',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['generateNewLook'],
			},
		},
		required: true,
	},
	{
		displayName: 'Appearance',
		name: 'appearance',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['generateNewLook'],
			},
		},
	},
	{
		displayName: 'Background',
		name: 'background',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['generateNewLook'],
			},
		},
	},
	{
		displayName: 'Ethnicity',
		name: 'ethnicity',
		type: 'options',
		options: [
			{
				name: 'No Select',
				value: '',
			},
			{
				name: 'European',
				value: 'European',
			},
			{
				name: 'African',
				value: 'African',
			},
			{
				name: 'South Asian',
				value: 'South Asian',
			},
			{
				name: 'East Asian',
				value: 'East Asian',
			},
			{
				name: 'Middle Eastern',
				value: 'Middle Eastern',
			},
			{
				name: 'South American',
				value: 'South American',
			},
			{
				name: 'North American',
				value: 'North American',
			},
		],
		default: '',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['generateNewLook'],
			},
		},
	},
];

export async function executeGenerateAvatarNewLookPhotoOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const imageUrl = this.getNodeParameter('imageUrl', i) as string;
	const age = this.getNodeParameter('age', i) as string;
	const appearance = this.getNodeParameter('appearance', i) as string;
	const aspectRatio = this.getNodeParameter('aspectRatio', i) as number;
	const avatarStyle = this.getNodeParameter('avatarStyle', i) as string;
	const background = this.getNodeParameter('background', i) as string;
	const ethnicity = this.getNodeParameter('ethnicity', i) as string;
	const gender = this.getNodeParameter('gender', i) as string;
	const model = this.getNodeParameter('model', i) as string;

	const credentials = await this.getCredentials('joggAiCredentialsApi');

	const body = {
		age,
		appearance,
		aspect_ratio: aspectRatio,
		avatar_style: avatarStyle,
		background,
		ethnicity,
		gender,
		image_url: imageUrl,
		model,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.domain as string}/v1/photo_avatar/new_look/generate`,
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
