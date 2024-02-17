export type QueryConfig = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export type UpdateConfig = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export type GetConfig = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export type PostConfig = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export type PutConfig = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export type DeleteData = {
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export type HttpResponse = {
    headers: Record<string, string>;
    body?: any;
    statusCode: number;
}

export type ACTOR_SERVICE = {
    http_request: any,
    http_request_update: any
}
