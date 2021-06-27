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

	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {

		// Get the Authorization header from the request
		String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
		System.out.println("Request recieved header: " + authorizationHeader);

		// Validate the Authorization header
		if (!isValidToken(authorizationHeader)) {
			System.out.println("Header is invalid");
			abortWithUnauthorized(requestContext);
			return;
		}

		try {
			// Validate the token
			validateToken(authorizationHeader);

		} catch (Exception e) {
			abortWithUnauthorized(requestContext);
		}
	}

	private boolean isValidToken(String authorizationHeader) {
		// Check if a header is valid (not null)
		return authorizationHeader != null;
	}

	private void abortWithUnauthorized(ContainerRequestContext requestContext) {
		// Abort with 401 error and error message
		System.out.println("Return 401");
		requestContext.abortWith(
				Response.status(Response.Status.UNAUTHORIZED).entity(new ServerError("Ivalid/expired token")).build());
	}

	private void validateToken(String token) throws Exception {
		System.out.println("Validation");
		TokenList.print();
		// Throw an Exception if the token is invalid
		if (token.equals("")) {
			throw new Exception();
		}
	}
}