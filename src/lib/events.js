/**
 * Lightweight pub/sub event emitter.
 * Used so that creating a transaction / budget in a modal can notify
 * hooks to re-fetch their data without prop-drilling or lifting state.
 *
 * Usage:
 *   events.emit("transaction-created");
 *   events.on("transaction-created", callback);
 *   events.off("transaction-created", callback);
 */
class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (cb) => cb !== callback
    );
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((cb) => cb(data));
  }
}

export const events = new EventEmitter();
