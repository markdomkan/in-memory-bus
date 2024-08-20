"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var JsEvents = /** @class */ (function () {
    function JsEvents() {
        this.events = new Map();
    }
    /**
     * Registers a callback function to be executed when the specified event occurs.
     *
     * @param event - The name of the event to listen for.
     * @param callback - The callback function to be executed when the event occurs.
     */
    JsEvents.prototype.on = function (event, callback) {
        var _a;
        var listeners = (_a = this.events.get(event)) !== null && _a !== void 0 ? _a : new Set();
        listeners.add(callback);
        this.events.set(event, listeners);
    };
    /**
     * Removes a callback function from the event listeners for a specific event.
     *
     * @param event - The name of the event.
     * @param callback - The callback function to be removed.
     */
    JsEvents.prototype.off = function (event, callback) {
        var _a;
        if (!this.events.has(event)) {
            return;
        }
        (_a = this.events.get(event)) === null || _a === void 0 ? void 0 : _a.delete(callback);
    };
    /**
     * Removes all event listeners for the specified event.
     *
     * @param {string} event - The event to remove listeners for.
     */
    JsEvents.prototype.offAll = function (event) {
        this.events.delete(event);
    };
    /**
     * Emits an event and invokes all registered listeners.
     *
     * @param event - The name of the event to emit.
     * @param args - The arguments to pass to the event listeners.
     */
    JsEvents.prototype.emit = function (event) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.events.has(event)) {
            return;
        }
        (_a = this.events.get(event)) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) { return listener.apply(void 0, args); });
    };
    /**
     * Registers a callback function to be executed once for the specified event.
     *
     * @param event - The name of the event.
     * @param callback - The callback function to be executed.
     */
    JsEvents.prototype.once = function (event, callback) {
        var _this = this;
        var onceCallback = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            callback.apply(void 0, args);
            _this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    };
    /**
     * Clears the events.
     */
    JsEvents.prototype.clear = function () {
        this.events.clear();
    };
    /**
     * Retrieves the listeners for the specified event.
     *
     * @param {string} event - The name of the event.
     * @returns A set containing the listeners for the event.
     */
    JsEvents.prototype.getListeners = function (event) {
        return this.events.get(event);
    };
    /**
     * Checks if the specified event has any listeners registered.
     *
     * @param event - The name of the event to check.
     * @returns A boolean indicating whether the event has listeners.
     */
    JsEvents.prototype.hasListeners = function (event) {
        return this.events.has(event);
    };
    /**
     * Retrieves the events from the object.
     *
     * @returns An array containing the event names.
     */
    JsEvents.prototype.getEventNames = function () {
        return __spreadArray([], this.events.keys(), true);
    };
    return JsEvents;
}());
exports.default = JsEvents;
