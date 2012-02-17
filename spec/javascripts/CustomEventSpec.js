describe("custom_event basics", function() {

    it("should exists in global namespace", function() {
        expect(_e).toBeDefined();
    });

    describe("when two event paths has been registered with '_e.on'", function() {

        var onFoo, onBar, fooResult, barResult;

        beforeEach(function() {

            onFoo = _e.on("test/foo", function() {
                fooResult = arguments[0];
            });

            onBar = _e.on("test/bar", function() {
                barResult = arguments[0];
            });

            fooResult = barResult = false;
        });

        afterEach(function() {
            onFoo.unbind();
            onBar.unbind();
        });

        it("should the straight handler be executed after calling '_e.action'", function() {

            _e.action("test/foo", 23);

            expect(fooResult).toEqual(23);
            expect(barResult).toBeFalsy();

            _e.action("test/bar", 42);

            expect(fooResult).toEqual(23);
            expect(barResult).toEqual(42);
        });

        it("should all handlers be executed after calling '_e.action' with a wildcard event path", function() {

            _e.action("test/*", 32);

            expect(fooResult).toEqual(32);
            expect(barResult).toEqual(32);
        });
    });

    describe("all handlers within sub paths", function() {

        var onA, onB, onC, onD, resA, resB, resC, resD;

        beforeEach(function() {

            onA = _e.on("test/a", function(val) { resA = val; });
            onB = _e.on("test/foo/b", function(val) { resB = val; });
            onC = _e.on("test/foo/bar/c", function(val) { resC = val; });
            onD = _e.on("test", function(val) { resD = val; });

            resA = resB = resC = resD = false;
        });

        afterEach(function() {
            onA.unbind();
            onB.unbind();
            onC.unbind();
            onD.unbind();
        });

        it("should NOT be called when using wildcard path with double '**'", function() {

            _e.action("test/**", 55);

            expect(resA).toBeFalsy();
            expect(resB).toBeFalsy();
            expect(resC).toBeFalsy();
            expect(resD).toBeFalsy();
        });

    });

    describe("registering an action with double-asterisk '**'", function() {

        var onA, onB, onC, onD, resA, resB, resC, resD;

        beforeEach(function() {

            onA = _e.on("test/a", function(val) { resA = val; });
            onB = _e.on("test/foo/b", function(val) { resB = val; });
            onC = _e.on("test/foo/bar/c", function(val) { resC = val; });
            onD = _e.on("test/**", function() { resD = [].concat(Array.prototype.slice.call(arguments)); });

            resA = resB = resC = resD = false;
        });

        afterEach(function() {
            onA.unbind();
            onB.unbind();
            onC.unbind();
            onD.unbind();
        });

        it("should work for all event sub paths", function() {

            _e.action("test/a", 55);

            expect(resA).toEqual(55);
            expect(resB).toBeFalsy();
            expect(resC).toBeFalsy();

            expect(resD[0]).toEqual('a');
            expect(resD[1]).toEqual(55);

            _e.action("test/foo/b", 56);

            expect(resA).toEqual(55);
            expect(resB).toEqual(56);
            expect(resC).toBeFalsy();

            expect(resD[0]).toEqual('foo');
            expect(resD[1]).toEqual('b');
            expect(resD[2]).toEqual(56);

            _e.action("test/foo/bar/c", 57);

            expect(resA).toEqual(55);
            expect(resB).toEqual(56);
            expect(resC).toEqual(57);

            expect(resD[0]).toEqual('foo');
            expect(resD[1]).toEqual('bar');
            expect(resD[2]).toEqual('c');
            expect(resD[3]).toEqual(57);
        });

    });

    /*
    // demonstrates use of spies to intercept and test method calls
    it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
    });

    //demonstrates use of expected exceptions
    describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
    player.play(song);

    expect(function() {
    player.resume();
    }).toThrow("song is already playing");
    });
    });
    */
});
