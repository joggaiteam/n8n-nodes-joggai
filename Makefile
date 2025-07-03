default: restart

.PHONY: restart
restart:
	cd ~/dev/cds-jogg/n8n-nodes-joggai
	pnpm run build
	@echo "拷贝 icon..."
	@-cp nodes/JoggAiNode/joggai.png dist/nodes/JoggAiNode/joggai.png
	npx n8n
