import * as fs from 'fs';

class LogHelper {
    static writeLog(message: string) {
        fs.appendFile('./logs.txt', (new Date()).toLocaleString() + ' : ' + message + '\n', 'utf8', err => err && console.log('\x1b[31m', err, '\x1b[0m'));
    }
}

Object.seal(LogHelper);
export default LogHelper;
