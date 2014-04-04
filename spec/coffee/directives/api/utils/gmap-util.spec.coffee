describe "GmapUtil", ->
    beforeEach ->
        @subject = directives.api.utils.GmapUtil

    it "(getLabelPositionPoint) should convert decimal coordinates separated by a space into a map Point object", ->
        testCases = [
            { input: '22 0', expected: { x: 22, y: 0 } }
            { input: '1 2', expected: { x: 1, y: 2 } }
            { input: '1.0 2.3', expected: { x: 1.0, y: 2.3 } }
            { input: '-1 -2', expected: { x: -1, y: -2 } }
        ]
        for testCase in testCases
            result = @subject.getLabelPositionPoint(testCase.input)
            expect(result.x).toEqual(testCase.expected.x)
            expect(result.y).toEqual(testCase.expected.y)

    it "(getLabelPositionPoint) should ignore coordinate strings not following the format", ->
        testCases = [
            ' 1 2 '
            'a b'
            '1,2'
        ]
        for testCase in testCases
            result = @subject.getLabelPositionPoint(testCase.input)
            expect(result).toBeUndefined()
