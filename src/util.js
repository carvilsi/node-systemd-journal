import os from 'node:os';

const PLATFORM_SUPPORTED = [ 'linux' ];
const platform = os.platform();

export function checkPlatform() {
    if (!PLATFORM_SUPPORTED.includes(platform)) {
        throw new Error(`${platform} is not supported, ` +
            `you need a ${PLATFORM_SUPPORTED}`);
    }
}

// XXX: possible try to cast numbers....
export function toJSONArray(journalLogs) {
    const arr = journalLogs.split('\n');
    arr.pop();
    const jsonArray = JSON.parse(`[${arr.toString()}]`);
    return jsonArray;
}

