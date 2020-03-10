#!/bin/sh

dev:
	docker-compose -f docker-compose.dev.yml down --remove-orphans
	docker-compose -f docker-compose.dev.yml build --force-rm --no-cache
	docker-compose -f docker-compose.dev.yml up --force-recreate

prod-local:
	docker-compose -f docker-compose.prod.yml down --remove-orphans
	docker-compose -f docker-compose.prod.yml build --force-rm --no-cache
	docker-compose -f docker-compose.prod.yml up --force-recreate

prod:
	docker-compose -f docker-compose.prod.yml down --remove-orphans
	docker-compose -f docker-compose.prod.yml build --force-rm --no-cache
	docker-compose -f docker-compose.prod.yml up -d --force-recreate

down:
	docker-compose -f docker-compose.dev.yml down --remove-orphans
	docker-compose -f docker-compose.prod.yml down --remove-orphans

clean:
	docker system prune -a -f --volumes
