import child_process from 'node:child_process';
import util from 'node:util';

import { toJSONArray, checkPlatform } from './util.js';

const exec = util.promisify(child_process.exec);

export class SysDLogger {
    options = {
        tag: this.constructor.name,
        json: false,
        lines: 0,
        reverse: false,
        level: undefined,
    };

    #syslogLevels = {
        emerg: 0,
        alert: 1,
        crit: 2,
        err: 3,
        error: 3,
        warning: 4,
        warn: 4,
        notice: 5,
        info: 6,
        debug: 7,
    };

    #checkLevels(priority) {
        if (typeof this.#syslogLevels[priority] === 'undefined') {
            throw new Error(`not valid log level: '${priority}', ` +
                    'the valid levels are: ' +
                    `[${Object.keys(this.#syslogLevels).join(', ')}]`);
        }
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

    #getLoggerCommand(message, tag, level) {
        let loggerCommand = `logger ${message}`;
        const t = tag || this.options.tag;
        loggerCommand = `${loggerCommand} --tag ${t}`;
        const priority = level || this.options.level;
        if (typeof priority !== 'undefined') {
            this.#checkLevels(priority);
            loggerCommand = `${loggerCommand} ` +
                `-p ${this.#syslogLevels[priority]}`;
        }
        return loggerCommand;
    }

    constructor(opts) {
        checkPlatform();
        const options = opts || this.options;
        if (typeof options.tag === 'undefined' || !options.tag.trim().length) {
            options.tag = this.options.tag;
        }
        if (typeof options.level !== 'undefined') {
            this.#checkLevels(options.level);
        }
        this.options = options;
    }

    async write(message, {
        tag = undefined,
        level = undefined,
    } = {}) {
        if (typeof message === 'undefined' ||
            typeof message !== 'string' || !message.trim().length) {
            throw new Error('\'message\' parameter is mandatory and ' +
                'must be a string');
        }
        const command = this.#getLoggerCommand(message, tag, level);
        return await exec(command);
    }

    async read({
        tag = undefined,
        json = false,
        lines = 0,
        reverse = false,
        level = undefined,
    } = {}) {
        const command = this.#getJournalCommand(
            tag,
            json,
            lines,
            reverse,
            level
        );
        const { stdout } = await exec(command);
        if (json || this.options.json) {
            return toJSONArray(stdout);
        }
        return stdout;
    }
}
