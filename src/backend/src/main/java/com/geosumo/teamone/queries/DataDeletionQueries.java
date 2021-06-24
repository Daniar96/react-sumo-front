package com.geosumo.teamone.queries;

public class DataDeletionQueries {
    static public final String DELETE_SIMULATION = "DELETE FROM simulation\n" +
            "WHERE simulation.id = ?;";
}
