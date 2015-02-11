should = require 'should'
_e     = require "./../custom_event"

#describe "Create a CustomEventTopic", ->


    #it "_e.topic( 'topic' )", ->

        #topic = _e.topic "topic"

        #topic.should.be.instanceof(_e.CustomEventTopic)


    #it "_e.topic()", ->

        #topic = _e.topic()

        #topic.should.be.instanceof(_e.CustomEventTopic)
        #topic.name.should.equal "_e"



#describe "CustomEventTopic API", ->

    #topic = _e.topic("fooTopic")

    #it "is a singelton"   , -> topic.should.equal _e.topic("fooTopic")
    #it ".name property"   , -> topic.name.should.equal "fooTopic"
    #it ".pause property exists and is false" , -> topic.pause.should.equal no
    #it ".on()"            , -> topic.on.should.be.a.Function
    #it ".emit()"          , -> topic.emit.should.be.a.Function
    #it ".connect()"       , -> topic.connect.should.be.a.Function
    #it ".destroy()"       , -> topic.destroy.should.be.a.Function


