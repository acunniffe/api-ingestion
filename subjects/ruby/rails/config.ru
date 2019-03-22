require_relative 'echo_server'
require 'optic/middleware'

use Rack::Runtime
# if ENV['OPTIC_SERVER_LISTENING']
use Optic::DocumentingMiddleware
# end
run EchoServer.new
