describe "oo.BaseObject", ->
    beforeEach ->
        module "google-maps"
        inject BaseObject =>
            @subject = BaseObject

    it "exists ~ you loaded the script!", ->
        expect(@subject?).toEqual(true)


#describe "oo.BaseObject", ->
#    beforeEach ->
#        PersonModule =
#            changePersonName: (person, name)->
#                person.name = name
#                person
#            killPersonsName: (person)->
#                delete person.name
#                person
#        PersonAttributes =
#            p_name: "no_name"
#            state: "no_state"
#        class Person extends @subject
#            @include PersonModule
#            @extend PersonAttributes
#            constructor: (name, state)->
#                @name = if name? then name else Person.p_name
#                @state = if state? then state else Person.state
#            @name = "nick"
#            @state = "fl"
#            @defaultSubject = new Person()
#            @subject = new Person(@name, @state)
#
#    describe "include specs", ->
#        it "defaults attributes exist", ->
#            expect(@defaultSubject.name?).toEqual(true)
#            expect(@defaultSubject.name?).toEqual(true)
#        it "defaults attributes are correct", ->
#            expect(@defaultSubject.name).toEqual(PersonAttributes.p_name)
#            expect(@defaultSubject.state).toEqual(PersonAttributes.state)
#        it "subject attributes are correct ", ->
#            expect(@subject.name).toEqual(@name)
#            expect(@subject.state).toEqual(@state)
#    describe "extend specs", ->
#        it "defaults functions exist", ->
#            expect(@defaultSubject.changePersonName?).toEqual(true)
#            expect(@defaultSubject.killPersonsName?).toEqual(true)
#        it "subject functions act correctly", ->
#            p =  @defaultSubject.changePersonName(angular.copy(@defaultSubject), "john")
#            p2 = @defaultSubject.killPersonsName(@defaultSubject)
#            expect(p.name).toEqual("john")
#            expect(p2.name).toEqual(undefined)