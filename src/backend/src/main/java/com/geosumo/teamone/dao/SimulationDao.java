package com.geosumo.teamone.dao;

import com.geosumo.teamone.Helpers;
import com.geosumo.teamone.models.DynamicGraphs;
import com.geosumo.teamone.models.NewMetadata;
import com.geosumo.teamone.models.StaticGraphs;

import java.io.*;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Enumeration;
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

    public void createNewZipFile(String name, String description, ZipInputStream input) throws IOException, SQLException {
        StringBuilder sb = new StringBuilder();
        byte[] buffer = new byte[1024];
        int read = 0;
        List<String> files = new ArrayList<>();
        ZipEntry ze = null;
        while ((ze = input.getNextEntry()) != null) {
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
