import { Log, NewLog } from "../types/Logs";

function createLog(type: keyof Log, message: string): NewLog {
    return {
        type,
        message
    }
}

export function createSuccessLog(message: string): NewLog {
    return createLog("successes", message);
}

export function createErrorLog(message: string): NewLog {
    return createLog("errors", message);
}