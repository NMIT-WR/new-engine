CFLAGS=-g
export CFLAGS

# Global commands
install:
	docker build -f docker/development/pnpm/Dockerfile -t pnpm-env . && \
    docker run -v .:/app pnpm-env pnpm install --frozen-lockfile
install-no-lock:
	docker build -f docker/development/pnpm/Dockerfile -t pnpm-env . && \
    docker run -v .:/app pnpm-env pnpm install
dev:
	docker compose -f docker-compose.yaml -p new-engine up --force-recreate -d --build

# Medusa specific commands
medusa-create-user:
	docker exec wr_medusa_be pnpm --filter medusa-be exec medusa user -e $(EMAIL) -p $(PASSWORD)
medusa-migrate:
	docker exec wr_medusa_be pnpm --filter medusa-be exec medusa migrate
medusa-minio-init:
	docker exec wr_medusa_minio mc config host add local http://localhost:9004 minioadmin minioadmin --api S3v4 --lookup auto && \
	docker exec wr_medusa_minio mc admin accesskey create --access-key minioadminkey --secret-key minioadminkey local && \
	docker cp ./docker/development/medusa-minio/config/local-bucket-metadata.zip wr_medusa_minio:. && \
	docker exec wr_medusa_minio mc admin cluster bucket import local /local-bucket-metadata.zip
medusa-meilisearch-reseed:
	docker exec wr_medusa_be pnpm --filter medusa-be run addInitialSearchDocuments