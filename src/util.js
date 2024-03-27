export function toJSONArray(journalLogs) {
    const arr = journalLogs.split('\n');
    arr.pop();
    const jsonArray = JSON.parse(`[${arr.toString()}]`);
    return jsonArray;
}
