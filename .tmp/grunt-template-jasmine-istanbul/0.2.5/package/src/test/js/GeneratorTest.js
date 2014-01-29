describe('Generator', function () {
	describe('getRandomNumber', function () {
		it('should be chosen by fair dice roll', function () {
			expect(Generator.getRandomNumber()).toBe(4);
		});
	});
});