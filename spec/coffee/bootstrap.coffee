#global jasmine protects
beforeEach ->
  @googleTemp = window.google
afterEach ->
  window.google = @googleTemp