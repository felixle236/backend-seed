const fs = require('fs');
let moduleName = process.env.MODULE_NAME;

if (moduleName) {
    moduleName = moduleName.trim();
    let pascalName = moduleName.substr(0, 1).toLowerCase() + moduleName.substr(1);
    let camelName = moduleName.substr(0, 1).toUpperCase() + moduleName.substr(1);

    let schemaPath = `${__dirname}/../../../app/dataAccess/schemas/${camelName}Schema.ts`;
    let schema = getFileContent(`${__dirname}/schema.tmp`, pascalName, camelName);

    let modelDirPath = `${__dirname}/../../../app/model/${pascalName}`;
    let modelPath = `${__dirname}/../../../app/model/${pascalName}/${camelName}.ts`;
    let model = getFileContent(`${__dirname}/model.tmp`, pascalName, camelName);

    let modelCreatePath = `${__dirname}/../../../app/model/${pascalName}/${camelName}Create.ts`;
    let modelCreate = getFileContent(`${__dirname}/modelCreate.tmp`, pascalName, camelName);

    let modelUpdatePath = `${__dirname}/../../../app/model/${pascalName}/${camelName}Update.ts`;
    let modelUpdate = getFileContent(`${__dirname}/modelUpdate.tmp`, pascalName, camelName);

    let modelInterfaceDirPath = `${__dirname}/../../../app/model/${pascalName}/interfaces`;
    let modelInterfacePath = `${__dirname}/../../../app/model/${pascalName}/interfaces/I${camelName}.ts`;
    let modelInterface = getFileContent(`${__dirname}/modelInterface.tmp`, pascalName, camelName);

    let repositoryPath = `${__dirname}/../../../app/repository/${camelName}Repository.ts`;
    let repository = getFileContent(`${__dirname}/repository.tmp`, pascalName, camelName);

    let businessPath = `${__dirname}/../../../app/business/${camelName}Business.ts`;
    let business = getFileContent(`${__dirname}/business.tmp`, pascalName, camelName);

    let businessInterfacePath = `${__dirname}/../../../app/business/interfaces/I${camelName}Business.ts`;
    let businessInterface = getFileContent(`${__dirname}/businessInterface.tmp`, pascalName, camelName);

    let controllerPath = `${__dirname}/../../../controllers/${camelName}Controller.ts`;
    let controller = getFileContent(`${__dirname}/controller.tmp`, pascalName, camelName);

    let initialDataPath = `${__dirname}/../../initialData/${camelName}s.ts`;
    let initialData = getFileContent(`${__dirname}/initialData.tmp`, pascalName, camelName);

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

function getFileContent(path, pascalName, camelName) {
    return fs.readFileSync(path, 'utf8').replace(new RegExp('{pascalName}', 'g'), pascalName).replace(new RegExp('{camelName}', 'g'), camelName);
}
