import { Observable } from 'rxjs';

export interface IWebSocketsService {
    status: Observable<boolean>;
    on<T>(event: string): Observable<T>;
    send(event: string, data: any): void;
}

export interface WebSocketsConfig {
    url: string;
    reconnectInterval?: number;
    reconnectAttempts?: number;
}

export interface IWebSocketsMessage<T> {
    event: string;
    data: T;
}

export interface IJsonRpcError {
    code: number | string;
    message: string;
    data: string;
}

export interface IJsonRpcMessage<T> {
    jsonrpc: string;
    method: string;
    id: any;
    params?: {};
    result?: T;
    error?: IJsonRpcError;
}
