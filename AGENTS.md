# PDE host agent instructions

This repository is a generated PDE host. Keep package identity, DI namespace, service account, database role/name, and deployment workflow consistent. Inspect the installed PDE Runtime and Desk contracts before changing CLI metadata or environment keys.

Select only the Desks required for this owner. The Echo Desk can serve as a local integration check; Telegram requires private API credentials and TDLib state. Files, World Map, CMS, and delegate SMTP are optional features. Never commit `.env`, secrets, TDLib state, or application data.

Preserve the host `db:migrate` wrapper. It initializes an empty PostgreSQL database through Runtime Database and delegates existing schemas to Runtime migration. Do not add legacy migration classes copied from older host repositories; those encode predecessor schemas for specific deployments.

Before production deployment, review `scripts/create-user.sh` and `.github/workflows/deploy.yml` against the actual operating system, public domain, service identity, and package access. Provisioning is an explicit operator action. Keep a committed lockfile and document this host's Desks, local setup, and production variables in README.md.
