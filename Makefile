default: restart

.PHONY: restart
restart:
	pnpm run build
	@-echo "Copying icon..."
	@-cp nodes/JoggAiNode/joggai.png dist/nodes/JoggAiNode/joggai.png
	@-cp nodes/JoggAiWebhookTrigger/joggai.png dist/nodes/JoggAiWebhookTrigger/joggai.png
	npx n8n
