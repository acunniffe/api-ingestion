package com.useoptic.document.spring_boot;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.Enumeration;

import static org.springframework.core.Ordered.LOWEST_PRECEDENCE;

@Order(LOWEST_PRECEDENCE)
@Component
public class OpticDocumentingFilter implements Filter {

    @Override
    public void init(final FilterConfig filterConfig) throws ServletException {

    }
    /*
    Middleware forwards each request to the Request Logger (defaults to localhost:30334). Just change the base path of the URL to the Request Logger and send all the same headers and body.
    The Request Logger will respond with an interactionId in the body (text/plain, parse the whole thing as a string).
    Use the Response Logger (defaults to localhost:30335) to save the response by calling POST localhost:30335/interactions/{interactionId}/status/{response.statusCode}.
    In that request include the headers, and body returned by your server.
    Optic associates the response to the request you sent the Request Logger by using the interactionId.
     */
    @Override
    public void doFilter(
            final ServletRequest servletRequest,
            final ServletResponse servletResponse,
            final FilterChain filterChain
    ) throws IOException, ServletException {
        if (System.getenv("OPTIC_SERVER_LISTENING") == null) {
            System.out.println("skipping optic filter");
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        String loggingServerHost = System.getenv("OPTIC_SERVER_HOST");
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        // wait until the rest of the pipeline is done
        filterChain.doFilter(requestWrapper, responseWrapper);

        // now we can read the final bodies
        byte[] requestBody = requestWrapper.getContentAsByteArray();
        //System.out.println("request bytes " + Integer.toString(requestBody.length));
        byte[] responseBody = responseWrapper.getContentAsByteArray();
        responseWrapper.copyBodyToResponse();
        System.out.println("response bytes " + Integer.toString(responseBody.length));

        // log request
        ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        RestTemplate restTemplate = new RestTemplate(requestFactory);
        UriComponents requestLoggingServerUrl = UriComponentsBuilder
                .fromUriString(request.getRequestURI())
                .query(request.getQueryString())
                .scheme("http")
                .host(loggingServerHost)
                .port(30334)
                .build();

        System.out.println(requestLoggingServerUrl.toString());

        MultiValueMap<String, String> requestHeaders = new LinkedMultiValueMap<>();
        Enumeration<String> requestHeaderNames = request.getHeaderNames();
        while (requestHeaderNames.hasMoreElements()) {
            String headerName = requestHeaderNames.nextElement();
            Enumeration<String> values = request.getHeaders(headerName);
            while (values.hasMoreElements()) {
                String value = values.nextElement();
                requestHeaders.add(headerName, value);
                System.out.println(headerName + ": " + value);
            }
        }

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(requestBody, requestHeaders);
        try {


            ResponseEntity<String> interactionId = restTemplate.exchange(
                    requestLoggingServerUrl.toUri(),
                    HttpMethod.resolve(request.getMethod()),
                    requestEntity,
                    String.class
            );

            System.out.println("interactionId: " + interactionId.getBody());

            // log response
            UriComponents responseLoggingServerUrl = UriComponentsBuilder.newInstance()
                    .host(loggingServerHost)
                    .scheme("http")
                    .port(30335)
                    .pathSegment("interactions")
                    .pathSegment(interactionId.getBody())
                    .pathSegment("status")
                    .pathSegment(Integer.toString(responseWrapper.getStatusCode()))
                    .build();

            System.out.println(responseLoggingServerUrl.toString());

            MultiValueMap<String, String> responseHeaders = new LinkedMultiValueMap<>();
            Collection<String> responseHeaderNames = response.getHeaderNames();
            for (String headerName : responseHeaderNames) {
                Collection<String> values = response.getHeaders(headerName);
                for (String value : values) {
                    responseHeaders.add(headerName, value);
                    System.out.println(headerName + ": " + value);
                }
            }

            HttpEntity<byte[]> responseEntity = new HttpEntity<>(responseBody, responseHeaders);

            restTemplate.exchange(responseLoggingServerUrl.toUri(), HttpMethod.POST, responseEntity, Void.class);
        } catch (Exception e) {

        }
    }

    @Override
    public void destroy() {

    }
}
