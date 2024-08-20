export declare class InMemoryBus<Events extends {
    [event: string]: any;
}> {
    private events;
    /**
     * Registers an event listener for the specified event.
     *
     * @template T - The type of event to listen for.
     * @param {T} event - The event to listen for.
     * @param {(data: Events[T]) => void} callback - The callback function to be executed when the event is triggered.
     * @returns {void}
     */
    on<T extends keyof Events>(event: T, callback: (data: Events[T]) => void): void;
    /**
     * Removes the specified callback function from the event listener for the given event.
     *
     * @template T - The type of event.
     * @param {T} event - The event to remove the callback from.
     * @param {(data: Events[T]) => void} callback - The callback function to remove.
     * @returns {void}
     */
    off<T extends keyof Events>(event: T, callback: (data: Events[T]) => void): void;
    /**
     * Removes all event listeners for the specified event.
     *
     * @template T - The type of the event.
     * @param {T} event - The event to remove all listeners for.
     * @returns {void}
     */
    offAll<T extends keyof Events>(event: T): void;
    /**
     * Emits an event with the specified data.
     *
     * @template T - The type of event.
     * @param {T} event - The event to emit.
     * @param {Events[T]} data - The data associated with the event.
     * @returns {void}
     */
    emit<T extends keyof Events>(event: T, data: Events[T]): void;
    /**
     * Registers a callback function to be executed only once when the specified event occurs.
     *
     * @template T - The type of the event.
     * @param {T} event - The event to listen for.
     * @param {(data: Events[T]) => void} callback - The callback function to be executed when the event occurs.
     * @returns {void}
     */
    once<T extends keyof Events>(event: T, callback: (data: Events[T]) => void): void;
    /**
     * Clears the events.
     *
     * @returns {void}
     */
    clear(): void;
    /**
     * Retrieves the listeners for a specific event.
     *
     * @template T - The event type.
     * @param {T} event - The event to retrieve listeners for.
     * @returns {Set<Function> | undefined} - The set of listeners for the event, or undefined if no listeners are found.
     */
    getListeners<T extends keyof Events>(event: T): Set<Function> | undefined;
    /**
     * Checks if the specified event has any listeners registered.
     *
     * @template T - The type of the event.
     * @param {T} event - The event to check for listeners.
     * @returns {boolean} - True if the event has listeners, false otherwise.
     */
    hasListeners<T extends keyof Events>(event: T): boolean;
    /**
     * Retrieves the events from the object.
     *
     * @returns An array containing the event names.
     */
    getEventNames(): string[];
}
