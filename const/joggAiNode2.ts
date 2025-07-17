export const CREDENTIALS_API_NAME = 'joggAiApi';

export const DOCUMENTATION_URL = 'https://docs.jogg.ai/api-reference/QuickStart/GettingStarted';

export const VIDEO_RESOURCE = {
	name: 'Video',
	value: 'video',
	operation: {
		CREATE_FROM_AVATAR: {
			name: 'Create from Avatar',
			value: 'createFromAvatar',
			action: 'Create a video from an avatar and a script',
			description: 'Creates a new video using an avatar and a script',
		},
		CREATE_FROM_PRODUCT: {
			name: 'Create from Product',
			value: 'createFromProduct',
			action: 'Create a video from a product',
			description: 'Creates a new video by summarizing a product like a product details page',
		},
		CREATE_FROM_TEMPLATE: {
			name: 'Create from Template',
			value: 'createFromTemplate',
			action: 'Create a video from a template',
			description: 'Creates a new video from a pre-defined template',
		},
		GET: {
			name: 'Get',
			value: 'get',
			action: 'Get a generated video',
			description: 'Retrieves information about a generated video',
		},
		GENERATE_PREVIEW: {
			name: 'Generate Preview',
			value: 'generatePreview',
			action: 'Generate a video preview from a product',
			description: 'Generates a video preview from a product without creating the final video',
		},
	},
};

export const AVATAR_RESOURCE = {
	name: 'Avatar',
	value: 'avatar',
	operation: {
		GET_LIBRARY_AVATARS: {
			name: 'Get Library Avatars',
			value: 'getLibraryAvatars',
			action: 'Get a list of library avatars',
			description: 'Retrieves a list of public available avatars',
		},
		GET_INSTANT_AVATARS: {
			name: 'Get Instant Avatars',
			value: 'getInstantAvatars',
			action: 'Get a list of instant avatars',
			description: 'Retrieves a list of your clone avatars',
		},
		GET_PHOTO_AVATARS: {
			name: 'Get Photo Avatars',
			value: 'getPhotoAvatars',
			action: 'Get a list of my photo avatars',
			description: 'Retrieves a list of your photo avatars',
		},
		GENERATE_AI_PHOTO: {
			name: 'Generate AI Photo',
			value: 'generateAiPhoto',
			action: 'Generate Four AI photos',
			description: 'Generates four new AI photos based on a description',
		},
		CHECK_PHOTO_STATUS: {
			name: 'Check Photo Generation Status',
			value: 'checkPhotoStatus',
			action: 'Check photo generation status',
			description: 'Checks the generation status of the AI photo',
		},
		CREATE_PHOTO_AVATAR: {
			name: 'Create Photo Avatar',
			value: 'createPhotoAvatar',
			action: 'Create a photo avatar',
			description: 'Create a photo avatar based on the specified description',
		},
		CHECK_PHOTO_AVATAR_STATUS: {
			name: 'Check Photo Avatar Generation Status',
			value: 'checkPhotoAvatarStatus',
			action: 'Check status of the avatar generation',
			description: 'Checks the generation status of an avatar task',
		},
	},
};

export const VOICE_RESOURCE = {
	name: 'Voice',
	value: 'voice',
	operation: {
		GET_LIBRARY_VOICES: {
			name: 'Get Library Voices',
			value: 'getLibraryVoices',
			action: 'Get a list of Library voices',
			description: 'Retrieves a list of all public available voices',
		},
		GET_MY_VOICES: {
			name: 'Get My Voices',
			value: 'getMyVoices',
			action: 'Get my voices',
			description: 'Retrieves a list of your custom voices',
		},
	},
};

export const TEMPLATE_RESOURCE = {
	name: 'Template',
	value: 'template',
	operation: {
		GET_LIBRARY_TEMPLATES: {
			name: 'Get Library Templates',
			value: 'getLibraryTemplates',
			action: 'Get template list from library',
			description: 'Retrieves a list of all public templates voices',
		},
		GET_MY_TEMPLATES: {
			name: 'Get My Templates',
			value: 'getMyTemplates',
			action: 'Get my templates',
			description: 'Retrieves a list of your custom templates',
		},
	},
};

export const PRODUCT_RESOURCE = {
	name: 'Product',
	value: 'product',
	operation: {
		UPLOAD_PRODUCT: {
			name: 'Upload product',
			value: 'uploadProduct',
			action: 'Upload a product for video creation',
			description: 'Uploads and processes a product to be used for video creation',
		},
		UPDATE_PRODUCT: {
			name: 'Update product',
			value: 'updateProduct',
			action: 'Update a product',
			description: 'Update the information of a product',
		},
	},
};

export const AI_SCRIPT_RESOURCE = {
	name: 'AI Script',
	value: 'aiScript',
	operation: {
		GENERATE: {
			name: 'Generate',
			value: 'generate',
			action: 'Generate an AI script',
			description: 'Generates a script from a product or description using AI',
		},
	},
};

export const FILE_RESOURCE = {
	name: 'File',
	value: 'file',
	operation: {
		UPLOAD: {
			name: 'Upload',
			value: 'upload',
			action: 'Upload a file',
			description: 'Uploads a file for use in video generation',
		},
	},
};

export const MUSIC_RESOURCE = {
	name: 'Music',
	value: 'music',
	operation: {
		GET: {
			name: 'Get',
			value: 'get',
			action: 'Get music',
			description: 'Retrieves a list of available background music',
		},
	},
};

export const VISUAL_STYLE_RESOURCE = {
	name: 'Visual Style',
	value: 'visualStyle',
	operation: {
		GET: {
			name: 'Get',
			value: 'get',
			action: 'Get visual styles',
			description: 'Retrieves a list of available visual styles for use in video generation',
		},
	},
};

export const WEBHOOK_RESOURCE = {
	name: 'Webhook',
	value: 'webhook',
	operation: {
		LIST_WEBHOOK: {
			name: 'List of Webhook Endpoints',
			value: 'webhook:list',
			description: 'Get a list of configured webhook endpoints',
		},
		ADD_WEBHOOK: {
			name: 'Add a Webhook Endpoint',
			value: 'webhook:add',
			description: 'Add a new webhook endpoint configuration',
		},
		UPDATE_WEBHOOK: {
			name: 'Update a Webhook Endpoint',
			value: 'webhook:update',
			description: 'Update an existing webhook endpoint configuration',
		},
		DELETE_WEBHOOK: {
			name: 'Delete a Webhook Endpoint',
			value: 'webhook:delete',
			description: 'Delete an existing webhook endpoint',
		},
		EVENTS_WEBHOOK: {
			name: 'List of Available Webhook Events',
			value: 'webhook:events',
			description: 'Get a list of available webhook events',
		},
	},
};
