# pde-lena

Personal Digital Embassy for Helena Sovane at `https://lena.pde.wiredgeese.com`.

This host composes PDE Runtime with Echo Desk and Telegram Desk. Echo provides a
deterministic integration check. Telegram requires private Telegram API credentials
and a persistent TDLib directory; its account is authorized in the protected
`/desk/telegram/` setup page after deployment.

## Local setup

Use Node.js from `.nvmrc` and an isolated PostgreSQL database owned by a local
role. Create it yourself or use a disposable database. Do not point local tests
at the production database.

```sh
nvm use
npm ci --install-links
cp .env.example .env
# Set an independently generated PDE_RUNTIME__PERSON_SECRET (at least 32 chars),
# TEQFW_DB__PASSWORD, and the local database connection in .env.
npm run db:migrate
npm start
```

The migration wrapper initializes an empty PostgreSQL database using Runtime
Database and delegates an existing recognized schema to Runtime migration.
For Telegram, also set `PDE_DESK_TELEGRAM__API_ID` and
`PDE_DESK_TELEGRAM__API_HASH`, and keep `PDE_DESK_TELEGRAM__TDLIB_DIRECTORY`
outside the repository for persistent use. The local HTTP origin in
`.env.example` deliberately disables secure cookies; use secure cookies with
the production HTTPS origin.

## Production

The Debian/Ubuntu host uses account and systemd service `pde-lena`, PostgreSQL
role/database `pde_lena`, and a private environment file at
`/home/pde-lena/private/pde/app.env`. `scripts/create-user.sh` provisions those
resources, Apache with Certbot, Node through NVM, and log rotation. Run it only
on the verified target VPS after checking DNS, ports 80/443, existing Apache
configuration, and service identity:

```sh
sudo BASE_URL=https://lena.pde.wiredgeese.com PORT=3000 ./scripts/create-user.sh
```

The script generates the Person secret and PostgreSQL password in the private
environment file. Set the Telegram API ID and hash there without logging them;
the production TDLib directory is `/home/pde-lena/data/telegram/tdlib`.
Telegram setup is completed by the Person through the protected web page.
The production web process uses cleartext HTTP/2 on loopback for Apache's h2c
proxy; local `.env.example` uses HTTP/1 for direct development access.

The manual GitHub Actions workflow `.github/workflows/deploy.yml` requires
repository variables `HOST`, `USER`, `HOME_DIR`, and `SERVICE`, plus a scoped
`SSH_KEY` secret for the service account. The four private `flancer32` package
repositories each have a read-only deploy key, stored here as
`PDE_SDK_DEPLOY_KEY`, `PDE_RUNTIME_DEPLOY_KEY`, `PDE_ECHO_DEPLOY_KEY`, and
`PDE_TELEGRAM_DEPLOY_KEY` secrets. The workflow installs locked production
dependencies, copies a release archive, runs `db:migrate`, switches the current
release, and starts the service. Check the workflow result and the HTTPS
endpoint after each run.

## Recovery

Inspect `systemctl status pde-lena`, the service logs in
`/home/pde-lena/log/pde/`, and the GitHub Actions run. The workflow restores
the previous active release if activation or startup fails. For manual recovery,
stop `pde-lena`, point `/home/pde-lena/app/pde/current` at a known-good directory
under `releases/`, and start `pde-lena`. Database migrations may require their
own recovery plan; a code rollback does not reverse database changes. Keep the
private environment and TDLib state backed up separately from releases.
