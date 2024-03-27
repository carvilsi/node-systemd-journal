import { Bench } from 'tinybench';
import { jjournal, jlogger } from './../src/index.js';
import { randomUUID } from 'node:crypto';

const bench = new Bench({ time: 100 });

const TAG = `NODE_SYSTEMD_JOURNAL_${randomUUID()}`;
const MESSAGE = 'a foo at the bar for lol';

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
  .add('retrieve an entry from systemd-journal by tag in JSON format', () => {
      jjournal(TAG, true);
  });

await bench.warmup(); 
await bench.run();

console.table(bench.table());

