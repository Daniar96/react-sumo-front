package com.geosumo.teamone.queries;

public class DataDeletionQueries {
    public static final String DELETE_SIMULATION = "DELETE FROM simulation\n" +
            "WHERE simulation.id = ?;";
}
