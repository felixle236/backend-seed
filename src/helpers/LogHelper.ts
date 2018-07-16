import * as fs from 'fs';

class LogHelper {
    public static writeLog(message: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.appendFile('./logs.txt', `${(new Date()).toLocaleString()} : ${message}\n`, 'utf8', err => {
                if (err)
                    console.log('\x1b[31m', err, '\x1b[0m'); // eslint-disable-line
                resolve();
            });
        });
    }
}

Object.seal(LogHelper);
export default LogHelper;
