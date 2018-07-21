import * as path from 'path';
import * as fs from 'fs';

export default class FileHelper {
    static getDirectories = function(sourcePath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(sourcePath, (err, list) => {
                if (err)
                    reject(err);
                else
                    resolve(list.filter(item => fs.statSync(path.join(sourcePath, item)).isDirectory()));
            });
        });
    }

    static getFiles = function(sourcePath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(sourcePath, (err, list) => {
                if (err)
                    reject(err);
                else
                    resolve(list.filter(item => !fs.statSync(path.join(sourcePath, item)).isDirectory()));
            });
        });
    }

    static getImportFiles = function(directory: string): any {
        let files = fs.readdirSync(directory).filter(item => ['.ts', '.js'].includes(path.extname(item)) && !fs.statSync(path.join(directory, item)).isDirectory());
        return files.map(file => {
            let fileImport = require(path.join(directory, file));
            return fileImport.default || fileImport;
        });
    }
}
