describe "oo.BaseObject", ->
    it "exists ~ you loaded the script!", ->
        expect(oo.BaseObject?).toEqual(true)
@ngGmapModule "oo.test", ->
    @PersonModule =
        changePersonName: (person, name)->
            person.name = name
            person
        killPersonsName: (person)->
            delete person.name
            person
    @PersonAttributes =
        p_name: "no_name"
        state: "no_state"
    class @Person extends oo.BaseObject
        @include oo.test.PersonModule
        @extend oo.test.PersonAttributes
        constructor: (name, state)->
            @name = if name? then name else oo.test.Person.p_name
            @state = if state? then state else oo.test.Person.state

describe "oo.BaseObject", ->
    beforeEach ->
        @name = "nick"
        @state = "fl"
        @defaultSubject = new oo.test.Person()
        @subject = new oo.test.Person(@name, @state)
    describe "include specs", ->
        it "defaults attributes exist", ->
            expect(@defaultSubject.name?).toEqual(true)
            expect(@defaultSubject.name?).toEqual(true)
        it "defaults attributes are correct", ->
            expect(@defaultSubject.name).toEqual(oo.test.PersonAttributes.p_name)
            expect(@defaultSubject.state).toEqual(oo.test.PersonAttributes.state)
        it "subject attributes are correct ", ->
            expect(@subject.name).toEqual(@name)
            expect(@subject.state).toEqual(@state)
    describe "extend specs", ->
        it "defaults functions exist", ->
            expect(@defaultSubject.changePersonName?).toEqual(true)
            expect(@defaultSubject.killPersonsName?).toEqual(true)
        it "subject functions act correctly", ->
            p =  @defaultSubject.changePersonName(angular.copy(@defaultSubject), "john")
            p2 = @defaultSubject.killPersonsName(@defaultSubject)
            expect(p.name).toEqual("john")
            expect(p2.name).toEqual(undefined)