export interface LogType {
    "error": string;
    "success": string;
}

export class Log {
    type: keyof LogType;
    message: string;

    constructor(type: keyof LogType, message: string) {
        this.type = type;
        this.message = message;
    }
}

export type addNotificationFunction = (type: keyof LogType, message: string) => void;
export type clearNotificationsFunction = (type: keyof LogType) => void;