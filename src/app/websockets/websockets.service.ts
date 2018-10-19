import { Injectable, OnDestroy, Inject } from '@angular/core';
import { Observable, SubscriptionLike, Subject, Observer, interval } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/websocket';

import { share, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { IWebSocketsService, IWebSocketsMessage, WebSocketsConfig } from './websockets.interfaces';
import { config } from './websockets.config';


@Injectable({
    providedIn: 'root'
})
export class WebSocketsService implements IWebSocketsService, OnDestroy {
    private config: WebSocketSubjectConfig<IWebSocketsMessage<any>>;

    private websocketSub: SubscriptionLike;
    private statusSub: SubscriptionLike;

    private reconnection$: Observable<number>;
    private websocket$: WebSocketSubject<IWebSocketsMessage<any>>;
    private connection$: Observer<boolean>;
    private wsMessages$: Subject<IWebSocketsMessage<any>>;

    private reconnectInterval: number;
    private reconnectAttempts: number;
    private isConnected: boolean;

    public status: Observable<boolean>;

    constructor(@Inject(config) private wsConfig: WebSocketsConfig) {
        this.wsMessages$ = new Subject<IWebSocketsMessage<any>>();

        this.reconnectInterval = wsConfig.reconnectInterval || 5000; // pause between connections
        this.reconnectAttempts = wsConfig.reconnectAttempts || 10; // connection attempts count

        this.config = {
            url: this.wsConfig.url,
            closeObserver: {
                next: (event: CloseEvent) => {
                    this.websocket$ = null;
                    this.connection$.next(false);
                }
            },
            openObserver: {
                next: (event: Event) => this.connection$.next(true)
            }
        };

        // connection status
        this.status = new Observable<boolean>((observer) => {
            this.connection$ = observer;
        }).pipe(share(), distinctUntilChanged());

        // if not connected run reconnect
        this.statusSub = this.status
            .subscribe((isConnected) => {
                this.isConnected = isConnected;

                if (!this.reconnection$ && typeof (isConnected) === 'boolean' && !isConnected) {
                    this.reconnect();
                }
            });

        this.websocketSub = this.wsMessages$.subscribe(
            null, (error: ErrorEvent) => console.error('WebSocket error!', error)
        );

        this.connect();
    }

    ngOnDestroy() {
        this.websocketSub.unsubscribe();
        this.statusSub.unsubscribe();
    }

    /** Connect to WebSocket */
    private connect(): void {
        this.websocket$ = new WebSocketSubject(this.config);

        this.websocket$.subscribe(
            (message) => this.wsMessages$.next(message),
            (error: Event) => {
                if (!this.websocket$) {
                    // run reconnect if errors
                    this.reconnect();
                }
            });
    }

    /** Reconnect if not connecting or errors */
    private reconnect(): void {
        this.reconnection$ = interval(this.reconnectInterval)
            .pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.websocket$));

        this.reconnection$.subscribe(
            () => this.connect(),
            null,
            () => {
                // Subject complete if reconnect attempts count ending
                this.reconnection$ = null;

                if (!this.websocket$) {
                    this.wsMessages$.complete();
                    this.connection$.complete();
                }
            });
    }

    /** On message event */
    public on<T>(event: string): Observable<T> {
        if (event) {
            return this.wsMessages$.pipe(
                filter((message: IWebSocketsMessage<T>) => message.event === event),
                map((message: IWebSocketsMessage<T>) => message.data)
            );
        }
    }

    /** Send message to server */
    public send(event: string, data: any = {}): void {
        if (event && this.isConnected) {
            this.websocket$.next({ event, data } as IWebSocketsMessage<any>);
        } else {
            console.error('Send error!');
        }
    }
}
