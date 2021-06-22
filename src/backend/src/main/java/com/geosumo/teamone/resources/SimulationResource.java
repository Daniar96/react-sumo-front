package com.geosumo.teamone.resources;

import com.geosumo.teamone.dao.SimulationDao;
import com.geosumo.teamone.models.DynamicGraphs;
import com.geosumo.teamone.models.StaticGraphs;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.UriInfo;
import java.sql.SQLException;

public class SimulationResource {
    @Context
    private UriInfo uriInfo;
    @Context
    private Request request;

    private int id;

    public SimulationResource(UriInfo uriInfo, Request request, int id) {
        this.uriInfo = uriInfo;
        this.request = request;
        this.id = id;
    }

    @GET
    @Path("metadata")
    @Produces(MediaType.APPLICATION_JSON)
    public String getMetadata() throws SQLException {
        return SimulationDao.INSTANCE.getMetadataJson(id);
    }

    @GET
    @Path("vehicles")
    @Produces(MediaType.APPLICATION_JSON)
    public String getVehicles(@QueryParam("from") int from,
                              @QueryParam("to") int to) throws SQLException {
        return SimulationDao.INSTANCE.getVehiclesJson(id, from, to);
    }

    @Path("nodes")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getNodes() throws SQLException {
        return SimulationDao.INSTANCE.getNodesJson(id);
    }

    @Path("edges")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getEdges() throws SQLException {
        return SimulationDao.INSTANCE.getEdgesJson(id);
    }

    @Path("graphs/static")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public StaticGraphs getStaticGraphs() throws SQLException {
        return SimulationDao.INSTANCE.getStaticGraphs(id);
    }

    @Path("graphs/dynamic")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public DynamicGraphs getDynamicGraphs(@QueryParam("timestep") int timestep) throws SQLException {
        return SimulationDao.INSTANCE.getDynamicGraphs(id, timestep);
    }


    @Path("metadata")
    @POST
    @Consumes(MediaType.TEXT_PLAIN)
    public void postMetadata(String input) {
        System.out.println(input);
    }
}
