#global jasmine protects
beforeEach ->
  @googleTemp = window.google
afterEach ->
  if @googleTemp?
    window.google = @googleTemp
