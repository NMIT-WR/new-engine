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
	docker exec wr_medusa_be pnpm --filter medusa-be update @medusajs*
update:
	docker build -f docker/development/pnpm/Dockerfile -t pnpm-env . && \
    docker run -v .:/var/www pnpm-env pnpm update --latest
npkill:
	docker build -f docker/development/pnpm/Dockerfile -t pnpm-env . && \
    docker run -it -v .:/var/www pnpm-env pnpx npkill -x -D -y
dev:
	docker compose -f docker-compose.yaml -p new-engine up --force-recreate -d --build
down:
	docker compose -f docker-compose.yaml -p new-engine down
down-with-volumes:
	docker compose -f docker-compose.yaml -p new-engine down -v

# Medusa specific commands
medusa-create-user:
	docker exec wr_medusa_be pnpm --filter medusa-be exec medusa user -e $(EMAIL) -p $(PASSWORD)
medusa-migrate:
	docker exec wr_medusa_be pnpm --filter medusa-be run migrate
medusa-minio-init:
	docker exec wr_medusa_minio mc config host add local http://localhost:9004 minioadmin minioadmin --api S3v4 --lookup auto && \
	docker exec wr_medusa_minio mc admin accesskey create --access-key minioadminkey --secret-key minioadminkey local && \
	docker cp ./docker/development/medusa-minio/config/local-bucket-metadata.zip wr_medusa_minio:. && \
	docker exec wr_medusa_minio mc admin cluster bucket import local /local-bucket-metadata.zip
medusa-meilisearch-reseed:
	docker exec wr_medusa_be pnpm --filter medusa-be run addInitialSearchDocuments
medusa-seed:
	docker exec wr_medusa_be pnpm --filter medusa-be run seedInitialData