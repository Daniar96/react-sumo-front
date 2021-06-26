package com.geosumo.teamone.dao;

import com.geosumo.teamone.Helpers;
import com.geosumo.teamone.models.DynamicGraphs;
import com.geosumo.teamone.models.StaticGraphs;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static com.geosumo.teamone.Helpers.getFromDatabasePrepared;
import static com.geosumo.teamone.Helpers.updateDatabase;
import static com.geosumo.teamone.queries.DataAggregationQueries.*;
import static com.geosumo.teamone.queries.DataDeletionQueries.DELETE_SIMULATION;
import static com.geosumo.teamone.queries.DataInsertionQueries.INSERT_NEW_METADATA;

public enum SimulationDao {
    INSTANCE;

    public synchronized String getListJson() throws SQLException {
        return getFromDatabasePrepared(GET_SIMULATIONS);
    }

    public synchronized String getMetadataJson(int id) throws SQLException {
        return getFromDatabasePrepared(GET_SIMULATION_BY_ID, id, id);
    }

    public synchronized String getVehiclesJson(int id, int from, int to) throws SQLException {
        return getFromDatabasePrepared(GET_TIME_STAMP, id, from, to);
    }

    public synchronized String getNodesJson(int id) throws SQLException {
        return getFromDatabasePrepared(GET_ALL_NODES, id);
    }

    public synchronized String getEdgesJson(int id, int timestep) throws SQLException {
        return getFromDatabasePrepared(GET_ALL_EDGES_WITH_COUNT, id, id, id, id, timestep);
    }

    public synchronized StaticGraphs getStaticGraphs(int id) throws SQLException {
        return new StaticGraphs(getFromDatabasePrepared(VEHICLE_PER_TIME_STEP, id), getFromDatabasePrepared(SPEED_PER_TIME_STEP, id));
    }

    public synchronized DynamicGraphs getDynamicGraphs(int id, int timestep) throws SQLException {
        return new DynamicGraphs(getFromDatabasePrepared(SLOWEST_VEHICLE_PER_TIME_STEP, id, timestep), getFromDatabasePrepared(BUSIEST_ROADS_PER_TIME_STEP, id, timestep));
    }

    public synchronized void setMetadata(int id, String name, String description) throws SQLException{
        String[] params = new String[] {name, description};
        updateDatabase(INSERT_NEW_METADATA, params, id);
    }

    public synchronized void deleteSim(int id) throws SQLException {
        updateDatabase(DELETE_SIMULATION, new String[0], id);
    }

    public synchronized void createNewZipFile(String name, String description, ZipInputStream input) throws IOException, SQLException {
        System.out.println("uplaoding " + name + " simulation...");
        StringBuilder sb = new StringBuilder();
        byte[] buffer = new byte[1024];
        int read = 0;
        List<String> files = new ArrayList<>();
        ZipEntry ze = null;
        while ((ze = input.getNextEntry()) != null) {
            System.out.println("entry!");
            if (ze.toString().endsWith("net.xml") || ze.toString().endsWith(".sumocfg")) {
                continue;
            }
            while ((read = input.read(buffer, 0, 1024)) >= 0) {
                sb.append(new String(buffer, 0, read));
            }
            files.add(sb.toString());
            sb = new StringBuilder();
        }
        String[] s = new String[files.size()];
        files.toArray(s);
        Helpers.processFiles(name, description, s);

    }
}
