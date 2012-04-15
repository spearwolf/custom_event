_e.options.trace = true;

describe("_e.collect", function() {

    it("should collect all results from a topic", function() {

        var topic = "gaia/foo",
            result;
        
        _e.on(topic, function() { return 1; });
        _e.on(topic, function() { return 2; });
        _e.on(topic, function() { return 3; });
        _e.on(topic, function() { });

        _e.collect(topic, function(a, b, c) {
           result = [a, b, c];
        });

        expect(result.length).toEqual(3);
        expect(result[0]).toEqual(1);
        expect(result[1]).toEqual(2);
        expect(result[2]).toEqual(3);

        _e.on("zeus/a", function() { return 11; });
        _e.on("zeus/b", function() { return 12; });
        _e.on("zeus/c", function() { return null; });
        _e.on("zeus/b/c", function() { return 13; });

        result = null;

        _e.collect("zeus/*", function(a, b, c, d) {
            expect(a).toEqual(11);
            expect(b).toEqual(12);
            expect(typeof c).toEqual("undefined");
            expect(typeof d).toEqual("undefined");
        });
    });

});
