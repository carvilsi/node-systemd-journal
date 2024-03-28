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

```javascrip
const options = {
    // string; the choosen tag, if not provided the default will be 'SysDLogger'
    tag: 'SysDLogger', 
    // boolean; true will retrieve a JSON object with the log contenc
    json: false,
    // number of lines to retrieve from journal
    lines: 0,
    // if true will retrieve first latest entries
    reverse: false,
}
```  

With reading options you can do things like:

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
    });
    assert(slogJSON[0].SYSLOG_IDENTIFIER === myTag);
    assert(slogJSON[0].MESSAGE === message);
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

