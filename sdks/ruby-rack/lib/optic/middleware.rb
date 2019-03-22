require "optic/version"
require 'net/http'

module Optic
  class DocumentingMiddleware
    def initialize(app, options = {})
      @app = app
      @app.freeze
      @host = ENV['OPTIC_SERVER_HOST'] || 'localhost'
    end

    def call(env)
      req = Rack::Request.new(env)
      res = @app.call(env)
      # Log request and response
      logRequestAndResponse(req, res)
      # Return Response without changing
      res
    end

    private

    def headerHash(message)
      Hash[*message.select {|k, v| k.start_with? 'HTTP_'}
                .collect {|k, v| [k.sub(/^HTTP_/, ''), v]}
                .collect {|k, v| [k.split('_').collect(&:capitalize).join('-'), v]}
                .sort
                .flatten]
    end

    def addHeaders(headers, request)
      headers.each do |key, value|
        request.add_field(key, value)
      end
    end

    def logRequestAndResponse(req, res)

      # Log Request to Optic

      logging_request = Net::HTTP.const_get(req.request_method.capitalize).new(req.fullpath)
      # Include Headers
      addHeaders(headerHash(req.env), logging_request)
      # Include body
      if req.body
        logging_request.body_stream = req.body
        logging_request.content_length = req.content_length.to_i
        logging_request.content_type = req.content_type if req.content_type
        logging_request.body_stream.rewind
      end

      # Send request to request logging endpoint
      http = Net::HTTP.new(@host, 30334)
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE

      logging_request_response = http.start do
        http.request(logging_request)
      end

      logging_request_response.code
      # Save the ID Optic assigns this request
      interactionId = logging_request_response.body || ""

      # Log Response to Optic
      resStatus, resHeaders, resBody = res

      logging_response = Net::HTTP.const_get("Post").new("/interactions/" + interactionId + "/status/" + resStatus.to_s)
      addHeaders(resHeaders, logging_response)
      if logging_response.request_body_permitted? && resBody
        bodyData = ""
        resBody.each do |line|
          bodyData << line
        end
        logging_response.body = bodyData
        logging_response.content_length = bodyData.bytesize.to_s
      end

      http = Net::HTTP.new(@host, 30335)
      logging_response_response = http.start do
        http.request(logging_response)
      end

    end
  end
end
