import { describe, expect, mock, test } from "bun:test";
import { MiddlewareBus } from "../main";

const eventMiddlewares = {
    userLoggedIn: [
        (data: string) => data !== "blocked",
        (data: number) => data !== 0,
    ],
    messageReceived: [
        async (payload: string) => payload.length > 0,
    ],
}

describe("MiddlewareBus", () => {

    test("should register and emit an event", async () => {
        const eventBus = new MiddlewareBus(eventMiddlewares);

        const callback = mock();

        eventBus.on("messageReceived", callback);
        await eventBus.emit("messageReceived", "message");

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith("message");
    });

    test("should remove an event listener", async () => {
        const eventBus = new MiddlewareBus(eventMiddlewares);
        const callback = mock();

        eventBus.on("userLoggedIn", callback);
        eventBus.off("userLoggedIn", callback, false);
        await eventBus.emit("userLoggedIn", 12345);

        expect(callback).not.toHaveBeenCalled();
    });

    test("should remove all listeners for an event", async () => {
        const eventBus = new MiddlewareBus(eventMiddlewares);
        const callback1 = mock();
        const callback2 = mock();

        eventBus.on("userLoggedIn", callback1);
        eventBus.on("userLoggedIn", callback2);
        eventBus.offAll("userLoggedIn", false);
        await eventBus.emit("userLoggedIn", 12345);

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
    });

    test("should queue events that fail middleware and re-evaluate them", async () => {
        const eventBus = new MiddlewareBus(eventMiddlewares);
        const callback = mock();

        eventBus.on("userLoggedIn", callback);
        await eventBus.emit("userLoggedIn", "blocked");
        expect(callback).not.toHaveBeenCalled();

        await eventBus.emit("userLoggedIn", 0);
        expect(callback).not.toHaveBeenCalled();

        await eventBus.emit("userLoggedIn", 12345);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(12345);

        await eventBus.reEval("userLoggedIn");
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test("should queue events that fail middleware and re-evaluate them after change", async () => {

        let bloqued = true;

        const eventBus = new MiddlewareBus({
            isblocked: [
                () => !bloqued
            ],
        });
        const callback = mock();

        eventBus.on("isblocked", callback);
        await eventBus.emit("isblocked", undefined);
        expect(callback).not.toHaveBeenCalled();

        bloqued = false;

        await eventBus.reEval("isblocked");
        expect(callback).toHaveBeenCalledTimes(1);

    });

});