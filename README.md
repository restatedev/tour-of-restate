# A Tour of Restate

This repository contains the code examples for the "Tour of Restate" tutorial.

Have a look at the tutorial to find out more.

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