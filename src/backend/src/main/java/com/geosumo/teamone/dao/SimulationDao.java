package com.geosumo.teamone.dao;

import com.geosumo.teamone.models.DynamicGraphs;
import com.geosumo.teamone.models.NewMetadata;
import com.geosumo.teamone.models.StaticGraphs;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static com.geosumo.teamone.Helpers.*;
import static com.geosumo.teamone.queries.DataAggregationQueries.*;
import static com.geosumo.teamone.queries.DataDeletionQueries.*;
import static com.geosumo.teamone.queries.DataInsertionQueries.*;

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

    public void setMetadata(int id, String name, String description) throws SQLException{
        String[] params = new String[] {name, description};
        updateDatabase(INSERT_NEW_METADATA, params, id);
    }

    public void deleteSim(int id) throws SQLException {
        updateDatabase(DELETE_SIMULATION, new String[0], id);
    }

    public void createNewZipFile(ZipInputStream input) throws IOException {
        List<String> files = new ArrayList<>();
        ZipEntry ze = null;
        while((ze = input.getNextEntry()) != null) {
        }
    }
}
