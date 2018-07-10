import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    private _storage: Storage;

    constructor() {
        this._storage = localStorage;
    }

    public store = (key: string, value: any): void =>
        this._storage.setItem(key, JSON.stringify(value))

    public contains = (key: string): boolean =>
        !!this._storage.getItem(key)

    public retrieve = <T>(key: string): T =>
        JSON.parse(this._storage.getItem(key)) as T

    public remove = (key: string): void =>
        this._storage.removeItem(key)

    public clear = (): void =>
        this._storage.clear()

    public get length(): number {
        return this._storage.length;
    }
}
