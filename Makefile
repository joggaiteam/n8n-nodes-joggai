default: restart

.PHONY: restart
restart:
	pnpm run build
	@-echo "Copying icon..."
	@-cp nodes/JoggAiNode/joggai.png dist/nodes/JoggAiNode/joggai.png
	@-cp nodes/JoggAiWebhookTrigger/joggai.png dist/nodes/JoggAiWebhookTrigger/joggai.png
	# 在启动 n8n 时加上，否则拿不到原始 http request payload
	export N8N_PAYLOAD_DIGEST=true
	npx n8n
