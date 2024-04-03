<div align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/carvilsi/node-systemd-journal/tests.yml?logo=github&label=tests" alt="test">
  <p></p>
</div>

# node-systemd-journal

Interact with linux systemd journal, adding entries and retrieving logs from NodeJS.

**Only works on Linux**

## Usage

`$ npm install --save sysdlogger`

The in your code:

```javascript
import { SysDLogger } from 'sysdlogger';

// instatiate with a tag
const syslogger = new SysDLogger({ tag: 'FOOBAR' });

(async() => {
    // writes with the provided tag
    await syslogger.write('This is a foobar entry for journal');
    // reads from journal by tag
    const res = await syslogger.read();
    console.log(res);
})();
```
You can check the added entry to journal like:

`$ journalctl -t FOOBAR`

**Options**
This could be provided when instantiate or override when calling *write* or *read*.

```javascript
const options = {
    // string; the choosen tag, if not provided the default will be 'SysDLogger'
    tag: 'SysDLogger', 
    // boolean; true will retrieve a JSON object with the log contenc
    json: false,
    // number of lines to retrieve from journal
    lines: 0,
    // if true will retrieve first latest entries
    reverse: false,
    // string; the choosen level or priority for logging, default: notice
    level: undefined, 
}
```  

With options for writing and reading you can do things like:

```javascript
import { SysDLogger } from 'sysdlogger';
import assert from 'node:assert';

(async() => {
    const myTag = 'NODE_SYSTEMD_JOURNAL';
    const message = 'an ugly pigeon and a fluffy squirrel';
    await syslogger.write(message, { tag: myTag });
    const slogJSON = await syslogger.read({
            tag: myTag,
            json: true,
            reverse: true,
            lines: 1,
            level: 'warn',
    });
    assert(slogJSON[0].SYSLOG_IDENTIFIER === myTag);
    assert(slogJSON[0].MESSAGE === message);
    assert(slogJSON[0].PRIORITY === 4);
    assert(typeof slogJSON === 'object');
})();
```     
The properties of the JSON object from journal are:

```javascript
[
  '_TRANSPORT',
  '_SYSTEMD_CGROUP',
  '_UID',
  '_SYSTEMD_USER_SLICE',
  'PRIORITY',
  '_AUDIT_LOGINUID',
  'SYSLOG_IDENTIFIER',
  '__MONOTONIC_TIMESTAMP',
  '_SYSTEMD_SLICE',
  '_SYSTEMD_UNIT',
  'SYSLOG_FACILITY',
  '_CAP_EFFECTIVE',
  '_SOURCE_REALTIME_TIMESTAMP',
  '_RUNTIME_SCOPE',
  '_MACHINE_ID',
  '__SEQNUM_ID',
  '_SYSTEMD_INVOCATION_ID',
  '_HOSTNAME',
  '__CURSOR',
  '_GID',
  '_SYSTEMD_OWNER_UID',
  '__REALTIME_TIMESTAMP',
  '_BOOT_ID',
  'MESSAGE',
  'SYSLOG_TIMESTAMP',
  '_AUDIT_SESSION',
  '_PID',
  '_SYSTEMD_USER_UNIT',
  '__SEQNUM',
  '_COMM'
]
```

The list of **levels** and the equivalent of *PRIORITY* JSON field:

```javascript
[ 
    emerg: 0,
    alert: 1,
    crit: 2,
    err: 3,
    error: 3,
    warning: 4,
    warn: 4,
    notice: 5,
    info: 6,
    debug: 7
]
```

Also possible to use an alias to write a log message with a level like this:

```javascript
const MESSAGE = 'a pigeon over the roof';

//add an entry to systemd-journal with debug level
await syslogger.debug(MESSAGE);

//add an entry to systemd-journal with info level
await syslogger.info(MESSAGE);

//add an entry to systemd-journal with notice level
await syslogger.notice(MESSAGE);

//add an entry to systemd-journal with warning level
await syslogger.warn(MESSAGE);

//add an entry to systemd-journal with error level
await syslogger.error(MESSAGE);

//add an entry to systemd-journal with critical level
await syslogger.crit(MESSAGE);

//add an entry to systemd-journal with alert level
await syslogger.alert(MESSAGE);

//add an entry to systemd-journal with emergency level
await syslogger.emerg(MESSAGE);
```

More info about [Journal JSON format](https://systemd.io/JOURNAL_EXPORT_FORMATS#journal-json-format)

More info also:

`$ man journalctl`

`$ man logger`

---

Feedback from usage and contributions are very welcome.
Also if you like it, please leave a :star: I would appreciate it ;)
