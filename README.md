# 🚀 Fluent Emoji

This repository contains the source code for the website [https://fluentemoji.com](https://fluentemoji.com) and was bootstrapped using [`create-react-app`](https://github.com/facebook/create-react-app).

This website allows for browsing Microsoft's "familiar, friendly, and modern emoji". Including additional features such as: browsing supported skintones, swapping illustration styles, and downloading the source images for quick reference and reuse.

The source emoji are from the Open Source Fluent Emoji repository hosted on [Microsoft's GitHub page](https://github.com/microsoft/fluentui-emoji).

## Getting Started

This repository leverages [VSCode's devcontainer](https://code.visualstudio.com/docs/remote/containers) feature to ensure all necessary dependencies are available inside the container for development.

### Application

To get started:

```bash
npm init && npm start
```

This will start the application on your local machine, running on [http://localhost:3000/](http://localhost:3000).

### Deployments

All application deployments are managed via GitHub Actions and the [`./.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) workflow.

Additionally, application dependencies are automatically managed and updated via Dependabot and the [`./.github/workflows/automerge-dependabot.yml`](./.github/workflows/automerge-dependabot.yml) workflow.
