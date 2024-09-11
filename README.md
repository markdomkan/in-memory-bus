# InMemoryBus

![alt text](image.png)

## Overview

`InMemoryBus` is a TypeScript class that provides a simple in-memory event bus system. It allows you to register, emit, and manage events within your application. This is particularly useful for implementing a publish-subscribe pattern, where different parts of your application can communicate with each other without being tightly coupled.

## Features

- **Event Registration**: Register event listeners that can be triggered when an event is emitted.
- **One-Time Event Listeners**: Register listeners that are invoked only once for an event and then automatically removed.
- **Event Emission**: Emit events with associated data to trigger registered listeners.
- **Asynchronous Event Emission**: Emit events and wait for all listeners to complete, either in parallel or sequentially.
- **Event Listener Management**: Remove individual listeners or all listeners for a specific event.
- **Event Inspection**: Check if an event has listeners, retrieve all listeners for an event, and list all registered events.
- **Event Clearing**: Clear all events and listeners.

## Installation

To use `InMemoryBus`, you can copy the class definition into your TypeScript project. There are no external dependencies.

## Usage

### Basic Example

```typescript
// Define event types
interface AppEvents {
  userLoggedIn: { userId: string };
  messageReceived: { message: string };
}

// Create an instance of InMemoryBus
const eventBus = new InMemoryBus<AppEvents>();

// Register an event listener
eventBus.on('userLoggedIn', (data) => {
  console.log(`User logged in with ID: ${data.userId}`);
});

// Emit an event
eventBus.emit('userLoggedIn', { userId: '12345' });

// Output: User logged in with ID: 12345
```

### Registering a One-Time Event Listener

```typescript
eventBus.once('messageReceived', (data) => {
  console.log(`Received message: ${data.message}`);
});

eventBus.emit('messageReceived', { message: 'Hello, World!' });
// Output: Received message: Hello, World!

// Subsequent emissions won't trigger the listener
eventBus.emit('messageReceived', { message: 'Another message' });
```

### Removing Event Listeners

```typescript
const callback = (data: { userId: string }) => {
  console.log(`User logged in with ID: ${data.userId}`);
};

eventBus.on('userLoggedIn', callback);

// Remove the specific listener
eventBus.off('userLoggedIn', callback);

// Emit the event - callback won't be invoked
eventBus.emit('userLoggedIn', { userId: '12345' });
```

### Clearing All Event Listeners

```typescript
eventBus.on('userLoggedIn', (data) => console.log(`User: ${data.userId}`));
eventBus.on('messageReceived', (data) => console.log(`Message: ${data.message}`));

// Clear all listeners
eventBus.clear();

// No output as all listeners have been removed
eventBus.emit('userLoggedIn', { userId: '12345' });
eventBus.emit('messageReceived', { message: 'Hello' });
```

### Inspecting Registered Events

```typescript
// Check if an event has listeners
const hasUserLoggedInListeners = eventBus.hasListeners('userLoggedIn'); // false

// Get all listeners for an event
const listeners = eventBus.getListeners('userLoggedIn'); // undefined or Set<Function>

// Get a list of all registered event names
const eventNames = eventBus.getEventNames(); // []
```

### Asynchronous Event Emission

```typescript
eventBus.on('userLoggedIn', async (data) => {
  await someAsyncOperation(data.userId);
  console.log(`User logged in: ${data.userId}`);
});

// Emit and wait for all listeners to complete in parallel
await eventBus.emitAwaitAll('userLoggedIn', { userId: '12345' });

// Emit and wait for all listeners to complete sequentially
await eventBus.emitAwaitSerial('userLoggedIn', { userId: '67890' });
```

## API Reference

### `on<T extends keyof Events>(event: T, callback: (data: Events[T]) => void): void`
Registers a callback function to be invoked when the specified event is emitted.

### `off<T extends keyof Events>(event: T, callback: (data: Events[T]) => void): void`
Removes the specified callback from the event's listener set.

### `offAll<T extends keyof Events>(event: T): void`
Removes all listeners for the specified event.

### `emit<T extends keyof Events>(event: T, data: Events[T]): void`
Emits the specified event, triggering all registered listeners with the provided data.

### `emitAwaitAll<T extends keyof Events>(event: T, data: Events[T]): Promise<void>`
Emits the specified event and waits for all listeners to complete their execution in parallel.

### `emitAwaitSerial<T extends keyof Events>(event: T, data: Events[T]): Promise<void>`
Emits the specified event and waits for each listener to complete its execution sequentially.

### `once<T extends keyof Events>(event: T, callback: (data: Events[T]) => void): void`
Registers a one-time listener for the specified event, which is removed after the event is emitted.

### `clear(): void`
Clears all events and their listeners.

### `getListeners<T extends keyof Events>(event: T): Set<Function> | undefined`
Returns the set of listeners registered for the specified event.

### `hasListeners<T extends keyof Events>(event: T): boolean`
Checks if the specified event has any listeners registered.

### `getEventNames(): string[]`
Returns an array of all registered event names.

## License

This code is provided as-is with no warranty. Feel free to use it in your projects. Modify and redistribute as you see fit.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

This `README.md` provides a comprehensive guide on how to use the `InMemoryBus` class, including installation, usage examples, and a detailed API reference.