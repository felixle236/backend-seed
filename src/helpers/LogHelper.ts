import * as fs from 'fs';

export default class LogHelper {
    static writeLog(message: string) {
        fs.appendFile('../../logs.txt', (new Date()).toLocaleString() + ' : ' + message + '\n', 'utf8', err => console.error(err));
    }
}
