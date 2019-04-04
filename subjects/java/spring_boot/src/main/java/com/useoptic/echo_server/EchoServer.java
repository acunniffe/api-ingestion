package com.useoptic.echo_server;

import org.apache.commons.io.IOUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.ContentCachingRequestWrapper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

@SpringBootApplication
@Controller
public class EchoServer {

    public static void main(String[] args) {
        System.out.println("main args: " + Arrays.toString(args));
        System.out.println("OPTIC_SERVER_LISTENING: " + System.getenv("OPTIC_SERVER_LISTENING"));
        System.out.println("OPTIC_SERVER_HOST: " + System.getenv("OPTIC_SERVER_HOST"));
        System.out.println("OPTIC_SERVER_PORT: " + System.getenv("OPTIC_SERVER_PORT"));
        SpringApplication app = new SpringApplication(EchoServer.class);
        app.setDefaultProperties(Collections.singletonMap("server.port", System.getenv("OPTIC_SERVER_PORT")));
        app.run(args);
    }

    /*
        A request to any path in the API should be accepted
        Returns all request headers as response headers
        Returns request body as response body (with correct content-type and content-length)
        Status code defaults to 200, if a header named return-status is passed, the integer value of it will be the status code of the response
     */
    @RequestMapping(
            value = "/**",
            consumes = MediaType.ALL_VALUE,
            produces = MediaType.ALL_VALUE,
            method = {
                    RequestMethod.GET,
                    RequestMethod.POST,
                    RequestMethod.PUT,
                    RequestMethod.DELETE,
                    RequestMethod.OPTIONS
            })
    public ResponseEntity echo(
            HttpServletResponse response,
            HttpServletRequest request,
            @RequestHeader(required = false) HttpHeaders headers,
            @RequestHeader(name = "return-status", required = false) Integer responseStatusOverride
    ) throws IOException {
        System.out.println("echoing");
        int status;
        if (responseStatusOverride == null) {
            status = 200;
        } else {
            status = responseStatusOverride;
        }
        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        byte[] requestBody = IOUtils.toByteArray(requestWrapper.getInputStream());
        //System.out.println("request body bytes: " + Integer.toString(requestBody.length));
        ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(requestBody, headers, HttpStatus.resolve(status));
        //System.out.println("maybe echoed");
        return responseEntity;
    }
}
