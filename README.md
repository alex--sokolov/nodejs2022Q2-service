# Home Library Service
NestJS, REST API

## Your steps in checking this task (Prisma):

```bash
git clone https://github.com/alex--sokolov/nodejs2022Q2-service
```

```bash
cd nodejs2022Q2-service
```

```bash
git checkout orm
```

```bash
npm i
```

```bash
npm run docker:start
```

```bash
npm run test
```

```bash
npm run docker:stop
```

# Thank you for assessment and have a good one!

___

##Common info

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```bash
git clone https://github.com/alex--sokolov/nodejs2022Q2-service
```

## Open task folder 

```bash
cd nodejs2022Q2-service
```

## Change branch

```bash
git checkout orm
```

## Prisma

Build images and start containers:

```bash
npm run docker:start
```

```bash
npm run docker:stop
```

Scan app image for vulnerabilities:

```bash
npm run docker:scan
```

Scan postgres image for vulnerabilities:

```bash
npm run docker:scandb
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```bash
npm run test
```

To run only one of all test suites

```bash
npm run test -- <path to suite>
```

To run all test with authorization

```bash
npm run test:auth
```

To run only specific test suite with authorization

```bash
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```

### Change port

You can also change port.
Rename .env-example to .env and set PORT inside it.

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
