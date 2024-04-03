import os from 'node:os';

const PLATFORM_SUPPORTED = [ 'linux' ];
const platform = os.platform();

export function checkPlatform() {
    if (!PLATFORM_SUPPORTED.includes(platform)) {
        throw new Error(`${platform} is not supported, ` +
            `you need a ${PLATFORM_SUPPORTED}`);
    }
}

function casting(logsJSON) {
    const castLogsJSON = logsJSON.map((logJSON) => {
        for (const key in logJSON) {
            const number = Number(logJSON[key]);
            logJSON[key] = isNaN(number) ? logJSON[key] : number;
        }
        return logJSON;
    });
    return castLogsJSON;
}

export function toJSONArray(journalLogs) {
    const arr = journalLogs.split('\n');
    arr.pop();
    const logsJSON = JSON.parse(`[${arr.toString()}]`);
    const castLogsJSON = casting(logsJSON);
    return castLogsJSON;
}

