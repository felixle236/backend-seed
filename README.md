# backend-seed - Backend environment
NodeJS - Typescript - MongoDB

* Integrating user permission & good transmission in large numbers of users.
* Store common data in memory to increase performance.
* Suitable for Web apps & APIs.
* Run & debug on .ts files by Visual Code.
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
- ESLint
- Mocha
- Grunt
- Visual Code tool

### Install

```s
npm install && npm install -g grunt
```

### Structure

```sh
- |-- .vscode
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
- |------------ initialData------------// Data default or test.
- |------------ templates
- |------------------ source----------// Template files for generate module.
- |------ system
- |------------ Authenticator.ts
- |------------ DataLoader.ts---------// Memory data.
- |------------ InitialData.ts----------// Check & insert data default or test.
- |------------ MiddlewareLoader.ts
- |------------ RouteLoader.ts
- |------ test
- |------ server.ts
- |-- upload--------------------------// Upload directory.
- |-- .eslintrc.js
- |-- .gitignore
- |-- gruntfile.js
- |-- package.json
- |-- tsconfig.json
```

### NPM & Grunt commands

```s
npm run watch ----------// watch.
npm run eslint
npm run drop-db ----------// drop database.
npm run build
npm run start ----------// start for development.
npm run start-with-data ----------// start for development & insert data test.
npm run deploy ----------// start for deployment.
npm run test ----------// run unit test.
grunt exec:generate:Customer ----------// Generate module "Customer": schema, model, repository, business, controller,... (without route loader)
```

* If execute "grunt" with an error "The term 'grunt' is not recognized as the name of a cmdlet" on Windows OS, execute this command with administrator: setx path "%PATH%;%APPDATA%\npm"
* If execute "grunt drop-db" with an error (because you can not execute the mongo command), set the path for mongodb on Windows OS, execute this command with administrator: setx path "%PATH%;C:\Program Files\MongoDB\Server\[version]\bin"
* Set default cmd.exe (Windows - VS Code): Ctrl+Shift+P -> Type "Select Default Shell" -> Select "Command Prompt" -> Restart VS Code.

### Debug on Visual Code

* Press F5: build & start with debug mode.
* Debugging in .ts files.
