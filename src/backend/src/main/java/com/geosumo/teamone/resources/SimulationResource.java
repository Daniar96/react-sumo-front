package com.geosumo.teamone.resources;

import com.geosumo.teamone.dao.SimulationDao;
import com.geosumo.teamone.models.DynamicGraphs;
import com.geosumo.teamone.models.NewMetadata;
import com.geosumo.teamone.models.StaticGraphs;
import com.geosumo.teamone.security.SecurityCheck;

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

	@SecurityCheck
	@GET
	@Path("metadata")
	@Produces(MediaType.APPLICATION_JSON)
	public String getMetadata() throws SQLException {
		return SimulationDao.INSTANCE.getMetadataJson(id);
	}

	@SecurityCheck
	@GET
	@Path("vehicles")
	@Produces(MediaType.APPLICATION_JSON)
	public String getVehicles(@QueryParam("from") int from, @QueryParam("to") int to) throws SQLException {
		return SimulationDao.INSTANCE.getVehiclesJson(id, from, to);
	}

	@SecurityCheck
	@Path("nodes")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getNodes() throws SQLException {
		return SimulationDao.INSTANCE.getNodesJson(id);
	}

	@SecurityCheck
	@Path("edges")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getEdges(@QueryParam("timestep") int timestep) throws SQLException {
		return SimulationDao.INSTANCE.getEdgesJson(id, timestep);
	}

	@SecurityCheck
	@Path("graphs/static")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public StaticGraphs getStaticGraphs() throws SQLException {
		return SimulationDao.INSTANCE.getStaticGraphs(id);
	}

	@SecurityCheck
	@Path("graphs/dynamic")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public DynamicGraphs getDynamicGraphs(@QueryParam("timestep") int timestep) throws SQLException {
		return SimulationDao.INSTANCE.getDynamicGraphs(id, timestep);
	}

	@SecurityCheck
	@Path("metadata")
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON })
	public void postMetadata(NewMetadata input) throws SQLException {
		SimulationDao.INSTANCE.setMetadata(id, input.getName(), input.getDescription());
	}

	@SecurityCheck
	@DELETE
	public void deleteSimulation() throws SQLException {
		SimulationDao.INSTANCE.deleteSim(id);
	}
}
