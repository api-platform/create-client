export interface Log {
    errors: Array<string>;
    successes: Array<string>;
}

export interface NewLog {
    type: keyof Log;
    message: string;
}