import child_process from 'node:child_process';
import util from 'node:util';

import { toJSONArray, checkPlatform } from './util.js';

const exec = util.promisify(child_process.exec);

export class SysLogger {
    options = {
        tag: this.constructor.name,
        json: false,
        lines: 0,
        reverse: false,
    };

    constructor(opts) {
        checkPlatform();
        const options = opts || this.options;
        if (typeof options.tag === 'undefined' || !options.tag.trim().length) {
            options.tag = this.options.tag;
        }
        this.options = options;
    }

    #getJournalCommand(tag, json, lines, reverse) {
        const t = tag || this.options.tag;
        const numberOflines = lines || this.options.lines;

        let journalctlCommand = `journalctl -t ${t}`;
        if (json || this.options.json) {
            journalctlCommand = `${journalctlCommand} -o json`;
        }
        if (numberOflines) {
            journalctlCommand = `${journalctlCommand} -n ${numberOflines}`;
        }
        if (reverse || this.options.reverse) {
            journalctlCommand = `${journalctlCommand} -r`;
        }
        return journalctlCommand;
    }

    async write(message, { tag = undefined } = {}) {
        if (typeof message === 'undefined' ||
            typeof message !== 'string' || !message.trim().length) {
            throw new Error('\'message\' parameter is mandatory and ' +
                'must be a string');
        }
        let loggerCommand = `logger ${message}`;
        const t = tag || this.options.tag;
        loggerCommand = `${loggerCommand} --tag ${t}`;
        return await exec(loggerCommand);
    }

    async read({
        tag = undefined,
        json = false,
        lines = 0,
        reverse = false
    } = {}) {
        const command = this.#getJournalCommand(tag, json, lines, reverse);
        const { stdout } = await exec(command);
        if (json || this.options.json) {
            return toJSONArray(stdout);
        }
        return stdout;
    }
}
