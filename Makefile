default: restart

.PHONY: restart
restart:
	@-rm -rf dist
	@-pnpm run build
	# Add it when you start n8n, otherwise you won't get the original HTTP request payload.
	N8N_PAYLOAD_DIGEST=true N8N_LOG_LEVEL=debug npx n8n

.PHONY: pack
pack:
	@-rm -rf dist
	@-rm -rf output
	#@-pnpm run lint
	@-pnpm run build
	@-pnpm pack --pack-destination ./output

.PHONY: clean
clean:
	@-rm -rf dist
	@-rm -rf output

.PHONY: pre-check
pre-check:
	@npx @n8n/scan-community-package n8n-nodes-joggai
