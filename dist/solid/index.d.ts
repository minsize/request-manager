import { Accessor } from 'solid-js';

type ManagerError = {
    network?: boolean;
    unknown?: boolean;
    custom?: any;
};

declare enum Status {
    START = "start",
    START_LOADER = "start_loader",
    END = "end",
    ERROR = "error",
    UNKNOWN = "unknown"
}

type end = (key: string, error?: ManagerError) => void;
declare const end: end;

/**
 * Start a query and set a timer for N milliseconds
 *
 * @example start("key", 200)
 */
type start = (key: string, time?: number) => void;
declare const start: start;

type requestManager = (key: string, { autoStart, time, }?: {
    autoStart?: boolean;
    time?: number;
}) => {
    start: (loaderStart?: number) => void;
    end: (error?: ManagerError) => void;
    get: () => {
        status: Status;
        error?: ManagerError;
    };
};
declare const requestManager: requestManager;

type OnResponse = (response: Response) => {
    status: Status;
    error?: ManagerError;
};
type OnResponseMax = (response: "maxRequests") => boolean;
declare const fetchManager: (key: string, input: string | URL | globalThis.Request, init: RequestInit | undefined, { onResponse, maxRequests, resetDuration, }: {
    onResponse: OnResponse & OnResponseMax;
    maxRequests: number;
    resetDuration: number;
}) => Promise<Response | "maxRequests">;

type globalRequestManager = (key: string) => [
    {
        status: Accessor<{
            status: Status;
            error?: ManagerError;
        }>;
        isDisabled: (block?: boolean) => boolean;
        isLoader: (loader?: boolean) => boolean;
    },
    set: (status: Status) => void
];
declare const globalRequestManager: globalRequestManager;

export { type ManagerError, Status, end, fetchManager, globalRequestManager, requestManager, start };
