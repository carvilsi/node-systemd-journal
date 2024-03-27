import os from 'node:os';
import child_process from 'node:child_process';
import util from 'node:util';

import { toJSONArray } from './util.js';

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

export async function jjournal(tag, json = false) {
    checkPlatform();
    if (typeof tag === 'undefined' || !tag.trim().length) {
        throw new Error('\'tag\' parameter is mandatory');
    }
    let journalctlCommand = `journalctl -t ${tag}`;
    if (json) {
        journalctlCommand = `${journalctlCommand} -o json`;
    }
    const { stdout } = await exec(journalctlCommand);
    if (json) {
        return toJSONArray(stdout);
    }
    return stdout;
}

