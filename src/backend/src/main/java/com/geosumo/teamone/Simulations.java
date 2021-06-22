package com.geosumo.teamone;

import com.geosumo.teamone.dao.SimulationDao;
import com.geosumo.teamone.models.DynamicGraphs;
import com.geosumo.teamone.models.StaticGraphs;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.SQLException;

@Path("/simulations")
public class Simulations {
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getSimulations() throws SQLException {
        return SimulationDao.INSTANCE.getListJson();
    }

    @GET
    @Path("{simulation_id}/metadata")
    @Produces(MediaType.APPLICATION_JSON)
    public String getMetadata(@PathParam("simulation_id") int id) throws SQLException {
        return SimulationDao.INSTANCE.getMetadataJson(id);
    }

    @GET
    @Path("{simulation_id}/vehicles")
    @Produces(MediaType.APPLICATION_JSON)
    public String getVehicles(@PathParam("simulation_id") int id,
                              @QueryParam("from") int from,
                              @QueryParam("to") int to) throws SQLException {
        return SimulationDao.INSTANCE.getVehiclesJson(id, from, to);
    }

    @Path("{simulation_id}/nodes")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getNodes(@PathParam("simulation_id") int id) throws SQLException {
        return SimulationDao.INSTANCE.getNodesJson(id);
    }

    @Path("{simulation_id}/edges")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getEdges(@PathParam("simulation_id") int id) throws SQLException {
        return SimulationDao.INSTANCE.getEdgesJson(id);
    }

    @Path("{simulation_id}/graphs/static")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public StaticGraphs getStaticGraphs(@PathParam("simulation_id") int id) throws SQLException {
        return SimulationDao.INSTANCE.getStaticGraphs(id);
    }

    @Path("{simulation_id}/graphs/dynamic")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public DynamicGraphs getDynamicGraphs(@PathParam("simulation_id") int id,
                                          @QueryParam("timestep") int timestep) throws SQLException {
        return SimulationDao.INSTANCE.getDynamicGraphs(id, timestep);
    }


    @Path("{simulation_id}/metadata")
    @POST
    @Consumes(MediaType.TEXT_PLAIN)
    public void postMetadata(String input) {
        System.out.println(input);
    }
}
