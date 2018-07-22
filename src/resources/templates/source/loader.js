const fs = require('fs');
let moduleName = process.env.MODULE_NAME;

if (moduleName) {
    moduleName = moduleName.trim();
    let camelName = moduleName.substr(0, 1).toLowerCase() + moduleName.substr(1);
    let pascalName = moduleName.substr(0, 1).toUpperCase() + moduleName.substr(1);

    let modelInterfaceDirPath = `${__dirname}/../../../application/models/${camelName}/interfaces`;
    let modelInterfacePath = `${__dirname}/../../../application/models/${camelName}/interfaces/I${pascalName}.ts`;
    let modelInterface = getFileContent(`${__dirname}/modelInterface.tmp`, camelName, pascalName);

    let schemaPath = `${__dirname}/../../../application/schemas/${pascalName}Schema.ts`;
    let schema = getFileContent(`${__dirname}/schema.tmp`, camelName, pascalName);

    let modelDirPath = `${__dirname}/../../../application/models/${camelName}`;
    let modelViewPath = `${__dirname}/../../../application/models/${camelName}/${pascalName}View.ts`;
    let modelView = getFileContent(`${__dirname}/model.tmp`, camelName, pascalName);

    let repositoryPath = `${__dirname}/../../../application/repositories/${pascalName}Repository.ts`;
    let repository = getFileContent(`${__dirname}/repository.tmp`, camelName, pascalName);

    let businessInterfacePath = `${__dirname}/../../../application/businesses/interfaces/I${pascalName}Business.ts`;
    let businessInterface = getFileContent(`${__dirname}/businessInterface.tmp`, camelName, pascalName);

    let businessPath = `${__dirname}/../../../application/businesses/${pascalName}Business.ts`;
    let business = getFileContent(`${__dirname}/business.tmp`, camelName, pascalName);

    let controllerPath = `${__dirname}/../../../controllers/${pascalName}Controller.ts`;
    let controller = getFileContent(`${__dirname}/controller.tmp`, camelName, pascalName);

    let claimPath = `${__dirname}/../../../resources/permissions/${pascalName}Claim.ts`;
    let claim = getFileContent(`${__dirname}/claim.tmp`, camelName, pascalName);

    let initializationPath = `${__dirname}/../../../resources/initialization/${pascalName}s.ts`;
    let initialization = getFileContent(`${__dirname}/initialization.tmp`, camelName, pascalName);

    let businessTestingPath = `${__dirname}/../../../test/02.businesses/${pascalName}Business.ts`;
    let businessTesting = getFileContent(`${__dirname}/businessTesting.tmp`, camelName, pascalName);

    if (!fs.existsSync(modelDirPath))
        fs.mkdirSync(modelDirPath);
    if (!fs.existsSync(modelInterfaceDirPath))
        fs.mkdirSync(modelInterfaceDirPath);

    fs.writeFileSync(modelInterfacePath, modelInterface);
    fs.writeFileSync(schemaPath, schema);
    fs.writeFileSync(modelViewPath, modelView);
    fs.writeFileSync(repositoryPath, repository);
    fs.writeFileSync(businessInterfacePath, businessInterface);
    fs.writeFileSync(businessPath, business);
    fs.writeFileSync(controllerPath, controller);
    fs.writeFileSync(claimPath, claim);
    fs.writeFileSync(initializationPath, initialization);
    fs.writeFileSync(businessTestingPath, businessTesting);
}

/**
 * Get content of special file
 * @param {string} path Generate source code to directory
 * @param {string} camelName The module name with camel style
 * @param {string} pascalName The module name with pascal style
 */
function getFileContent(path, camelName, pascalName) {
    return fs.readFileSync(path, 'utf8').replace(new RegExp('{camelName}', 'g'), camelName).replace(new RegExp('{pascalName}', 'g'), pascalName);
}
