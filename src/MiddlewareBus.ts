import { InMemoryBus } from "./InMemoryBus";

type Middleware = (payload: any) => boolean | Promise<boolean>;

type EventsMiddlewares = {
    [event: string]: Middleware[];
};

type ExtractPayload<T> = T extends Array<infer U>
    ? U extends (payload: infer Payload) => any
    ? Payload
    : never
    : never;

type Events<EventsMiddleware extends EventsMiddlewares> = {
    [Event in keyof EventsMiddleware]: ExtractPayload<EventsMiddleware[Event]>;
};

export class MiddlewareBus<Middlewares extends EventsMiddlewares> {

    private bus = new InMemoryBus<Events<Middlewares>>();

    private eventQueue: Map<keyof Events<Middlewares>, Events<Middlewares>[keyof Events<Middlewares>][]> = new Map();

    constructor(private eventMiddlewares: Middlewares) { }

    /**
     * Registers an event handler for the specified event.
     * @param event The event to listen for.
     * @param handler The handler to call when the event is emitted.
     */
    public on<Event extends keyof Events<Middlewares>>(event: Event, handler: (payload: Events<Middlewares>[Event]) => void) {
        this.bus.on(event, handler);
    }

    /**
     * Removes a specific event handler for the specified event.
     * @param event The event to remove the handler from.
     * @param handler The handler to remove.
     * @param clearQueue Whether to clear the event queue for this event.
     */
    public off<Event extends keyof Events<Middlewares>>(event: Event, handler: (payload: Events<Middlewares>[Event]) => void, clearQueue: false) {
        if (clearQueue) {
            this.eventQueue.delete(event);
        }
        if (this.eventQueue.has(event)) {
            throw new Error("Cannot remove handler while event is in queue");
        }
        this.bus.off(event, handler);
    }

    /**
     * Removes all event handlers for the specified event.
     * @param event The event to remove all handlers from.
     * @param clearQueue Whether to clear the event queue for this event.
     */
    public offAll<Event extends keyof Events<Middlewares>>(event: Event, clearQueue: false) {
        if (clearQueue) {
            this.eventQueue.delete(event);
        }
        if (this.eventQueue.has(event)) {
            throw new Error("Cannot remove handler while event is in queue");
        }
        this.bus.offAll(event);
    }

    /**
     * Emits an event with the specified payload, passing it through the middleware.
     * If any middleware returns false, the event is queued.
     * @param event The event to emit.
     * @param payload The payload to pass to the event handlers.
     */
    public async emit<Event extends keyof Events<Middlewares>>(event: Event, payload: Events<Middlewares>[Event]) {
        if (!this.eventMiddlewares[event]) {
            this.bus.emit(event, payload);
            return;
        }
        const middlewareResults = await Promise.all(this.eventMiddlewares[event].map(middleware => middleware(payload)));
        if (middlewareResults.every(result => result)) {
            this.bus.emit(event, payload);
        } else {
            this.eventQueue.set(event, [...(this.eventQueue.get(event) || []), payload]);
        }
    }

    /**
     * Re-evaluates the queued events for the specified event.
     * @param eventName The event to re-evaluate.
     */
    public async reEval(eventName: keyof Middlewares) {
        const eventQueue = this.eventQueue.get(eventName);
        if (!eventQueue) {
            return;
        }
        for (let payload of eventQueue) {
            await this.emit(eventName, payload);
        }
        this.eventQueue.delete(eventName);
    }

    /**
     * Clears queued events for the specified event.
     */
    public clearQueue(eventName: keyof Middlewares) {
        this.eventQueue.delete(eventName);
    }
}