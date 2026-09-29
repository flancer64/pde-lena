# PDE host template

This repository is the starting point for a Personal Digital Embassy host. Ask the agent to create a new GitHub repository with **Use this template** and clone it locally. The new repository starts with host files at its root and evolves independently.

After cloning the new repository, the agent working inside it follows the [current host setup instructions](https://github.com/flancer64/pde-tmpl/blob/main/HOST_SETUP.md). It customizes the application, prepares the target VPS, deploys the first release, and removes the copied `HOST_SETUP.md` after successful deployment. The template instructions can evolve on `main`; a host does not need to track later template changes.

The agent will need the owner's public identity, selected Desks, public domain, target VPS, and repository access. It can identify missing inputs as it works with the human manager. GitHub repository variables and secrets, SSH access, and any private package access must be configured for the new repository before deployment.

## Host contents

- `package.json`, `bootstrap/`, `src/`: TeqFW host composition and the migration command. On a clean PostgreSQL database, the command initializes Runtime tables; on an existing database it delegates to Runtime migration.
- `.env.example`, `etc/log.policy`: local configuration and logging policy.
- `scripts/create-user.sh`: optional Debian or Ubuntu VPS provisioning for this host.
- `.github/workflows/deploy.yml`: manual release deployment.
- `AGENTS.md`: rules retained in the customized host.
- `HOST_SETUP.md`: temporary agent instructions, removed from the new host after its first deployment.

The base host includes Echo and Telegram Desks. Select the Desks the owner actually needs. The template contains placeholder identity `pde-template` / `Pde_Template_` / `pde_template`; provisioning and deployment refuse to run until those placeholders are replaced.

The source projects were reviewed in order Alex, Tanya, Viktor, Igor, with greater weight on newer hosts. Igor provided the deployment topology and provisioning script. Its predecessor database migration was excluded; it is specific to an existing host. The empty database initialization path is retained in this template because Runtime's migration command alone does not initialize a clean database. Alex supplied the newer `PERSON_SECRET` configuration name and examples of optional Files, World Map, CMS, and delegate mail features.
