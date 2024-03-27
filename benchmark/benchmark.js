/* eslint no-console: "off" */

import { Bench } from 'tinybench';
import { jjournal, jlogger } from './../src/index.js';
import { randomUUID } from 'node:crypto';

const bench = new Bench({ time: 100 });

const TAG = `NODE_SYSTEMD_JOURNAL_${randomUUID()}`;
const MESSAGE = 'a foo at the bar for lol';

(async() => {
    bench
        .add('add an entry to systemd-journal', () => {
            jlogger(MESSAGE);
        })
        .add('add an entry to systemd-journal with a tag', () => {
            jlogger(MESSAGE, TAG);
        })
        .add('retrieve an entry from systemd-journal by tag', () => {
            jjournal(TAG);
        })
        .add('retrieve an entry from systemd-journal by tag in JSON format',
            () => {
                jjournal(TAG, { json: true });
            })
        .add('retrieve 2 lines from systemd-journal', () => {
            jjournal(TAG, { lines: 2 });
        })
        .add('retrieve lines in reverse mode from systemd-journal', () => {
            jjournal(TAG, { reverse: true });
        })
        .add('retrieve 2 entries from systemd-journal by tag in JSON format' +
            ' and reverse mode', () => {
            jjournal(TAG, { json: true, lines: 2, reverse: true });
        });

    await bench.warmup();
    await bench.run();

    console.table(bench.table());
})();

