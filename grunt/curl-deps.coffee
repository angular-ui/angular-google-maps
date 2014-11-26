# dependencies from the web that can not be easily supported by bower nor npm
# examples:
#   - svn projects
#   - non bower or node projects (have no package.json nor bower.json)
#
# If it is on github or any git repo then npm or bower should be used otherwise use this.
_ = require 'lodash'
path = require 'path'
relativePath = path.join __dirname, '../'

jf = require 'jsonfile'


deps = require('../curl.json').devDependencies

rc = null
rcDirectory = null

#support .bowerrc style as .curlrc {"directory": "somedir"}
try
  rc = jf.readFileSync "#{relativePath}.curlrc"
  rcDirectory = rc.directory if rc
catch

location = rcDirectory or 'curl_components'

#take all dependencies and map them like bower / node
# put them ina location/repoName/index.js
_.each deps, (v, k) ->
  repoName = k
  deps["#{location}/#{repoName}/index.js"] = v
  delete deps[k]

module.exports = deps