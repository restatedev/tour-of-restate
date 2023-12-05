[![Documentation](https://img.shields.io/badge/doc-reference-blue)](https://docs.restate.dev)
[![Examples](https://img.shields.io/badge/view-examples-blue)](https://github.com/restatedev/examples)
[![Discord](https://img.shields.io/badge/join-discord-purple)](https://discord.gg/skW3AZ6uGd)
[![Twitter](https://img.shields.io/twitter/follow/restatedev.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=restatedev)

# A Tour of Restate: Typescript handler API

Restate is a system for easily building resilient applications using **distributed durable RPC & async/await**.

This repository contains the code examples for the `Tour of Restate` tutorial.
This tutorial takes your through key Restate features by developing an end-to-end ticketing app.

❓ Learn more about Restate from the [Restate documentation](https://docs.restate.dev).

Have a look at the [Tour of Restate tutorial](https://docs.restate.dev/tour) in the documentation to build and run the application in this repository.

## Releasing

In order to create a new release, push a tag of the form `vX.Y.Z`.
Then [create a release via GitHub](https://github.com/restatedev/tour-of-restate-typescript/releases).

Releases of this repository are referred to by the [documentation](https://github.com/restatedev/documentation).
Please update the version tag referenced on the [Tour of Restate](https://github.com/restatedev/documentation/blob/main/docs/tour.mdx) documentation page.

### Upgrading Typescript SDK
Upgrade the version tag in `package.json` and rerun the different parts of the tutorial:
```
npm install
npm run build
npm run app
npm run part1
npm run part2
npm run part3
npm run part4
```

An SDK upgrade warrants a new release.
