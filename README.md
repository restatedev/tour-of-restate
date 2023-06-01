# A Tour of Restate

Restate is a system for easily building resilient applications using **distributed durable RPC & async/await**.

This repository contains the code examples for the `Tour of Restate` tutorial.
This tutorial takes your through key Restate features by developing an end-to-end ticketing app.

❓ Learn more about Restate from the [Restate documentation](https://github.com/restatedev/documentation).

Have a look at the `Tour of Restate` tutorial in the documentation to build and run the application in this repository.

## Releasing

In order to create a new release, push a tag of the form `vX.Y.Z`.
Then [create a release via GitHub](https://github.com/restatedev/tour-of-restate-typescript/releases).

Releases of this repository are referred to by the [documentation](https://github.com/restatedev/documentation).
Please update the version tag referenced on the [Tour of Restate](https://github.com/restatedev/documentation/blob/main/docs/tutorials/tour-of-restate.mdx) documentation page.

### Upgrading Typescript SDK
Upgrade the version tag in `package.json` and rerun the different parts of the tutorial:
```
npm install
npm run proto
npm run build
npm run app
npm run part1
npm run part2
npm run part3
npm run part4
```

An SDK upgrade warrants a new release.
