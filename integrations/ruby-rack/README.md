# Using Optic with Rails

Rails projects or those built on top of Rack are easy to connect to Optic using our custom middleware. 

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'optic-middleware'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install optic-middleware


### Making the Middleware Run During Testing
Now add the middleware to your Rack configuration, in a Rails app it's best to do this in `config/enviroments/test.rb` so the middleware is only used during testing. 

> Note: If you use multiple middlewares, make sure the Documenting Middleware is added at the bottom of the stack so the documentation is accurate. In most cases putting it last in your configuration file is sufficient. 

```ruby
Rails.application.configure do {
  # All your current configuration settings...
  
  # The Documenting middleware. Only used if 'OPTIC_SERVER_LISTENING' flag is found in ENV. 
  if ENV['OPTIC_SERVER_LISTENING']
    config.middleware.use OpticTestFixture::DocumentingMiddleware
  end
}
``` 

> Note for RSpec users: Optic will only document specs of type :request since only integration tests contain enough data to generate REST docs. Specs of type :controller skip the Rack stack so documentation generated from them would be incomplete.  
