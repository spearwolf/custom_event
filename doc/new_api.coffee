
_e.eventize( obj )                                      # DONE

obj.emit "foo"  # -> call .on "foo"                     # DONE

obj.on "foo", callback    -> EventConnection            # DONE
obj.once "foo", callback  -> EventConnection            # TODO

obj.off "foo"                                           # TODO
obj.off "foo", callback                                 # TODO
EventConnection#off()                                   # TODO

_e.connect "foo", obj, otherObj   -> EventConnection    # TODO
obj.connect "foo", otherObj                             # TODO -> obj.on("foo", _e.slot(_e.eventize(otherObj)))

EventConnection#name     === "foo"                      # DONE
EventConnection#sender   === obj                        # DONE
EventConnection#receiver === otherObj                   # DONE
EventConnection#pause    === false                      # DONE
EventConnection#off()                                   # TODO

# global events

_e.topic('bar')  -> EventTopic                          # DONE

EventTopic#name === 'bar'                               # DONE
EventTopic#pause                                        # DONE
EventTopic#destroy()                                    # TODO


_e.emit "globalFoo"                                     # TODO ?allow-globalEvents?
_e.topic('bar').emit "globalFoo"                        # DONE

_e.on "globalFoo", callback                             # TODO ?allow-globalEvents?
_e.topic('bar').on "globalFoo"                          # DONE

