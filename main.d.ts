export default class JsEvents {
    private events;
    /**
     * Registers a callback function to be executed when the specified event occurs.
     *
     * @param event - The name of the event to listen for.
     * @param callback - The callback function to be executed when the event occurs.
     */
    on(event: string, callback: Function): void;
    /**
     * Removes a callback function from the event listeners for a specific event.
     *
     * @param event - The name of the event.
     * @param callback - The callback function to be removed.
     */
    off(event: string, callback: Function): void;
    /**
     * Removes all event listeners for the specified event.
     *
     * @param {string} event - The event to remove listeners for.
     */
    offAll(event: string): void;
    /**
     * Emits an event and invokes all registered listeners.
     *
     * @param event - The name of the event to emit.
     * @param args - The arguments to pass to the event listeners.
     */
    emit(event: string, ...args: any[]): void;
    /**
     * Registers a callback function to be executed once for the specified event.
     *
     * @param event - The name of the event.
     * @param callback - The callback function to be executed.
     */
    once(event: string, callback: Function): void;
    /**
     * Clears the events.
     */
    clear(): void;
    /**
     * Retrieves the listeners for the specified event.
     *
     * @param {string} event - The name of the event.
     * @returns A set containing the listeners for the event.
     */
    getListeners(event: string): Set<Function> | undefined;
    /**
     * Checks if the specified event has any listeners registered.
     *
     * @param event - The name of the event to check.
     * @returns A boolean indicating whether the event has listeners.
     */
    hasListeners(event: string): boolean;
    /**
     * Retrieves the events from the object.
     *
     * @returns An array containing the event names.
     */
    getEventNames(): string[];
}
