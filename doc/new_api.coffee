
_e.eventize( obj )

obj.emit "foo"  # -> call .on "foo"

obj.on "foo", callback    -> EventConnection
obj.once "foo", callback  -> EventConnection

obj.off "foo"
obj.off "foo", callback
EventConnection#off()

_e.connect "foo", obj, otherObj   -> EventConnection
obj.connect "foo", otherObj

EventConnection#name     === "foo"
EventConnection#sender   === obj
EventConnection#receiver === otherObj
EventConnection#pause    === false
EventConnection#off()

# global events

_e.topic('bar')  -> EventTopic

EventTopic#name === 'bar'
EventTopic#destroy()


_e.emit "globalFoo"
_e.topic('bar').emit "globalFoo"

_e.on "globalFoo", callback
_e.topic('bar').on "globalFoo"

