class EchoServer

  def initialize(options = {})
  end

  def headerHash(message)
    Hash[*message.select {|k, v| k.start_with? 'HTTP_'}
              .collect {|k, v| [k.sub(/^HTTP_/, ''), v]}
              .collect {|k, v| [k.split('_').collect(&:capitalize).join('-'), v]}
              .sort
              .flatten]
  end

  def call(env)

    req = Rack::Request.new(env)
    headers = headerHash(env).clone

    # if req.body
    #   length = req.content_length.to_i
    #   contentType = req.content_type if req.content_type
    #   # headers["CONTENT-TYPE"] = contentType
    #   # headers["CONTENT-LENGTH"] = length.to_s
    # end

    # body = req.body
    status = 200

    if headers.has_key?('Return-Status')
      env["HTTP_RETURN_STATUS"].freeze
      status = Integer(env["HTTP_RETURN_STATUS"].dup)
      # puts a
    end

    response = Rack::Response.new
    response.status = status
    if req.body
      response.headers['Content-Type'] = req.content_type
      response.write(req.body.string)
    end
    response.to_a
  end
end