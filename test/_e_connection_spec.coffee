should = require 'should'
_e     = require "./../custom_event"

#describe "Create a CustomEventConnection", ->


    #it "_e.on( 'foo', fn )", ->

        #connection = _e.on "foo", -> yes

        #connection.should.be.instanceof(_e.CustomEventConnection)


    #it "_e.connect( 'foo', fn )", ->

        #connection = _e.connect "foo", -> yes

        #connection.should.be.instanceof(_e.CustomEventConnection)


    #it "_e.eventize( obj ).on( 'foo', fn )", ->

        #connection = _e.eventize({}).on "foo", -> yes

        #connection.should.be.instanceof(_e.CustomEventConnection)


    #it "_e.eventize( obj ).connect( 'foo', fn )", ->

        #connection = _e.eventize({}).connect "foo", -> yes

        #connection.should.be.instanceof(_e.CustomEventConnection)


    #it "_e.topic().on( 'foo', fn )", ->

        #connection = _e.topic().on "foo", -> yes

        #connection.should.be.instanceof(_e.CustomEventConnection)


    #it "_e.topic().connect( 'foo', fn )", ->

        #connection = _e.topic().connect "foo", -> yes

        #connection.should.be.instanceof(_e.CustomEventConnection)


    #it "_e.topic( 'topic' ).on( 'foo', fn )", ->

        #connection = _e.topic('topic').on "foo", -> yes

        #connection.should.be.instanceof(_e.CustomEventConnection)


    #it "_e.topic( 'topic' ).connect( 'foo', fn )", ->

        #connection = _e.topic('topic').connect "foo", -> yes

        #connection.should.be.instanceof(_e.CustomEventConnection)




#describe "CustomEventConnection API", ->

    #connection = _e.eventize({}).on "foo", -> yes

    #it ".name property"   , -> connection.name.should.equal "foo"
    #it ".pause property exists and is false" , -> connection.pause.should.equal no
    #it ".destroy()"       , -> connection.destroy.should.be.a.Function
    #it ".eventize()"      , -> connection.eventize.should.be.a.Function


