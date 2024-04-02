import test from 'ava';
import { randomUUID } from 'node:crypto';
import { SysDLogger } from '../src/sysdlogger.js';

const MESSAGE = 'a foo in tha bar for lol';
const TAG = `NODE_SYSTEMD_JOURNAL_${randomUUID()}`;
const ERROR_MESSAGE = '\'message\' parameter is mandatory and must be a string';
const ERROR_MESSAGE_LEVEL = 'not valid log level: \'foobar\', ' +
    'the valid levels are: [emerg, alert, crit, err, error, warning, ' +
    'warn, notice, info, debug]';

const syslogger = new SysDLogger({ tag: TAG });

test('should throws an error', async(t) => {
    await t.throwsAsync(async() => {
        await syslogger.write('`');
    }, { instanceOf: Error });
});

test.serial('should create an entry at systemd journal with a tag',
    async(t) => {
        await syslogger.write(MESSAGE);
        t.pass();
    });

test('should throw an error since there is no message', async(t) => {
    await t.throwsAsync(async() => {
        await syslogger.write(undefined);
    }, { instanceOf: Error, message: ERROR_MESSAGE });
});

test('should throw an error since message is empty', async(t) => {
    await t.throwsAsync(async() => {
        await syslogger.write('');
    }, { instanceOf: Error, message: ERROR_MESSAGE });
});

test('should throw an error since message consist of spaces', async(t) => {
    await t.throwsAsync(async() => {
        await syslogger.write(' ');
    }, { instanceOf: Error, message: ERROR_MESSAGE });
});

test('should throw an error since message is not a string', async(t) => {
    await t.throwsAsync(async() => {
        await syslogger.write({ foo: 'bar' });
    }, { instanceOf: Error, message: ERROR_MESSAGE });
});

test.serial('should retrieve a log by tag', async(t) => {
    const slog = await syslogger.read();
    t.true(slog.indexOf(MESSAGE) >= 0);
    t.true(typeof slog === 'string');
});

test.serial('should retrieve a log by tag in JSON format', async(t) => {
    const slogJSON = await syslogger.read({ json: true });
    t.true(slogJSON[0].SYSLOG_IDENTIFIER === TAG);
    t.true(slogJSON[0].MESSAGE === MESSAGE);
    t.true(typeof slogJSON === 'object');
});

test('syslogger read should throw an error', async(t) => {
    await t.throwsAsync(async() => {
        await syslogger.read({ tag: '`' });
    }, { instanceOf: Error });
});

test.serial('should retrieve two lines of log', async(t) => {
    for (let i = 0; i < 5; i++) {
        await syslogger.write(`${i}-foobar`);
    }
    const lines = await syslogger.read({ lines: 2 });
    const arrOfLines = lines.split('\n');
    arrOfLines.pop();
    t.true(arrOfLines.length === 2);
    t.true(arrOfLines[0].indexOf('3-foobar') >= 0);
    t.true(arrOfLines[1].indexOf('4-foobar') >= 0);
    t.true(typeof lines === 'string');
});

test.serial('should retrieve two lines of log on JSON format', async(t) => {
    const linesJSON = await syslogger.read({ json:true, lines: 2 });
    t.true(linesJSON.length === 2);
    t.true(linesJSON[0].MESSAGE === '3-foobar');
    t.true(linesJSON[1].MESSAGE === '4-foobar');
    t.true(typeof linesJSON === 'object');
});

test.serial('should retrieve two lines of log in reverse mode', async(t) => {
    const lines = await syslogger.read({ lines: 2, reverse: true });
    const arrOfLines = lines.split('\n');
    arrOfLines.pop();
    t.true(arrOfLines.length === 2);
    t.true(arrOfLines[0].indexOf('4-foobar') >= 0);
    t.true(arrOfLines[1].indexOf('3-foobar') >= 0);
    t.true(typeof lines === 'string');
});

test.serial('should retrieve two lines of log on JSON format and reverse mode',
    async(t) => {
        const linesJSON = await syslogger.read({
            json: true,
            lines: 2,
            reverse: true
        });
        t.true(linesJSON.length === 2);
        t.true(linesJSON[0].MESSAGE === '4-foobar');
        t.true(linesJSON[1].MESSAGE === '3-foobar');
        t.true(typeof linesJSON === 'object');
    });

