package com.geosumo.teamone.dao;

import com.geosumo.teamone.models.DynamicGraphs;
import com.geosumo.teamone.models.StaticGraphs;

import java.sql.SQLException;

import static com.geosumo.teamone.Helpers.getFromDatabasePrepared;
import static com.geosumo.teamone.queries.DataAggregationQueries.*;

public enum SimulationDao {
    INSTANCE;

    public String getListJson() throws SQLException {
        return getFromDatabasePrepared(GET_SIMULATIONS);
    }

    public String getMetadataJson(int id) throws SQLException {
        return getFromDatabasePrepared(GET_SIMULATION_BY_ID, id, id);
    }

    public String getVehiclesJson(int id, int from, int to) throws SQLException {
        return getFromDatabasePrepared(GET_TIME_STAMP, id, from, to);
    }

    public String getNodesJson(int id) throws SQLException {
        return getFromDatabasePrepared(GET_ALL_NODES, id);
    }

    public String getEdgesJson(int id) throws SQLException {
        return getFromDatabasePrepared(GET_ALL_EDGES, id);
    }

    public StaticGraphs getStaticGraphs(int id) throws SQLException {
        return new StaticGraphs(getFromDatabasePrepared(VEHICLE_PER_TIME_STEP, id), getFromDatabasePrepared(SPEED_PER_TIME_STEP, id));
    }

    public DynamicGraphs getDynamicGraphs(int id, int timestep) throws SQLException {
        return new DynamicGraphs(getFromDatabasePrepared(SLOWEST_VEHICLE_PER_TIME_STEP, id, timestep), getFromDatabasePrepared(BUSIEST_ROADS_PER_TIME_STEP, id, timestep));
    }
}
