import { Bench } from 'tinybench';
import { jjournal, jlogger } from './../src/index.js';

const bench = new Bench({ time: 100 });

const TAG = 'NODE_SYSTEMD_JOURNAL';
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
  ;

await bench.warmup(); 
await bench.run();

console.table(bench.table());

