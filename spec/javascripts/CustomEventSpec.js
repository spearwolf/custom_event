_e.options.trace = true;

describe("custom_event basics", function() {

    it("'_e' should exists in global namespace", function() {
        expect(_e).toBeDefined();
    });

    describe("when two event paths has been registered with '_e.on'", function() {  // {{{

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
            onFoo.destroy();
            onBar.destroy();
        });

        it("should the straight handler be executed after calling '_e.emit'", function() {

            _e.emit("test/foo", 23);

            expect(fooResult).toEqual(23);
            expect(barResult).toBeFalsy();

            _e.emit("test/bar", 42);

            expect(fooResult).toEqual(23);
            expect(barResult).toEqual(42);
        });

        it("should all handlers be executed after calling '_e.emit' with a wildcard event path", function() {

            _e.emit("test/*", 32);

            expect(fooResult).toEqual(32);
            expect(barResult).toEqual(32);
        });
    });
    // }}}

    describe("all handlers within sub paths", function() {  // {{{

        var onA, onB, onC, onD, resA, resB, resC, resD;

        beforeEach(function() {

            onA = _e.on("test/a", function(val) { resA = val; });
            onB = _e.on("test/foo/b", function(val) { resB = val; });
            onC = _e.on("test/foo/bar/c", function(val) { resC = val; });
            onD = _e.on("test", function(val) { resD = val; });

            resA = resB = resC = resD = false;
        });

        afterEach(function() {
            onA.destroy();
            onB.destroy();
            onC.destroy();
            onD.destroy();
        });

        it("should NOT be called when using wildcard path with double '**'", function() {
            // double-asterisk sequence '**' works only for registering events

            _e.emit("test/**", 55);

            expect(resA).toBeFalsy();
            expect(resB).toBeFalsy();
            expect(resC).toBeFalsy();
            expect(resD).toBeFalsy();
        });

    });
    // }}}

    describe("registering an action with double-asterisk '**'", function() { // {{{

        var onA, onB, onC, onD, resA, resB, resC, resD;

        beforeEach(function() {

            onA = _e.on("test/a", function(val) { resA = val; });
            onB = _e.on("test/foo/b", function(val) { resB = val; });
            onC = _e.on("test/foo/bar/c", function(val) { resC = val; });
            onD = _e.on("test/**", function() { resD = [].concat(Array.prototype.slice.call(arguments)); });

            resA = resB = resC = resD = false;
        });

        afterEach(function() {
            onA.destroy();
            onB.destroy();
            onC.destroy();
            onD.destroy();
        });

        it("should work for all event sub paths", function() {

            _e.emit("test/a", 55);

            expect(resA).toEqual(55);
            expect(resB).toBeFalsy();
            expect(resC).toBeFalsy();

            expect(resD[0]).toEqual('a');
            expect(resD[1]).toEqual(55);

            _e.emit("test/foo/b", 56);

            expect(resA).toEqual(55);
            expect(resB).toEqual(56);
            expect(resC).toBeFalsy();

            expect(resD[0]).toEqual('foo');
            expect(resD[1]).toEqual('b');
            expect(resD[2]).toEqual(56);

            _e.emit("test/foo/bar/c", 57);

            expect(resA).toEqual(55);
            expect(resB).toEqual(56);
            expect(resC).toEqual(57);

            expect(resD[0]).toEqual('foo');
            expect(resD[1]).toEqual('bar');
            expect(resD[2]).toEqual('c');
            expect(resD[3]).toEqual(57);
        });

    });
    // }}}

    describe("use '_e.once'", function() { // {{{

        var onA, onB, resA, resB;

        beforeEach(function() {

            onA = _e.once("once", function(val) { resA = val; });
            onB = _e.on("ever", function(val) { resB = val; });

            resA = resB = false;
        });

        afterEach(function() {
            onA.destroy();
            onB.destroy();
        });

        it("when one-time action is what you want", function() {

            _e.emit("once", 69);
            _e.emit("ever", 77);

            expect(resA).toEqual(69);
            expect(resB).toEqual(77);

            _e.emit("once", 70);
            _e.emit("ever", 78);

            expect(resA).toEqual(69);
            expect(resB).toEqual(78);
        });

    });
    // }}}

    describe("using pause", function() { // {{{

        it("should work as expected", function() {

            var bar, foo = _e.on("foo/bar", function() { bar = arguments[0]; });

            expect(foo.pause()).toBeFalsy();

            _e.emit("foo/bar", "herz aus eis");

            expect(bar).toEqual("herz aus eis");

            foo.pause(true);
            expect(foo.pause()).toBeTruthy();

            _e.emit("foo/bar", "nachtbringer");

            expect(bar).toEqual("herz aus eis");

            foo.pause(false);
            expect(foo.pause()).toBeFalsy();

            _e.emit("foo/bar", "weiter weiter");

            expect(bar).toEqual("weiter weiter");
        });

    });
    // }}}

    describe("eType should be correct", function() { // {{{

        it("when using event listener", function() {

            var etype = false, foo = _e.on("foo/bar", function() {
                etype = this.eType;
            });

            expect(foo.eType).toEqual("EventListener");

            _e.emit("foo/bar");

            expect(etype).toEqual("EventListener");
        });

    });
    // }}}

    describe("calling 'destroy()' on an EventListeners", function() { // {{{

        it("should work as expected", function() {

            var val, foo = _e.on("foo/bar", function() { val = arguments[0]; });

            _e.emit("foo/bar", "hejho");

            expect(val).toEqual("hejho");

            foo.destroy();

            _e.emit("foo/bar", "the truth");

            expect(val).toEqual("hejho");

            foo = _e.on("foo/bar", function() {
                val = arguments[0];
                this.destroy();
            });

            _e.emit("foo/bar", "last words");

            expect(val).toEqual("last words");
            
            _e.emit("foo/bar", "still alive?");

            expect(val).toEqual("last words");
        });

    });
    // }}}

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
