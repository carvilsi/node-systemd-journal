import os from 'node:os';
import child_process from 'node:child_process';
import util from 'node:util';

const exec = util.promisify(child_process.exec);

const PLATFORM_SUPPORTED = [ 'linux' ];
const platform = os.platform();

export async function jlogger(message, tag) {
    if (!PLATFORM_SUPPORTED.includes(platform)) {
        throw new Error(`${platform} is not supported, ` +
            `you need a ${PLATFORM_SUPPORTED}`);
    }
    if (typeof message === 'undefined' || !message.trim().length) {
        throw new Error('\'message\' parameter is mandatory');
    }
    let loggerCommand = `logger ${message}`;
    if (typeof tag !== 'undefined') {
        loggerCommand = `${loggerCommand} --tag ${tag} `;
    }
    await exec(loggerCommand);
}
