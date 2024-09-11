export class InMemoryBus<Events extends { [event: string]: any }> {
  private events: Map<keyof Events, Set<Function>> = new Map();

  /**
   * Registers an event listener for the specified event.
   *
   * @template T - The type of event to listen for.
   * @param {T} event - The event to listen for.
   * @param {(data: Events[T]) => void} callback - The callback function to be executed when the event is triggered.
   * @returns {void}
   */
  public on<T extends keyof Events>(
    event: T,
    callback: (data: Events[T]) => void,
  ): void {
    let listeners: Set<Function> = this.events.get(event) ?? new Set();
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
  public off<T extends keyof Events>(
    event: T,
    callback: (data: Events[T]) => void,
  ): void {
    if (!this.events.has(event)) {
      return;
    }
    this.events.get(event)?.delete(callback);
  }

  /**
   * Removes all event listeners for the specified event.
   *
   * @template T - The type of the event.
   * @param {T} event - The event to remove all listeners for.
   * @returns {void}
   */
  public offAll<T extends keyof Events>(event: T): void {
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
  public emit<T extends keyof Events>(event: T, data: Events[T]): void {
    if (!this.events.has(event)) {
      return;
    }
    this.events.get(event)?.forEach((listener) => listener(data));
  }

  /**
   * Emits an event with the specified data and waits for all listeners to complete.
   *
   * @template T - The type of event.
   * @param {T} event - The event to emit.
   * @param {Events[T]} data - The data associated with the event.
   * @returns {Promise<void>} - A promise that resolves when all listeners have completed.
   */
  public async emitAwaitAll<T extends keyof Events>(
    event: T,
    data: Events[T],
  ): Promise<void> {
    if (!this.events.has(event)) {
      return;
    }
    await Promise.all(
      [...this.events.get(event)!.values()].map((listener) => listener(data)),
    );
  }

  /**
   * Emits an event with the specified data and waits for each listener to complete in sequence.
   *
   * @template T - The type of event.
   * @param {T} event - The event to emit.
   * @param {Events[T]} data - The data associated with the event.
   * @returns {Promise<void>} - A promise that resolves when all listeners have completed in sequence.
   */
  public async emitAwaitSerial<T extends keyof Events>(
    event: T,
    data: Events[T],
  ): Promise<void> {
    if (!this.events.has(event)) {
      return;
    }
    for (const listener of this.events.get(event)!.values()) {
      await listener(data);
    }
  }

  /**
   * Registers a callback function to be executed only once when the specified event occurs.
   *
   * @template T - The type of the event.
   * @param {T} event - The event to listen for.
   * @param {(data: Events[T]) => void} callback - The callback function to be executed when the event occurs.
   * @returns {void}
   */
  public once<T extends keyof Events>(
    event: T,
    callback: (data: Events[T]) => void,
  ): void {
    const onceCallback = (data: Events[T]) => {
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
  public clear(): void {
    this.events.clear();
  }

  /**
   * Retrieves the listeners for a specific event.
   *
   * @template T - The event type.
   * @param {T} event - The event to retrieve listeners for.
   * @returns {Set<Function> | undefined} - The set of listeners for the event, or undefined if no listeners are found.
   */
  public getListeners<T extends keyof Events>(
    event: T,
  ): Set<Function> | undefined {
    return this.events.get(event);
  }

  /**
   * Checks if the specified event has any listeners registered.
   *
   * @template T - The type of the event.
   * @param {T} event - The event to check for listeners.
   * @returns {boolean} - True if the event has listeners, false otherwise.
   */
  public hasListeners<T extends keyof Events>(event: T): boolean {
    return this.events.has(event);
  }

  /**
   * Retrieves the events from the object.
   *
   * @returns An array containing the event names.
   */
  public getEventNames(): string[] {
    return [...this.events.keys()] as string[];
  }
}
