# Memory BUSES

![alt text](image.png)

## Overview
This repository provides two TypeScript implementations for event bus patterns:

1. `InMemoryBus`: A simple in-memory event bus system that implements the publish-subscribe pattern. It allows different parts of your application to communicate without tight coupling through event registration and emission.

2. `MiddlewareBus`: An enhanced event bus that adds middleware support. It allows you to intercept and validate events before they're processed, with features like:
  - Event queue management for rejected events
  - Middleware validation before event emission
  - Re-evaluation of queued events
  - Type-safe event and payload handling

Both implementations are useful for different scenarios:
- Use `InMemoryBus` for simple event-driven architectures
- Use `MiddlewareBus` when you need validation, queuing, or control over event flow

## Features

- **Event Registration**: Register event listeners that can be triggered when an event is emitted.
- **One-Time Event Listeners**: Register listeners that are invoked only once for an event and then automatically removed.
- **Event Emission**: Emit events with associated data to trigger registered listeners.
- **Asynchronous Event Emission**: Emit events and wait for all listeners to complete, either in parallel or sequentially.
- **Event Listener Management**: Remove individual listeners or all listeners for a specific event.
- **Event Inspection**: Check if an event has listeners, retrieve all listeners for an event, and list all registered events.
- **Event Clearing**: Clear all events and listeners.
- **Middleware Support**: Intercept and validate events before they are processed.
- **Event Queue Management**: Queue events that fail middleware validation.
- **Re-evaluation of Queued Events**: Re-evaluate and process queued events when conditions change.
- **Type-safe Event and Payload Handling**: Ensure type safety for events and their payloads.

## Usage

### InMemoryBus

#### Basic Example

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

#### Registering a One-Time Event Listener

```typescript
eventBus.once('messageReceived', (data) => {
  console.log(`Received message: ${data.message}`);
});

eventBus.emit('messageReceived', { message: 'Hello, World!' });
// Output: Received message: Hello, World!

// Subsequent emissions won't trigger the listener
eventBus.emit('messageReceived', { message: 'Another message' });
```

#### Asynchronous Event Emission

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

### MiddlewareBus

#### Basic Example

```typescript
let bloqued = true;

// Create an instance of MiddlewareBus with middleware
const eventBus = new MiddlewareBus({
    isblocked: [
        () => !bloqued
    ],
});

// Register an event listener
eventBus.on("isblocked", (data)=>{
  console.log(data); 
});

// Emit an event. The listener won't be triggered because the middleware blocks it.
await eventBus.emit("isblocked", undefined);

// Modify the blocking condition
bloqued = false;

// Re-evaluate the event. The listener will now be triggered.
await eventBus.reEval("isblocked");
```


## License

This code is provided as-is with no warranty. Feel free to use it in your projects. Modify and redistribute as you see fit.

## Contributing
Contributions are welcome! Please feel free to submit issues or pull requests.
