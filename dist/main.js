var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class InMemoryBus {
    constructor() {
        this.events = new Map();
    }
    /**
     * Registers an event listener for the specified event.
     *
     * @template T - The type of event to listen for.
     * @param {T} event - The event to listen for.
     * @param {(data: Events[T]) => void} callback - The callback function to be executed when the event is triggered.
     * @returns {void}
     */
    on(event, callback) {
        var _a;
        let listeners = (_a = this.events.get(event)) !== null && _a !== void 0 ? _a : new Set();
        listeners.add(callback);
        this.events.set(event, listeners);
    }
    /**
     * Removes the specified callback function from the event listener for the given event.
     *
     * @template T - The type of event.
     * @param {T} event - The event to remove the callback from.
     * @param {(data: Events[T]) => void} callback - The callback function to remove.
     * @returns {void}
     */
    off(event, callback) {
        var _a;
        if (!this.events.has(event)) {
            return;
        }
        (_a = this.events.get(event)) === null || _a === void 0 ? void 0 : _a.delete(callback);
    }
    /**
     * Removes all event listeners for the specified event.
     *
     * @template T - The type of the event.
     * @param {T} event - The event to remove all listeners for.
     * @returns {void}
     */
    offAll(event) {
        this.events.delete(event);
    }
    /**
     * Emits an event with the specified data.
     *
     * @template T - The type of event.
     * @param {T} event - The event to emit.
     * @param {Events[T]} data - The data associated with the event.
     * @returns {void}
     */
    emit(event, data) {
        var _a;
        if (!this.events.has(event)) {
            return;
        }
        (_a = this.events.get(event)) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener(data));
    }
    /**
     * Emits an event with the specified data and waits for all listeners to complete.
     *
     * @template T - The type of event.
     * @param {T} event - The event to emit.
     * @param {Events[T]} data - The data associated with the event.
     * @returns {Promise<void>} - A promise that resolves when all listeners have completed.
     */
    emitAwaitAll(event, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.events.has(event)) {
                return;
            }
            yield Promise.all([...this.events.get(event).values()].map((listener) => listener(data)));
        });
    }
    /**
     * Emits an event with the specified data and waits for each listener to complete in sequence.
     *
     * @template T - The type of event.
     * @param {T} event - The event to emit.
     * @param {Events[T]} data - The data associated with the event.
     * @returns {Promise<void>} - A promise that resolves when all listeners have completed in sequence.
     */
    emitAwaitSerial(event, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.events.has(event)) {
                return;
            }
            for (const listener of this.events.get(event).values()) {
                yield listener(data);
            }
        });
    }
    /**
     * Registers a callback function to be executed only once when the specified event occurs.
     *
     * @template T - The type of the event.
     * @param {T} event - The event to listen for.
     * @param {(data: Events[T]) => void} callback - The callback function to be executed when the event occurs.
     * @returns {void}
     */
    once(event, callback) {
        const onceCallback = (data) => {
            callback(data);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }
    /**
     * Clears the events.
     *
     * @returns {void}
     */
    clear() {
        this.events.clear();
    }
    /**
     * Retrieves the listeners for a specific event.
     *
     * @template T - The event type.
     * @param {T} event - The event to retrieve listeners for.
     * @returns {Set<Function> | undefined} - The set of listeners for the event, or undefined if no listeners are found.
     */
    getListeners(event) {
        return this.events.get(event);
    }
    /**
     * Checks if the specified event has any listeners registered.
     *
     * @template T - The type of the event.
     * @param {T} event - The event to check for listeners.
     * @returns {boolean} - True if the event has listeners, false otherwise.
     */
    hasListeners(event) {
        return this.events.has(event);
    }
    /**
     * Retrieves the events from the object.
     *
     * @returns An array containing the event names.
     */
    getEventNames() {
        return [...this.events.keys()];
    }
}
