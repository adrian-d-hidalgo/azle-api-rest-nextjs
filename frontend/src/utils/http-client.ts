import { ActorSubclass } from "@dfinity/agent";

import { parseBodyRequest, parseHeadersRequest } from '@app/utils/request-parsers';
import { parseBodyResponse, parseHeadersResponse } from '@app/utils/response-parsers';
import { ACTOR_SERVICE, QueryConfig, UpdateConfig, HttpResponse, GetConfig, PostConfig, PutConfig, DeleteData } from "@app/utils/http-types";

export class HttpClient {
    constructor(private actor: ActorSubclass<ACTOR_SERVICE>) { }

    public async query(url: string, config?: QueryConfig): Promise<HttpResponse> {
        const queryParams = config?.params ? `?${new URLSearchParams(config.params).toString()}` : "";
        const result = await this.actor.http_request({
            url: `${url}${queryParams}`,
            method: "GET",
            body: [],
            headers: config?.headers ? parseHeadersRequest(config.headers) : [],
            certificate_version: []
        });

        if (result.status_code > 400) {
            const error = {
                statusCode: result.status_code,
            }

            throw error;
        }

        const json = {
            headers: parseHeadersResponse(result.headers),
            body: parseBodyResponse(result.body),
            statusCode: result.status_code,
        }

        return json;
    }

    public async update(url: string, method: string, data?: any, config?: UpdateConfig): Promise<HttpResponse> {
        const queryParams = config?.params ? `?${new URLSearchParams(config.params).toString()}` : "";
        const result = await this.actor.http_request_update({
            url: `${url}${queryParams}`,
            method,
            body: data ? parseBodyRequest(data) : [],
            headers: config?.headers ? parseHeadersRequest(config.headers) : [],
            certificate_version: []
        });

        if (result.status_code > 400) {
            const error = {
                statusCode: result.status_code,
            }

            throw error;
        }

        const json = {
            headers: parseHeadersResponse(result.headers),
            body: parseBodyResponse(result.body),
            statusCode: result.status_code,
        }

        return json;
    }

    public async get(url: string, config?: GetConfig): Promise<HttpResponse> {
        return this.query(url, config);
    }

    public async post(url: string, data?: any, config?: PostConfig): Promise<HttpResponse> {
        return this.update(url, "POST", data, config);
    }

    public async put(url: string, data?: any, config?: PutConfig): Promise<HttpResponse> {
        return this.update(url, "PUT", data, config);
    }

    public async delete(url: string, data?: any, config?: DeleteData): Promise<HttpResponse> {
        return this.update(url, "DELETE", data, config);
    }
}
