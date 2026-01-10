# Local runtime instructions

### Requirements:

* Docker compose + Docker
  * For Mac, <a href="https://orbstack.dev/">OrbStack</a> is recommended instead of Docker Desktop
* Node.js (for the workspace CLI)

### Steps

1. <b>Create .env file</b>
    * copy .env.docker => .env
    * optionally update config as needed

2. <b>Install dependencies</b>

    ```shell
    node libs/cli/src/index.mjs install
    ```

* alternatively, force dependency lock fix:
  ```shell
  node libs/cli/src/index.mjs install-fix-lock
  ```

3. <b>Run docker compose</b>
    ```shell
    node libs/cli/src/index.mjs dev
    ```

4. <b>Migrate database</b> (if needed)
    * <i>(optional)</i> `medusa` schema needs to exist, which it should, unless it was manually dropped
    ```shell
    node libs/cli/src/index.mjs medusa-migrate
    ```

5. <b>Create user for medusa admin</b> (if needed)
    ```shell
    node libs/cli/src/index.mjs medusa-create-user --email [some@email.com] --password [PASSWORD]
    ```

6. <b>Prepare file storage</b> (only first time setup)
    ```shell
    node libs/cli/src/index.mjs medusa-minio-init
    ```

7. <b>Seed initial data</b> (only first time)
    * seeded data also add regions that are required to be set
    * optionally this step can be skipped, but you need to manually add at least 1 region in medusa BE settings page
   ```shell
   node libs/cli/src/index.mjs medusa-seed
   ```


8. <b>Create & set PUBLISHABLE_API_KEY</b> for Store front (only first time)
    * Restart services (commands below)
    * Go to <a href="http://localhost:9000/app">localhost:9000/app</a>
    * Login via user created in previous step
    * Go to settings -> Publishable API Keys
    * Create or copy existing key
    * Update NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY in .env
    * Restart services
   ```shell
   node libs/cli/src/index.mjs down
   node libs/cli/src/index.mjs dev
   ```

9. <b>Explore local envs</b>
    * Medusa FE should be available at:
        * <a href="http://localhost:8000">localhost:8000</a>
        * <a href="https://front.medusa.localhost">https://front.medusa.localhost</a>
    * Medusa BE should be available at:
        * <a href="http://localhost:9000/app">localhost:9000/app</a>
        * <sup>(1)</sup><a href="https://admin.medusa.localhost/app">https://admin.medusa.localhost/app</a>
    * Minio console should be available at:
        * <a href="http://localhost:9003">localhost:9003</a>
        * <a href="https://admin.minio.localhost">https://admin.minio.localhost</a>
            * credentials: `minioadmin`/`minioadmin`
    * Meilisearch console should be available at:
        * <a href="http://localhost:7700">localhost:7700</a>
        * <a href="https://admin.meilisearch.localhost">https://admin.meilisearch.localhost</a>
            * credentials: `MEILI_MASTER_KEY_FOR_DEVELOPMENT_ONLY`
            * (optional) if plugin was disabled before adding products:
                * `node libs/cli/src/index.mjs medusa-meilisearch-reseed`
    * Redis compatible ValKey storage can be connected at `localhost:6379`
    * Postgres DB can be connected at `localhost:5432`
        * default credentials: `root`/`root`
        * adminer can be accessed on <a href="http://localhost:8081">localhost:8081</a>

* <sup>(1)</sup> Caddyfile currently works inside of docker, and SSL cert is not exposed to host system,
  Admin for Medusa BE fails to connect websockets for Vite server due to SSL errors when visiting
  `https://admin.medusa.localhost/app`.

10. <b>Optional steps</b>

* Due to Server side rendering on FE and Client side rendering on BE for images, BE images are broken unless you
  edit hosts file on your host machine and add `127.0.0.1 medusa-minio` record
    * the issue is described here: <a href="https://github.com/curl/curl/issues/11104">curl/issues/11104</a>

---

## Testing Production Build Locally

To test the production Docker build locally:

```shell
node libs/cli/src/index.mjs prod
```

This builds a production-optimized image and starts the container. Access the admin at:
* <a href="https://admin.medusa.localhost/app">https://admin.medusa.localhost/app</a> (requires HTTPS for session cookies)

Note: Production mode uses secure cookies, so you must access via HTTPS (Caddy) rather than `http://localhost:9000`.

---

# WrSearch

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/6uDqdlKDOV)

## Generate a library

```sh
npx nx g @nx/js:lib packages/pkg1 --publishable --importPath=@my-org/pkg1
```

## Run tasks

To build the library use:

```sh
npx nx build pkg1
```

To run any task with Nx use:

```sh
npx nx <target> <project-name>
```

These targets are
either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Versioning and releasing

To version and release the library use

```sh
npx nx release
```

Pass `--dry-run` to see what would happen without actually releasing the library.

[Learn more about Nx release &raquo;](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Keep TypeScript project references up to date

Nx automatically updates
TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json`
files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is
automatically done when running tasks such as `build` or `typecheck`, which require updated references to function
correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references,
run the following command:

```sh
npx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a
step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and
improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

----

## ZCLI (Zerops zCLI)

https://github.com/zeropsio/zcli

```shell
curl -L https://zerops.io/zcli/install.sh | sh
```
