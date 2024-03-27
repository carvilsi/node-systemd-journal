import test from 'ava';
import { randomUUID } from 'node:crypto';
import { jlogger, jjournal } from '../src/index.js';

const MESSAGE = 'a foo in tha bar for lol';
const TAG = `NODE_SYSTEMD_JOURNAL_${randomUUID()}`;

test('should create an entry at systemd journal', async(t) => {
    await jlogger('an entry at systemd journal without tag');
    t.pass();
});

test('should throws an error', async(t) => {
    await t.throwsAsync(async() => {
        await jlogger('`');
    }, { instanceOf: Error });
});

test.serial('should create an entry at systemd journal with a tag', async(t) => {
    await jlogger(MESSAGE, TAG);
    t.pass();
});

test('should throw an error since there is no message', async(t) => {
    await t.throwsAsync(async() => {
        await jlogger(undefined);
    }, { instanceOf: Error, message: '\'message\' parameter is mandatory' });
});

test('should throw an error since message is empty', async(t) => {
    await t.throwsAsync(async() => {
        await jlogger('');
    }, { instanceOf: Error, message: '\'message\' parameter is mandatory' });
});

test('should throw an error since message consist of spaces', async(t) => {
    await t.throwsAsync(async() => {
        await jlogger(' ');
    }, { instanceOf: Error, message: '\'message\' parameter is mandatory' });
});

test.serial('should retrieve a log by tag', async(t) => {
    const slog = await jjournal(TAG);
    t.true(slog.indexOf(MESSAGE) >= 0);
    t.true(typeof slog === 'string');
});

test.serial('should retrieve a log by tag in JSON format', async(t) => {
    const slogJSON = await jjournal(TAG, true);
    t.true(slogJSON[0].SYSLOG_IDENTIFIER === TAG);
    t.true(slogJSON[0].MESSAGE === MESSAGE);
    t.true(typeof slogJSON === 'object');
});

test('jjournal should throw an error', async(t) => {
    await t.throwsAsync(async() => {
        await jjournal('`');
    }, { instanceOf: Error });
});

test('should not retrieve a log since tag does not exists', async(t) => {
    await t.throwsAsync(async() => {
        await jjournal(undefined);
    }, { instanceOf: Error, message: '\'tag\' parameter is mandatory' });
});

test('should not retrieve a log since tag is empty', async(t) => {
    await t.throwsAsync(async() => {
        await jjournal('');
    }, { instanceOf: Error, message: '\'tag\' parameter is mandatory' });
});

test('should not retrieve a log since tag consists of spaces', async(t) => {
    await t.throwsAsync(async() => {
        await jjournal(' ');
    }, { instanceOf: Error, message: '\'tag\' parameter is mandatory' });
});

