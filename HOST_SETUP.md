# Create and deploy a new PDE host

These instructions are for the agent creating a new repository from `flancer64/pde-tmpl` and deploying it. Read this document from the template's current `main` branch at the start of setup: https://github.com/flancer64/pde-tmpl/blob/main/HOST_SETUP.md. The copy in the new repository is temporary and must be removed after the first successful deployment. Apply the version read at the start of this run consistently; the template may change during the work.

The new host is independent of the template. Do not merge template history or assume future template changes apply to it.

## 0. Create the repository and local workspace

With the manager's chosen GitHub owner, repository name, and visibility, create a new repository from the GitHub template. Use the access already granted; ask the manager to create it or grant the specific access if needed. Clone the new repository and enter its root before changing files. Confirm that `package.json`, `scripts/create-user.sh`, and `.github/workflows/deploy.yml` are at the root. Continue using the instructions read from template `main` at the start.

## 1. Establish the host identity and scope

Confirm the owner's public name, repository owner/name, desired Desks, public HTTPS domain, VPS address and operating system, and who manages GitHub and server credentials. Infer values from existing authoritative information when available; ask the human manager for missing decisions. Never invent credentials or a domain.

Replace `pde-template`, `pde_template`, `Pde_Template_`, `Template Owner`, and `PDE Template` consistently in package metadata, source tokens, README, workflow, environment example, and provisioning script. Choose a lowercase Unix service account and PostgreSQL identifier. Keep the package private unless the manager decides otherwise. Remove unused Desks and their environment options; add required Desks using their current package contracts. Echo may remain as a deterministic local capability. Review installed Runtime, Desk, and TeqFW APIs before changing their integration points.

Preserve the host `db:migrate` adapter. Runtime's migration rejects an empty PostgreSQL database; the adapter initializes it through Runtime Database. Existing recognized schemas are delegated to Runtime migration. Do not import an existing host's legacy migration classes.

Replace this README with host-specific setup, enabled Desks, local verification steps, deployment configuration, and operational recovery instructions. Keep `AGENTS.md` for future work on this host. Commit a package lockfile after dependency installation. Keep `.env`, generated secrets, TDLib data, and database files out of Git.

## 2. Prepare a reviewable application

Install dependencies using authorized package access, confirm the package versions and configuration keys, and review all identity references. Use an isolated local database to check migration from empty state and startup when local infrastructure permits. Record any unavailable check or missing dependency clearly. Commit and push the host changes before touching the VPS. Do not run the generic template's provisioning script or deployment workflow: both must be customized first.

## 3. Arrange access with the manager

Determine which capabilities are already available. If something is missing, ask the manager for the specific action: repository permissions, SSH access to the target VPS, DNS control, GitHub Actions variables, SSH key, or package read credential. Use repository-scoped credentials with only the access needed. Do not request secret values in chat when the manager can enter them directly in GitHub or on the server. The deployment workflow currently expects `HOME_DIR`, `SERVICE`, `HOST`, `USER`, `SSH_KEY`, and `PDE_PACKAGES_READ_TOKEN`; adjust it if the chosen deployment model differs.

The agent may set these values itself when existing authorization and access allow it. Access to a tool is not by itself a decision about which server or identity to use; confirm the target from the manager's instructions or existing project records.

## 4. Provision the VPS

Review `scripts/create-user.sh` against the actual VPS before running it. The script is for Debian or Ubuntu and changes the local account, PostgreSQL, protected directories, systemd, sudoers, Apache, Certbot, and log rotation. Ensure the public domain resolves to the VPS and ports 80/443 are reachable before certificate issuance. Use SSH to inspect the host and complete the required preparation under the granted authority. Run the customized script with `BASE_URL=https://<domain>` and `PORT=<local-port>`; provide `CERTBOT_EMAIL` if chosen by the manager. The script creates a private app environment; add Desk credentials there without committing or logging them. Stop and resolve conflicts rather than overwriting unrelated host configuration.

## 5. Deploy and verify

Configure GitHub Actions variables and secrets in the new repository, then run its manual deployment workflow. The workflow installs dependencies, ships an archive, runs `db:migrate`, activates a release, and checks the service. Inspect the workflow result and verify the public HTTPS endpoint and the Desks expected for this host. If deployment fails, use the workflow's rollback evidence and service logs to repair the cause before retrying. Do not count a pushed commit or a green build job as a deployed host.

## 6. Finish the new repository

After the first successful deployment, document the final service identity, domain, enabled Desks, and recovery procedure in the host README without secrets. Remove this `HOST_SETUP.md` from the new repository, then commit and push that removal. Leave `AGENTS.md` as the host's continuing agent guidance. Report the repository URL, deployed endpoint, commit, verification evidence, and any remaining manager-owned work.
