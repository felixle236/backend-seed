import * as fs from 'fs';

class LogHelper {
    static writeLog(message: string) {
        fs.appendFile('../../logs.txt', (new Date()).toLocaleString() + ' : ' + message + '\n', 'utf8', err => console.error(err));
    }
}

Object.seal(LogHelper);
export default LogHelper;
