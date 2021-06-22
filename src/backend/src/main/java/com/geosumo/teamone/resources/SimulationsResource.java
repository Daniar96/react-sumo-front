package com.geosumo.teamone.resources;

import com.geosumo.teamone.dao.SimulationDao;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.UriInfo;
import java.sql.SQLException;

@Path("/simulations")
public class SimulationsResource {
    @Context
    private UriInfo uriInfo;
    @Context
    private Request request;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getSimulations() throws SQLException {
        return SimulationDao.INSTANCE.getListJson();
    }

    @Path("{simulation_id}")
    public SimulationResource getSimulation(@PathParam("simulation_id") int id) {
        return new SimulationResource(uriInfo, request, id);
    }
}
