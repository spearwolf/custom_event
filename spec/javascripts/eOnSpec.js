_e.options.trace = true;

describe("_e.on", function() {

    it("should return an EventListener", function() {

        var topic = "hyperion/aphrodite",
            a = _e.on(topic, function() { });

        expect(a).toBeDefined();
        expect(typeof a).toEqual("object");
        expect(a.eType).toEqual("EventListener");
        expect(typeof a.id).toEqual("number");
        expect(a.name).toEqual(topic);
        expect(typeof a.destroy).toEqual("function");
    });

    it("should execute our callback after emiting an event for our topic", function() {

        var topic = "hyperion/aphrodite",
            anotherTopic = "kronos/zeus",
            resultA = null,
            resultB = null,
            a = _e.on(topic, function(val) { resultA = val; }),
            b = _e.on(anotherTopic, function(val) { resultB = val; });

        _e.emit(topic, 7);

        expect(resultA).toEqual(7);
        expect(resultB).toEqual(null);

        _e.emit(anotherTopic, 9);

        expect(resultA).toEqual(7);
        expect(resultB).toEqual(9);
    });

    it("should return an EventListener with pause() function", function() {

        var topic = "hyperion/aphrodite",
            resultA = null,
            a = _e.on(topic, function(val) { resultA = val; });

        expect(typeof a.pause).toEqual("function");
        expect(resultA).toEqual(null);
        expect(a.pause()).toEqual(false);

        _e.emit(topic, 1);
        expect(resultA).toEqual(1);
        expect(a.pause()).toEqual(false);
        a.pause(true);
        _e.emit(topic, 2);
        expect(resultA).toEqual(1);
        expect(a.pause()).toEqual(true);
        a.pause(false);
        _e.emit(topic, 3);
        expect(resultA).toEqual(3);
        expect(a.pause()).toEqual(false);
    });

    it("should return an EventListener with emit() function", function() {

        var topic = "hyperion/aphrodite",
            resultA = null,
            a = _e.on(topic, function(val) { resultA = val; });

        expect(typeof a.emit).toEqual("function");
        expect(resultA).toEqual(null);

        _e.emit(topic, 1);
        expect(resultA).toEqual(1);
        a.emit(2);
        expect(resultA).toEqual(2);
    });

    it("should return an EventListener with destroy() function", function() {

        var topic = "hyperion/aphrodite",
            resultA = null,
            a = _e.on(topic, function(val) { resultA = val; });

        expect(typeof a.destroy).toEqual("function");
        expect(resultA).toEqual(null);

        _e.emit(topic, 1);
        expect(resultA).toEqual(1);

        a.destroy();
        expect(typeof a.eType).toEqual("undefined");
        expect(typeof a.id).toEqual("undefined");
        expect(typeof a.name).toEqual("undefined");
        expect(typeof a.destroy).toEqual("undefined");
        expect(typeof a.emit).toEqual("undefined");
        expect(typeof a.pause).toEqual("undefined");

        _e.emit(topic, 2);
        expect(resultA).toEqual(1);
    });
});
