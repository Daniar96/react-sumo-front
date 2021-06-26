package com.geosumo.teamone.resources;

import java.sql.SQLException;

import javax.ws.rs.*;
import javax.ws.rs.core.*;
import com.geosumo.teamone.dao.SimulationDao;
import com.geosumo.teamone.models.ServerError;
import com.geosumo.teamone.models.UserCredentials;
import com.geosumo.teamone.security.UsernameWithToken;

@Path("/login")
public class LoginResource {
	@Context
	private UriInfo uriInfo;
	@Context
	private Request request;

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response login(UserCredentials input) {
		try {
			boolean authorised = SimulationDao.INSTANCE.checkUser(input.getUsername(), input.getPassword());
			if (!authorised) {
				return Response.status(Response.Status.UNAUTHORIZED).entity(new ServerError("Wrong user credentials")).build();
			} else {
				UsernameWithToken ut = new UsernameWithToken(input.getUsername());
				return Response.status(Response.Status.OK).entity(ut).build();
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(new ServerError("SQL error")).build();
			
		}

	}

	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public void register(UserCredentials input) throws SQLException {
		SimulationDao.INSTANCE.registerUser(input.getUsername(), input.getPassword());
		// TODO
	}
}
