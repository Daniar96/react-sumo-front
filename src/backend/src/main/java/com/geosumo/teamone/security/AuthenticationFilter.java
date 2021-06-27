package com.geosumo.teamone.security;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import com.geosumo.teamone.models.ServerError;

import java.io.IOException;
import javax.annotation.Priority;
import javax.ws.rs.*;

@SecurityCheck
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

	private static final String AUTHENTICATION_HEADER = "Bearer";

	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {

		// Get the Authorization header from the request
		String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
		// Validate the Authorization header
		if (!isValidHeader(authorizationHeader)) {
			abortWithUnauthorized(requestContext);
			return;
		}
		String token = authorizationHeader.substring(AUTHENTICATION_HEADER.length()).trim();
		try {
			// Validate the token
			validateToken(token);

		} catch (Exception e) {
			abortWithUnauthorized(requestContext);
		}
	}

	private boolean isValidHeader(String authorizationHeader) {
		// Check if a header is valid (not null, starts with Bearer)
		return authorizationHeader != null
				&& authorizationHeader.toLowerCase().startsWith(AUTHENTICATION_HEADER.toLowerCase() + " ");
	}

	private void abortWithUnauthorized(ContainerRequestContext requestContext) {
		// Abort with 401 error and error message
		requestContext.abortWith(
				Response.status(Response.Status.UNAUTHORIZED).entity(new ServerError("Ivalid/expired token")).build());
	}

	private void validateToken(String token) throws Exception {
		TokenList.print();
		// Throw an Exception if the token is invalid
		if (!TokenList.validToken(token)) {
			throw new Exception();
		}
	}
}