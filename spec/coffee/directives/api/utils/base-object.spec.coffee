describe "oo.BaseObject", ->
    beforeEach ->
        module "google-maps.directives.api.utils"
        inject (BaseObject) =>
            @subject = BaseObject
            PersonModule =
                changePersonName: (person, name)->
                    person.name = name
                    person
                killPersonsName: (person)->
                    delete person.name
                    person
            PersonAttributes =
                p_name: "no_name"
                state: "no_state"
            @PersonAttributes = PersonAttributes
            class Person extends BaseObject
                @include PersonModule
                @extend PersonAttributes
                constructor: (name, state)->
                    @name = if name? then name else Person.p_name
                    @state = if state? then state else Person.state
            @name = "nick"
            @state = "fl"
            @defaultUsage = new Person()
            @usage = new Person(@name, @state)

    it "exists ~ you loaded the script!", ->
        expect(@subject?).toEqual(true)

    describe "include specs", ->
        it "defaults attributes exist", ->
            expect(@defaultUsage.name?).toEqual(true)
            expect(@defaultUsage.name?).toEqual(true)
        it "defaults attributes are correct", ->
            expect(@defaultUsage.name).toEqual(@PersonAttributes.p_name)
            expect(@defaultUsage.state).toEqual(@PersonAttributes.state)
        it "subject attributes are correct ", ->
            expect(@usage.name).toEqual(@name)
            expect(@usage.state).toEqual(@state)
    describe "extend specs", ->
        it "defaults functions exist", ->
            expect(@defaultUsage.changePersonName?).toEqual(true)
            expect(@defaultUsage.killPersonsName?).toEqual(true)
        it "subject functions act correctly", ->
            p =  @defaultUsage.changePersonName(angular.copy(@defaultUsage), "john")
            p2 = @defaultUsage.killPersonsName(@defaultUsage)
            expect(p.name).toEqual("john")
            expect(p2.name).toEqual(undefined)