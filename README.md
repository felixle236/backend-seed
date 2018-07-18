# backend-seed - Backend environment
NodeJS - Typescript - MongoDB

* Integrating user permission & good transmission in large numbers of users.
* Cache data in memory & share them between processes (if using the cluster module) to improve performance.
* Suitable for Web apps & APIs.
* Run & debug on .ts files by Visual Code.
* Unit test & coverage.

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
- Nedb
- ESLint
- Mocha
- Nyc
- Grunt
- Visual Code tool

### Install

```s
npm install
```

### Structure

```sh
- |-- .nyc_output
- |-- .vscode
- |-- coverage
- |-- dest-----------------------------// Built from the src directory.
- |-- node_modules
- |-- src-----------------------------// Source of development.
- |------ application
- |------------ businesses
- |------------ dataAccess
- |------------ models
- |------------ repositories
- |------ configuration
- |------ controllers
- |------ helpers
- |------ resources
- |------------ data
- |------------ initialization--------// Data default or test.
- |------------ permissions
- |------------ templates
- |------------------ source----------// Template files for generate module.
- |------ system
- |------------ Authenticator.ts
- |------------ ErrorMiddleware.ts
- |------------ LoggingMiddleware.ts
- |------------ Server.ts
- |------ test
- |------ app.ts
- |-- upload--------------------------// Upload directory.
- |-- .eslintrc.js
- |-- .gitignore
- |-- .nycrc
- |-- gruntfile.js
- |-- LICENSE
- |-- package.json
- |-- README.md
- |-- tsconfig.json
```

### NPM & Grunt commands

```s
npm run eslint
npm run test ----------// run unit test.
npm run build
npm run start ----------// start with development environment.
npm run staging ----------// start with staging environment.
npm run production ----------// start with production environment.
grunt exec:generate:Customer ----------// Generate module "Customer": schema, model, repository, business, controller,...
```

* If execute "grunt" with an error "The term 'grunt' is not recognized as the name of a cmdlet" on Windows OS, execute this command with administrator: setx path "%PATH%;%APPDATA%\npm"
* Set default cmd.exe (Windows - VS Code): Ctrl+Shift+P -> Type "Select Default Shell" -> Select "Command Prompt" -> Restart VS Code.

### Debug on Visual Code

* Press F5: build & start with debug mode.
* Debugging in .ts files.
