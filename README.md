# A Tour of Restate

Restate is a system for easily building resilient applications using **distributed durable RPC & async/await**.

This repository contains the code examples for the `Tour of Restate` tutorial.
This tutorial takes your through key Restate features by developing an end-to-end ticketing app.

❓ Learn more about Restate from the [Restate documentation](https://github.com/restatedev/documentation).

Have a look at the `Tour of Restate` tutorial in the documentation to build and run the application in this repository.

## Releasing

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

### Upgrading Restate runtime
This repository does not make use of the runtime directly. 
But this repository is part of the `Tour of Restate` tutorial in the docs, which does refer to Restate runtime container image. 
Do the version upgrades in the `Tour of Restate` tutorial in the docs.