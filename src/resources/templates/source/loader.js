const fs = require('fs');
let moduleName = process.env.MODULE_NAME;

if (moduleName) {
    moduleName = moduleName.trim();
    let camelName = moduleName.substr(0, 1).toLowerCase() + moduleName.substr(1);
    let pascalName = moduleName.substr(0, 1).toUpperCase() + moduleName.substr(1);

    let schemaPath = `${__dirname}/../../../app/dataAccess/schemas/${pascalName}Schema.ts`;
    let schema = getFileContent(`${__dirname}/schema.tmp`, camelName, pascalName);

    let modelDirPath = `${__dirname}/../../../app/model/${camelName}`;
    let modelPath = `${__dirname}/../../../app/model/${camelName}/${pascalName}.ts`;
    let model = getFileContent(`${__dirname}/model.tmp`, camelName, pascalName);

    let modelCreatePath = `${__dirname}/../../../app/model/${camelName}/${pascalName}Create.ts`;
    let modelCreate = getFileContent(`${__dirname}/modelCreate.tmp`, camelName, pascalName);

    let modelUpdatePath = `${__dirname}/../../../app/model/${camelName}/${pascalName}Update.ts`;
    let modelUpdate = getFileContent(`${__dirname}/modelUpdate.tmp`, camelName, pascalName);

    let modelInterfaceDirPath = `${__dirname}/../../../app/model/${camelName}/interfaces`;
    let modelInterfacePath = `${__dirname}/../../../app/model/${camelName}/interfaces/I${pascalName}.ts`;
    let modelInterface = getFileContent(`${__dirname}/modelInterface.tmp`, camelName, pascalName);

    let repositoryPath = `${__dirname}/../../../app/repository/${pascalName}Repository.ts`;
    let repository = getFileContent(`${__dirname}/repository.tmp`, camelName, pascalName);

    let businessPath = `${__dirname}/../../../app/business/${pascalName}Business.ts`;
    let business = getFileContent(`${__dirname}/business.tmp`, camelName, pascalName);

    let businessInterfacePath = `${__dirname}/../../../app/business/interfaces/I${pascalName}Business.ts`;
    let businessInterface = getFileContent(`${__dirname}/businessInterface.tmp`, camelName, pascalName);

    let controllerPath = `${__dirname}/../../../controllers/${pascalName}Controller.ts`;
    let controller = getFileContent(`${__dirname}/controller.tmp`, camelName, pascalName);

    let initialDataPath = `${__dirname}/../../initialData/${pascalName}s.ts`;
    let initialData = getFileContent(`${__dirname}/initialData.tmp`, camelName, pascalName);

    if (!fs.existsSync(modelDirPath))
        fs.mkdirSync(modelDirPath);
    if (!fs.existsSync(modelInterfaceDirPath))
        fs.mkdirSync(modelInterfaceDirPath);

    fs.writeFileSync(schemaPath, schema);
    fs.writeFileSync(modelPath, model);
    fs.writeFileSync(modelCreatePath, modelCreate);
    fs.writeFileSync(modelUpdatePath, modelUpdate);
    fs.writeFileSync(modelInterfacePath, modelInterface);
    fs.writeFileSync(repositoryPath, repository);
    fs.writeFileSync(businessPath, business);
    fs.writeFileSync(businessInterfacePath, businessInterface);
    fs.writeFileSync(controllerPath, controller);
    fs.writeFileSync(initialDataPath, initialData);
}

function getFileContent(path, camelName, pascalName) {
    return fs.readFileSync(path, 'utf8').replace(new RegExp('{camelName}', 'g'), camelName).replace(new RegExp('{pascalName}', 'g'), pascalName);
}
