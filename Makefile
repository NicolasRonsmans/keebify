#!/bin/sh

define build-dev
	docker-compose -f docker-compose.dev.yml build --force-rm --no-cache
endef

define build-prod
	docker-compose build --force-rm --no-cache
endef

define down-dev
	docker-compose -f docker-compose.dev.yml down --remove-orphans
endef

define down-prod
	docker-compose down --remove-orphans
endef

define down
	TMPDIR=/media/external/docker-tmp/ $(down-dev)
	TMPDIR=/media/external/docker-tmp/ $(down-prod)
endef

dev:
	TMPDIR=/media/external/docker-tmp/ $(build-dev)
	TMPDIR=/media/external/docker-tmp/ $(down-dev)
	TMPDIR=/media/external/docker-tmp/ docker-compose -f docker-compose.dev.yml up

dev-detached:
	$(build-dev)
	$(down)
	docker-compose -f docker-compose.dev.yml up -d

prod:
	$(build-prod)
	$(down-prod)
	docker-compose up -d --force-recreate

prod-local:
	$(build-prod)
	$(down-prod)
	docker-compose up --force-recreate

down:
	$(down)

down-dev:
	$(down-dev)

docker-prune-all:
	TMPDIR=/media/external/docker-tmp/ docker system prune -a -f --volumes
