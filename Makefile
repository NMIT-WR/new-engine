CFLAGS=-g
export CFLAGS

# Global commands
corepack-update:
	docker build -f docker/development/pnpm/Dockerfile -t pnpm-env . && \
	docker run -v .:/var/www pnpm-env corepack up
install:
	docker build -f docker/development/pnpm/Dockerfile -t pnpm-env . && \
	docker run -v .:/var/www pnpm-env pnpm install --frozen-lockfile
install-fix-lock:
	docker build -f docker/development/pnpm/Dockerfile -t pnpm-env . && \
	docker run -v .:/var/www pnpm-env pnpm install --fix-lockfile
update-medusa:
	docker build -f docker/development/pnpm/Dockerfile -t pnpm-env . && \
	docker run -v .:/var/www pnpm-env pnpm --filter medusa-be update "@medusajs/*" --latest
update:
	docker build -f docker/development/pnpm/Dockerfile -t pnpm-env . && \
	docker run -v .:/var/www pnpm-env pnpm --filter medusa-be update --latest
npkill:
	docker build -f docker/development/pnpm/Dockerfile -t pnpm-env . && \
	docker run -it -v .:/var/www pnpm-env pnpx npkill -x -D -y
dev:
	docker compose -f docker-compose.yaml -p new-engine up --force-recreate -d --build
prod:
	-docker compose -f docker-compose.yaml -f docker-compose.prod.yaml -p new-engine down
	-docker rmi new-engine-medusa-be-prod
	docker compose -f docker-compose.yaml -f docker-compose.prod.yaml -p new-engine build --no-cache medusa-be
	docker compose -f docker-compose.yaml -f docker-compose.prod.yaml -p new-engine up -d
down:
	docker compose -f docker-compose.yaml -p new-engine down
down-with-volumes:
	docker compose -f docker-compose.yaml -p new-engine down -v

# Medusa specific commands
# Usage: make medusa-create-user EMAIL=admin@example.com PASSWORD=secret
medusa-create-user:
	docker exec wr_medusa_be pnpm --filter medusa-be exec medusa user -e $(EMAIL) -p $(PASSWORD)
medusa-migrate:
	docker exec wr_medusa_be pnpm --filter medusa-be run migrate
# Usage: make medusa-generate-migration MODULE=my_module
medusa-generate-migration:
	docker exec wr_medusa_be pnpm --filter medusa-be run migrate:generate-only $(MODULE)
medusa-minio-init:
	docker exec wr_medusa_minio mc alias set local http://localhost:9004 minioadmin minioadmin && \
	docker exec wr_medusa_minio mc admin accesskey create --access-key minioadminkey --secret-key minioadminkey local && \
	docker cp ./docker/development/medusa-minio/config/local-bucket-metadata.zip wr_medusa_minio:. && \
	docker exec wr_medusa_minio mc admin cluster bucket import local /local-bucket-metadata.zip
medusa-meilisearch-reseed:
	docker exec wr_medusa_be pnpm --filter medusa-be run addInitialSearchDocuments
medusa-seed:
	docker exec wr_medusa_be pnpm --filter medusa-be run seedInitialData
medusa-seed-dev-data:
	docker exec wr_medusa_be pnpm --filter medusa-be run seedDevData
medusa-seed-n1:
	docker exec wr_medusa_be pnpm --filter medusa-be run seedN1
medusa-seed-northern:
	docker exec wr_medusa_be pnpm --filter medusa-be run seedNorthern

# Biome commands
biome-be:
	bunx biome check --write apps/medusa-be