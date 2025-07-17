import { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { addWebhookProperties, executeAddWebhookOperation } from './WebhookOperation/AddWebhook';
import { listWebhookProperties, executeListWebhookOperation } from './WebhookOperation/ListWebhook';
import {
	deleteWebhookProperties,
	executeDeleteWebhookOperation,
} from './WebhookOperation/DeleteWebhook';
import {
	updateWebhookProperties,
	executeUpdateWebhookOperation,
} from './WebhookOperation/UpdateWebhook';
import {
	eventsWebhookProperties,
	executeEventsWebhookOperation,
} from './WebhookOperation/EventsWebhook';

import { WEBHOOK_RESOURCE } from '../../const/joggAiNode2';

export const webhookProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [WEBHOOK_RESOURCE.value],
			},
		},
		options: [
			{
				name: WEBHOOK_RESOURCE.operation.LIST_WEBHOOK.name,
				value: WEBHOOK_RESOURCE.operation.LIST_WEBHOOK.value,
				description: WEBHOOK_RESOURCE.operation.LIST_WEBHOOK.description,
				action: WEBHOOK_RESOURCE.operation.LIST_WEBHOOK.name,
			},
			{
				name: WEBHOOK_RESOURCE.operation.ADD_WEBHOOK.name,
				value: WEBHOOK_RESOURCE.operation.ADD_WEBHOOK.value,
				description: WEBHOOK_RESOURCE.operation.ADD_WEBHOOK.description,
				action: WEBHOOK_RESOURCE.operation.ADD_WEBHOOK.name,
			},
			{
				name: WEBHOOK_RESOURCE.operation.UPDATE_WEBHOOK.name,
				value: WEBHOOK_RESOURCE.operation.UPDATE_WEBHOOK.value,
				description: WEBHOOK_RESOURCE.operation.UPDATE_WEBHOOK.description,
				action: WEBHOOK_RESOURCE.operation.UPDATE_WEBHOOK.name,
			},
			{
				name: WEBHOOK_RESOURCE.operation.DELETE_WEBHOOK.name,
				value: WEBHOOK_RESOURCE.operation.DELETE_WEBHOOK.value,
				description: WEBHOOK_RESOURCE.operation.DELETE_WEBHOOK.description,
				action: WEBHOOK_RESOURCE.operation.DELETE_WEBHOOK.name,
			},
			{
				name: WEBHOOK_RESOURCE.operation.EVENTS_WEBHOOK.name,
				value: WEBHOOK_RESOURCE.operation.EVENTS_WEBHOOK.value,
				description: WEBHOOK_RESOURCE.operation.EVENTS_WEBHOOK.description,
				action: WEBHOOK_RESOURCE.operation.EVENTS_WEBHOOK.name,
			},
		],
		default: 'webhook:list',
		required: true,
	},
	...addWebhookProperties,
	...listWebhookProperties,
	...deleteWebhookProperties,
	...updateWebhookProperties,
	...eventsWebhookProperties,
];

export async function executeWebhookOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	switch (operation) {
		case WEBHOOK_RESOURCE.operation.ADD_WEBHOOK.value:
			return await executeAddWebhookOperation.call(this, i);
		case WEBHOOK_RESOURCE.operation.LIST_WEBHOOK.value:
			return await executeListWebhookOperation.call(this, i);
		case WEBHOOK_RESOURCE.operation.DELETE_WEBHOOK.value:
			return await executeDeleteWebhookOperation.call(this, i);
		case WEBHOOK_RESOURCE.operation.UPDATE_WEBHOOK.value:
			return await executeUpdateWebhookOperation.call(this, i);
		case WEBHOOK_RESOURCE.operation.EVENTS_WEBHOOK.value:
			return await executeEventsWebhookOperation.call(this, i);
		default:
			return [];
	}
}
