
lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "optic/version"

Gem::Specification.new do |spec|
  spec.name          = "optic-middleware"
  spec.version       = Optic::Middleware::VERSION
  spec.authors       = ["Aidan Cunniffe"]
  spec.email         = ["acunniffe@useoptic.com"]

  spec.summary       = "Document an API written in Rack/Rails by running tests"
  spec.description   = ""
  spec.homepage      = "https://github.com/opticdev/ruby-rack-fixture"
  spec.license       = "MIT"

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  spec.files         = Dir.chdir(File.expand_path('..', __FILE__)) do
    `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  end
  spec.require_paths = ["lib"]
  spec.add_development_dependency "bundler", "~> 1.17.3"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "rspec", "~> 3.0"
end
