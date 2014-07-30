# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

Gem::Specification.new do |spec|
  # We don’t use rails-assets.org gems within the Rails Assets app.
  # This is the only reason why this asset gem was created.

  spec.name          = 'angular-semver-sort-rails'
  spec.version       = '0.2.3'
  spec.authors       = ['Dominik Porada']
  spec.email         = ['dominik@porada.co']
  spec.summary       = 'angular-semver-sort packaged for Rails assets pipeline'
  spec.homepage      = 'https://github.com/rails-assets/angular-semver-sort'
  spec.license       = 'BSD'
  spec.files         = `git ls-files`.split($/)
  spec.require_paths = ['lib']

  spec.add_development_dependency 'bundler', '~> 1.5'
  spec.add_development_dependency 'rake'
end
