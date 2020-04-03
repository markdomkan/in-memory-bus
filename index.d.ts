export = JsEvents;
declare class JsEvents {
    constructor(obj?: Object);
    on(event: string, fn: (data: any) => void): this;
    emit(event: string, data: any): this;
    delete(event: string): this;
    emitters(): string[];
    listeners(event: string): (data: any) => void;
    hasListeners(event: string): boolean;
}