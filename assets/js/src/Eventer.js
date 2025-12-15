export default class Eventer {
    constructor() {
        this.cache = {};
    }

    publish(topic, args) {
        if (typeof this.cache[topic] === 'object') {
            this.cache[topic].forEach(property => {
                property.apply(this, args || []);
            });
        }
    }

    subscribe(topic, callback) {
        if (!this.cache[topic]) {
            this.cache[topic] = [];
        }
        this.cache[topic].push(callback);
        return [topic, callback];
    }

    unsubscribe(topic, fn) {
        if (this.cache[topic]) {
            this.cache[topic].forEach((element, idx) => {
                if (element == fn) {
                    this.cache[topic].splice(idx, 1);
                }
            });
        }
    }

    queue() {
        return this.cache;
    }

    // Aliases
    on(topic, callback) {
        return this.subscribe(topic, callback);
    }

    off(topic, fn) {
        return this.unsubscribe(topic, fn);
    }

    trigger(topic, args) {
        return this.publish(topic, args);
    }
}
