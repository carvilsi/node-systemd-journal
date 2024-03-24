import os from 'node:os';
import child_process from 'node:child_process';
import util from 'node:util';

const exec = util.promisify(child_process.exec);

const PLATFORM_SUPPORTED = [ 'linux' ];
const platform = os.platform();

function checkPlatform() {
    if (!PLATFORM_SUPPORTED.includes(platform)) {
        throw new Error(`${platform} is not supported, ` +
            `you need a ${PLATFORM_SUPPORTED}`);
    }
}

export async function jlogger(message, tag) {
    checkPlatform();    
    if (typeof message === 'undefined' || !message.trim().length) {
        throw new Error('\'message\' parameter is mandatory');
    }
    let loggerCommand = `logger ${message}`;
    if (typeof tag !== 'undefined') {
        loggerCommand = `${loggerCommand} --tag ${tag}`;
    }
    return await exec(loggerCommand);
}

/* eslint no-console: "off" */
export async function jjournal(tag) {
    checkPlatform();
    if (typeof tag === 'undefined' || !tag.trim().length) {
        throw new Error('\'tag\' parameter is mandatory');
    }
    const journalctlCommand = `journalctl -t ${tag}`;
    const { stdout, stderr } = await exec(journalctlCommand);
    console.log(typeof stdout);
    console.log(typeof stderr);
    return stdout;
}

