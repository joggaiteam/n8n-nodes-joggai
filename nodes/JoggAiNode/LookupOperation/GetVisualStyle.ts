import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

export const visualStyleListProperties: INodeProperties[] = [
	{
		displayName: 'Aspect Ratio',
		description: 'Screen aspect ratio',
		name: 'aspectRatio',
		type: 'options',
		required: false,
		default: -1,
		displayOptions: {
			show: {
				resource: ['lookup'],
				operation: ['visualStyle:list'],
			},
		},
		options: [
			{
				name: 'All',
				value: -1,
			},
			{
				name: '[9:16]',
				value: 0,
			},
			{
				name: '[16:9]',
				value: 1,
			},
			{
				name: '[1:1]',
				value: 2,
			},
		],
	},
];

export async function executeVisualStyleListOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const credentials = await this.getCredentials('joggAiCredentialsApi');

	let endpoint = `/v1/visual_styles`;
	const aspectRatio = this.getNodeParameter('aspectRatio', i) as string;
	const queryParams = [];
	if (aspectRatio !== undefined) {
		queryParams.push(`aspect_ratio=${aspectRatio}`);
	}
	if (queryParams.length > 0) {
		endpoint += `?${queryParams.join('&')}`;
	}

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}${endpoint}`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
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
