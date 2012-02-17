
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
bundle = _e.bundle()
bundle.on "mod/foo/bar", (bar) -> console.log bar

# or
bundle = _e.bundle "mod/foo"
bundle.on "bar", (bar) -> console.log bar

# use all event functions from _e
# -  bundle.once
# -  bundle.idle
# -  bundle.connect
bundle.pause()
bundle.destroy()

