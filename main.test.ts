import { beforeEach, describe, expect, mock, test } from "bun:test";
import { InMemoryBus } from "./main";

interface AppEvents {
  userLoggedIn: { userId: string };
  messageReceived: { message: string };
}

describe("InMemoryBus", () => {
  let eventBus: InMemoryBus<AppEvents>;

  beforeEach(() => {
    eventBus = new InMemoryBus<AppEvents>();
  });

  test("should register and emit an event", () => {
    const callback = mock();

    eventBus.on("userLoggedIn", callback);
    eventBus.emit("userLoggedIn", { userId: "12345" });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ userId: "12345" });
  });

  test("should remove an event listener", () => {
    const callback = mock();

    eventBus.on("userLoggedIn", callback);
    eventBus.off("userLoggedIn", callback);
    eventBus.emit("userLoggedIn", { userId: "12345" });

    expect(callback).not.toHaveBeenCalled();
  });

  test("should remove all listeners for an event", () => {
    const callback1 = mock();
    const callback2 = mock();

    eventBus.on("userLoggedIn", callback1);
    eventBus.on("userLoggedIn", callback2);
    eventBus.offAll("userLoggedIn");
    eventBus.emit("userLoggedIn", { userId: "12345" });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });

  test('should emit event only once when using "once"', () => {
    const callback = mock();

    eventBus.once("messageReceived", callback);
    eventBus.emit("messageReceived", { message: "Hello, World!" });
    eventBus.emit("messageReceived", { message: "Another message" });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ message: "Hello, World!" });
  });

  test("should clear all events", () => {
    const callback = mock();

    eventBus.on("userLoggedIn", callback);
    eventBus.clear();
    eventBus.emit("userLoggedIn", { userId: "12345" });

    expect(callback).not.toHaveBeenCalled();
  });

  test("should return true if an event has listeners", () => {
    const callback = mock();

    eventBus.on("userLoggedIn", callback);

    expect(eventBus.hasListeners("userLoggedIn")).toBe(true);
  });

  test("should return false if an event does not have listeners", () => {
    expect(eventBus.hasListeners("userLoggedIn")).toBe(false);
  });

  test("should return all listeners for an event", () => {
    const callback1 = mock();
    const callback2 = mock();

    eventBus.on("userLoggedIn", callback1);
    eventBus.on("userLoggedIn", callback2);

    const listeners = eventBus.getListeners("userLoggedIn");

    expect(listeners).toBeInstanceOf(Set);
    expect(listeners?.size).toBe(2);
    expect(listeners?.has(callback1)).toBe(true);
    expect(listeners?.has(callback2)).toBe(true);
  });

  test("should return all registered event names", () => {
    eventBus.on("userLoggedIn", mock());
    eventBus.on("messageReceived", mock());

    const eventNames = eventBus.getEventNames();

    expect(eventNames).toContain("userLoggedIn");
    expect(eventNames).toContain("messageReceived");
  });

  test("should wait for all listeners to complete in parallel using emitAwaitAll", async () => {
    const callback1 = mock().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );
    const callback2 = mock().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 200)),
    );

    eventBus.on("messageReceived", callback1);
    eventBus.on("messageReceived", callback2);

    const start = Date.now();
    await eventBus.emitAwaitAll("messageReceived", {
      message: "Hello, World!",
    });
    const duration = Date.now() - start;

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(duration).toBeGreaterThanOrEqual(200);
    expect(duration).toBeLessThan(300);
  });

  test("should wait for all listeners to complete in sequence using emitAwaitSerial", async () => {
    const callback1 = mock().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );
    const callback2 = mock().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 200)),
    );

    eventBus.on("messageReceived", callback1);
    eventBus.on("messageReceived", callback2);

    const start = Date.now();
    await eventBus.emitAwaitSerial("messageReceived", {
      message: "Hello, World!",
    });
    const duration = Date.now() - start;

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(duration).toBeGreaterThanOrEqual(300);
    expect(duration).toBeLessThan(400);
  });
});
