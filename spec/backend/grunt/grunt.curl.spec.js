"use strict";

const {exec} = require('child_process')

describe("grunt-curl", () => {
  it("can run", done => {
    exec("grunt curl", done)
  })
})
