/* eslint no-console: "off" */

import { Bench } from 'tinybench';
import { SysDLogger } from './../src/sysdlogger.js';
import { randomUUID } from 'node:crypto';

const bench = new Bench({ time: 100 });

const TAG = `NODE_SYSTEMD_JOURNAL_${randomUUID()}`;
const MESSAGE = 'a foo at the bar for lol';
const CUSTOM_TAG = 'foobar';
const syslogger = new SysDLogger({ tag: TAG });

(async() => {
    bench
        .add('add an entry to systemd-journal', async() => {
            await syslogger.write(MESSAGE);
        })
        .add('add an entry to systemd-journal with a custom tag', async() => {
            await syslogger.write(MESSAGE, { tag: CUSTOM_TAG });
        })
        .add('add an entry to systemd-journal with a custom level', async() => {
            await syslogger.write(MESSAGE, { level: 'info' });
        })
        .add('retrieve an entry from systemd-journal', async() => {
            await syslogger.read();
        })
        .add('retrieve an entry from systemd-journal by custom tag',
            async() => {
                await syslogger.read({ tag: CUSTOM_TAG });
            })
        .add('retrieve an entry from systemd-journal by tag in JSON format',
            async() => {
                await syslogger.read({ json: true });
            })
        .add('retrieve 2 lines from systemd-journal', async() => {
            await syslogger.read({ lines: 2 });
        })
        .add('retrieve lines in reverse mode from systemd-journal', async() => {
            await syslogger.read({ reverse: true });
        })
        .add('retrieve entries by level from systemd-journal', async() => {
            await syslogger.read({ level: 'info' });
        })
        .add('retrieve 2 entries from systemd-journal by tag in JSON format' +
            ' and reverse mode', async() => {
            await syslogger.read({ json: true, lines: 2, reverse: true });
        })
        .add('retrieve 2 entries from systemd-journal by tag in JSON format' +
            ' and reverse mode and level info', async() => {
            await syslogger.read({
                json: true,
                lines: 2,
                reverse: true,
                level: 'info'
            });
        })
        .add('add an entry to systemd-journal with debug level', async() => {
            await syslogger.debug(MESSAGE);
        })
        .add('add an entry to systemd-journal with info level', async() => {
            await syslogger.info(MESSAGE);
        })
        .add('add an entry to systemd-journal with notice level', async() => {
            await syslogger.notice(MESSAGE);
        })
        .add('add an entry to systemd-journal with warning level', async() => {
            await syslogger.warn(MESSAGE);
        })
        .add('add an entry to systemd-journal with error level', async() => {
            await syslogger.error(MESSAGE);
        })
        .add('add an entry to systemd-journal with critical level', async() => {
            await syslogger.crit(MESSAGE);
        })
        .add('add an entry to systemd-journal with alert level', async() => {
            await syslogger.alert(MESSAGE);
        })
        .add('add an entry to systemd-journal with emergency level',
            async() => {
                await syslogger.emerg(MESSAGE);
            });

    await bench.warmup();
    await bench.run();

    console.table(bench.table());
})();

