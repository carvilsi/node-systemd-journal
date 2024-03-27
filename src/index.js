import child_process from 'node:child_process';
import util from 'node:util';

import { toJSONArray, checkPlatform } from './util.js';

const exec = util.promisify(child_process.exec);

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

export async function jjournal(tag, {
    json = false,
    lines = 0,
    reverse = false
} = {}) {
    checkPlatform();
    if (typeof tag === 'undefined' || !tag.trim().length) {
        throw new Error('\'tag\' parameter is mandatory');
    }
    let journalctlCommand = `journalctl -t ${tag}`;
    if (json) {
        journalctlCommand = `${journalctlCommand} -o json`;
    }
    if (lines) {
        journalctlCommand = `${journalctlCommand} -n ${lines}`;
    }
    if (reverse) {
        journalctlCommand = `${journalctlCommand} -r`;
    }
    const { stdout } = await exec(journalctlCommand);
    if (json) {
        return toJSONArray(stdout);
    }
    return stdout;
}

