package com.geosumo.teamone.resources;

import com.geosumo.teamone.dao.SimulationDao;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.UriInfo;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.zip.ZipInputStream;

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

    @POST
    @Consumes("application/zip")
    public void uploadSimulation(@QueryParam("name") String name,
                                 @QueryParam("description") String description,
                                 InputStream input) throws IOException, SQLException {
        SimulationDao.INSTANCE.createNewZipFile(name, description, new ZipInputStream(input));
    }
}
