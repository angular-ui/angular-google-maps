{spawn} = require('child_process')
globby = require 'globby'


lint = ({src, doThrow}, cb) ->
  doThrow ?= true

  args = globby.sync(src)
  args.push('-q') #show errors only

  #note this is dependent on cofeelint being in the path, see: ./options.coffee
  stream = spawn('coffeelint', args, {stdio: 'inherit'}) #note since using in inherit there is no .pipe (due to inherit)

  if !cb
    return stream

  stream.on 'error', (error) ->
    if doThrow
      cb(error)
  stream.once 'close', cb
  stream.once 'end', cb

  return

module.exports = lint
