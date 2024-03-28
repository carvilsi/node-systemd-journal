/* eslint no-console: "off" */

import { Bench } from 'tinybench';
import { SysLogger } from './../src/index.js';
import { randomUUID } from 'node:crypto';

const bench = new Bench({ time: 100 });

const TAG = `NODE_SYSTEMD_JOURNAL_${randomUUID()}`;
const MESSAGE = 'a foo at the bar for lol';
const CUSTOM_TAG = 'foobar';
const syslogger = new SysLogger({ tag: TAG });

(async() => {
    bench
        .add('add an entry to systemd-journal', () => {
            syslogger.write(MESSAGE);
        })
        .add('add an entry to systemd-journal with a custom tag', () => {
            syslogger.write(MESSAGE, { tag: CUSTOM_TAG });
        })
        .add('retrieve an entry from systemd-journal', () => {
            syslogger.read();
        })
        .add('retrieve an entry from systemd-journal by custom tag', () => {
            syslogger.read({ tag: CUSTOM_TAG });
        })
        .add('retrieve an entry from systemd-journal by tag in JSON format',
            () => {
                syslogger.read({ json: true });
            })
        .add('retrieve 2 lines from systemd-journal', () => {
            syslogger.read({ lines: 2 });
        })
        .add('retrieve lines in reverse mode from systemd-journal', () => {
            syslogger.read({ reverse: true });
        })
        .add('retrieve 2 entries from systemd-journal by tag in JSON format' +
            ' and reverse mode', () => {
            syslogger.read({ json: true, lines: 2, reverse: true });
        });

    await bench.warmup();
    await bench.run();

    console.table(bench.table());
})();

