# Optic::Middleware

Rails projects or those built on top of Rack are easy to connect to Optic using our custom middleware. In this tutorial we'll show you how to connect the Optic Documenting Middleware to your Rack API so that your integration tests document your code as they execute.

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

## Using the Proxy Fixture
The Documenting middleware will document all the requests/responses that your tests run. Since it is integrated at the middleware level there's no need to update any of your tests files or fixtures. 

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/opticdev/optic-middleware.

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
