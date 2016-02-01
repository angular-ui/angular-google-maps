module.exports =
  clean:
    coffee: ["tmp/output_coffee.js", "tmp"]
    dist: ["dist/*", "tmp"]
    example: ["example/<%= pkg.name %>.js"]
    spec: ["_Spec*"]
    streetview: ["dist/*street-view*"]
