default: restart

.PHONY: restart
restart:
	@-rm -rf dist
	@-pnpm run build
	# Add it when you start n8n, otherwise you won't get the original HTTP request payload.
	export N8N_PAYLOAD_DIGEST=true
	npx n8n

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