test.serial('should use the defatult tag if is not provided ' +
    'when creating the instance',
async(t) => {
    const sjournal = new SysDLogger();
    const message = 'a logger entry without custom tag';
    await sjournal.write(message);
    const lines = await sjournal.read({ json: true, lines: 1 });
    t.true(lines.length === 1);
    t.true(lines[0].MESSAGE === message);
    t.true(lines[0].SYSLOG_IDENTIFIER === sjournal.constructor.name);
    t.true(typeof lines === 'object');
});

test.serial('should use the defatult tag if is empty ' +
    'when creating the instance',
async(t) => {
    const sjournal = new SysDLogger({ tag: '', json: true, lines: 1 });
    const message = 'a logger entry without custom tag';
    await sjournal.write(message);
    const lines = await sjournal.read();
    t.true(lines.length === 1);
    t.true(lines[0].MESSAGE === message);
    t.true(lines[0].SYSLOG_IDENTIFIER === sjournal.constructor.name);
    t.true(typeof lines === 'object');
});

test.serial('should use the defatult tag if consists on spaces when ' +
    'creating the instance',
async(t) => {
    const sjournal = new SysDLogger({ tag: '   ', json: true, lines: 1 });
    const message = 'a logger entry without custom tag';
    await sjournal.write(message);
    const lines = await sjournal.read();
    t.true(lines.length === 1);
    t.true(lines[0].MESSAGE === message);
    t.true(lines[0].SYSLOG_IDENTIFIER === sjournal.constructor.name);
    t.true(typeof lines === 'object');
});

test('should override the TAG', async(t) => {
    let slogJSON = await syslogger.read({ json: true });
    t.true(slogJSON[0].SYSLOG_IDENTIFIER === TAG);
    t.true(slogJSON[0].MESSAGE === MESSAGE);
    t.true(typeof slogJSON === 'object');
    const overrideTag = 'NODE_SYSTEMD_JOURNAL_OVERRIDE';
    const message = 'a ugly pigeon and a fluffy squirrel';
    await syslogger.write(message, { tag: overrideTag });
    slogJSON = await syslogger.read({
        tag: overrideTag,
        json: true,
        reverse: true,
        lines: 1,
    });
    t.true(slogJSON[0].SYSLOG_IDENTIFIER === overrideTag);
    t.true(slogJSON[0].MESSAGE === message);
    t.true(typeof slogJSON === 'object');
});

test.serial('should log with default level; notice (5)', async(t) => {
    const message = 'the default level is notice [5]';
    await syslogger.write(message);
    const slogJSON = await syslogger.read({
        json: true,
        reverse: true,
        lines: 1,
    });
    t.true(slogJSON[0].PRIORITY === '5');
    t.true(slogJSON[0].SYSLOG_IDENTIFIER === TAG);
    t.true(slogJSON[0].MESSAGE === message);
    t.true(typeof slogJSON === 'object');
});

test.serial('should log with custom level on new instance; warning (4)',
    async(t) => {
        const sjournal = new SysDLogger({
            json: true,
            lines: 1,
            level: 'warning'
        });
        const message = 'the level is warning [4]';
        await sjournal.write(message);
        const slogJSON = await sjournal.read({
            json: true,
            reverse: true,
            lines: 1,
        });
        t.true(slogJSON[0].PRIORITY === '4');
        t.true(slogJSON[0].SYSLOG_IDENTIFIER === sjournal.constructor.name);
        t.true(slogJSON[0].MESSAGE === message);
        t.true(typeof slogJSON === 'object');
    });

test.serial('should write log with custom level error (3)', async(t) => {
    const sjournal = new SysDLogger({ json: true, lines: 1, level: 'warning' });
    const message = 'the level is error [3]';
    await sjournal.write(message, { level: 'err' });
    const slogJSON = await sjournal.read({
        json: true,
        reverse: true,
        lines: 1,
    });
    t.true(slogJSON[0].PRIORITY === '3');
    t.true(slogJSON[0].SYSLOG_IDENTIFIER === sjournal.constructor.name);
    t.true(slogJSON[0].MESSAGE === message);
    t.true(typeof slogJSON === 'object');
});

test('should throw an error on new instance and wrong level', async(t) => {
    await t.throwsAsync(async() => {
        const foo = new SysDLogger({ level: 'foobar' });
        await foo.write('will not arrive here');
    }, { instanceOf: Error, message: ERROR_MESSAGE_LEVEL });
});

test('should throw an error writing with wrong level', async(t) => {
    await t.throwsAsync(async() => {
        const foo = new SysDLogger();
        await foo.write('will throw an exexption', { level: 'foobar' });
    }, { instanceOf: Error, message: ERROR_MESSAGE_LEVEL });
});

