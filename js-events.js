export class JsEvents {
  constructor(obj) {
    this._jsEventsCallbacks = [];
    if (obj) {
      Object.assign(this, obj);
      Object.assign(this.__proto__, obj.__proto__);
    }
  }

  on(event, fn) {
    (this._jsEventsCallbacks[event] = this._jsEventsCallbacks[event] || []).push(fn);
    return this;
  }

  delete(event) {
    delete this._jsEventsCallbacks[event];
    return this;
  }

  emit(event, data) {
    if (this._jsEventsCallbacks[event] != null) {
      this._jsEventsCallbacks[event].forEach(fn => {
        if (typeof fn === "function") {
          fn(data);
        }
      });
    }
    return this;
  }

  listeners(event) {
    return this._jsEventsCallbacks[event];
  }

  hasListeners(event) {
    return !!this.listeners(event).length;
  }

  emitters() {
    return Object.keys(this._jsEventsCallbacks);
  }
}