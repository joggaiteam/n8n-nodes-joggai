import {
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';

import { VOICE_RESOURCE, CREDENTIALS_API_NAME } from '../../../const/joggAiNode2';

import { notSelectOption } from '../../../const/notSelect';
import { languageOptions } from '../../../const/language';

export const voiceListProperties: INodeProperties[] = [
	{
		displayName: 'Language',
		name: 'language',
		type: 'options',
		options: [notSelectOption, ...languageOptions],
		default: '',
		description: 'Optional. Filter the list of custom voices by language.',
		displayOptions: {
			show: {
				resource: [VOICE_RESOURCE.value],
				operation: [VOICE_RESOURCE.operation.GET_MY_VOICES.value],
			},
		},
	},
];

export async function executeVoiceListOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	let endpoint = `/v1/voices/custom`;

	const language = this.getNodeParameter('language', i) as string;
	const qs: IDataObject = {
		language: language,
	};

	const credentials = await this.getCredentials(CREDENTIALS_API_NAME);

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `${credentials.domain as string}${endpoint}`,
		headers: {
			'x-api-key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		json: true,
		qs: qs,
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
