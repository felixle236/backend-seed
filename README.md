# backend-seed - Backend environment
NodeJS - Typescript - MongoDB

* Integrating user permission & good transmission in large numbers of users (Using data caching).
* Store common data in memory & share them between processes (if use cluster module) to improve performance.
* Suitable for Web apps & APIs.
* Integrating unit test & coverage.
* Watch & debug on .ts files by Visual Code.
* Reference structure from https://github.com/ErickWendel/NodeJSWithTypescript

### Patterns and Principles

- Generic Repository Pattern
- Singleton Pattern
- Multi-layer Architecture Pattern

### Tools

- NodeJS version >= 7.x
- Typescript
- ExpressJS
- MongoDB
- Mongoose
- NeDB
- ESLint
- Mocha
- IstanbulJS
- Grunt
- Visual Code tool

### Install

```s
npm install
or
npm i
```

### Structure

```sh
- |-- .nyc_output
- |-- .vscode
- |-- coverage
- |-- dest-----------------------------// Built from the src directory.
- |-- node_modules
- |-- src-----------------------------// Source of development.
- |------ app
- |------------ business
- |------------ dataAccess
- |------------ model
- |------------ repository
- |------ config
- |------ controllers
- |------ helpers
- |------ resources
- |------------ errors----------------// Error data.
- |------------ initialData------------// Data default or test.
- |------------ templates
- |------------------ source----------// Template files for generate module.
- |------ system
- |------------ Authenticator.ts
- |------------ BusinessLoader.ts
- |------------ DataCaching.ts
- |------------ MiddlewareLoader.ts
- |------------ RouteLoader.ts
- |------ test
- |------ server.ts
- |------ serverCaching.ts
- |-- upload--------------------------// Upload directory.
- |-- .eslintrc.js
- |-- .gitignore
- |-- .nycrc
- |-- gruntfile.js
- |-- LICENSE
- |-- package.json
- |-- tsconfig.json
```

### NPM & Grunt commands

```s
npm run watch ----------// watch.
npm run eslint
npm run test ----------// run unit test.
npm run build
npm run start ----------// start with development environment.
npm run staging ----------// start with staging environment.
npm run production ----------// start with production environment.
grunt exec:generate:Customer ----------// Generate module "Customer": schema, model, repository, business, controller,... (without route loader and business loader)
```

### Debug on Visual Code

* Press F5: build & start with debug mode.
* Debugging in .ts files.
