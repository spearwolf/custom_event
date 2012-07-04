# NEXT FEATURES TO IMPLEMENT -->


# 1) bundles
# ----------
bundle = _e.bundle()
bundle.on "mod/foo/bar", (bar) -> console.log bar

# bundle.modFooBar(11)


# or
_e.bundle "mod/foo" (bundle) ->
    bundle.on "bar", (bar) -> console.log bar

# bundle.bar(12)

# define bundle values
bundle.val "foo" [, "plah!"]

bundle.values
    foo: "plah!"
    yzx: [1,2,3]

# read value
bundle.foo()
bundle.foo.get()
bundle.foo (foo) -> ...
bundle.foo.on (foo) -> ...
bundle.foo.connect "/bundle/foo/changed"
#bundle.getFoo()

# write value
bundle.foo("bar")
bundle.foo.set("bar")
#bundle.setFoo("bar")


# use all event functions from _e
# -  bundle.once
# -  bundle.idle
# -  bundle.connect
bundle.pause true, except: "bar", only: ["foo"]
bundle.destroy()


# 2) values
# ----------

# GET
_e.get "foo/bar", (val) -> console.log "foo/bar -> #{val}"       # --> DONE!
# .. is a shortcut for ..
_e.val("foo/bar").get (val) -> console.log "foo/bar -> #{val}"   # --> DONE!

# SET
_e.val("foo/bar").set(23)   # DONE!
_e.set "foo/bar", 23        # DONE!

# CONNECT
_e.connect "a/b/c", "d/e/f", _e.val("foo/bar")       # calling _e.val(..).set     --> DONE!
_e.connect _e.val("foo/bar"), "foo/bar/updated"      # _e.val(..) changed trigger --> DONE!

# ON
_e.on _e.val("foo/bar"), (val) -> console.log "foo/bar -> #{val}"               # --> DONE!
                                                     # _e.val(..) changed trigger


# 3) connect extension
# --------------------

# (FILTER) --> GUARDS!
_e.connect "foo/bar", "test/xyz", (x) -> x != 0      # connect guard

# MORE FLEXIBLE CONNECTS
_e.connect ["a/b/c", "d/e/f"], "foo/bar"             # call "foo/bar" after "a/b/c" or "d/e/f"



# 4) sexy API
# ---------------------

_e "foo/bar"                          # --> _e.emit "foo/bar"
#_e "foo/bar", -> console.log @name    # --> _e.on "foo/bar", -> console.log @name

bar = _e.val "foo/bar"                #                                 DONE!
bar()                                 # --> bar.get()                   DONE!
bar (x) -> console.log "bar=", x      # --> bar.get (x) -> cons....     DONE!
bar(23)                               # --> bar.set(23)                 DONE!
















#========================
#THINKTANK
#========================


bar = _e.val 'foo/bar'

#bar.get()                     # => undefined
bar()                         # => undefined

#bar.set 123
bar(123)

#bar.get()                     # => 123
bar()                     # => 123

bar.fun () -> 567
#bar.get()                     # => 567
bar()                     # => 567

# nochmal drüber nachdenken ..
bar.before (newVal, oldVal) -> console.log "foo/bar changed to: ${oldVal}"
bar.after (newVal, oldVal) -> console.log "foo/bar changed to: ${newVal}"
# .. hier auch ..
_e.connect _e.val("foo/bar"), "foo/barChanged", _e.val("tada/foo/bar"), (val) -> val



_e.on "foo/plah", (bar) -> console.log bar

bar.connect "foo/plah"
#bar.set 234
bar(234)

bar.destroy()


# connect with an opt filter func
_e.connect "foo/bar", "foo/plah", (x) -> @filter x*2


_e.on "foo/bar", () -> log "hallo"
_e.once "foo/bar", () -> log "moin"
_e.idle "foo/lala", 5000, () -> log "lala is bored :("
_e.action "foo/bar"
# _e.safe_action .. same as action but if no handler installed store action until one handler recieves it
# _e.laction -> lasting action

_e.connect "foo/bar", "foo/lala"
_e.val("foo/spw").set "spearwolf"

# collect as _e.action .... with result function
_e.collect "foo/bar", "foo/plah", "bar/*", (results) -> console.log results
# collect variants
_e.wait_for "foo/bar", "foo/plah", (bar, plah) -> console.log bar, plah


# fällt weg ..
_e.mod "mod/a",
    _init: () -> log "first time"
    'on foo': () -> log "foo!"

# .. dafür bundles
