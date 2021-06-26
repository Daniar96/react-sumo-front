package com.geosumo.teamone.queries;

public class DataCreationQueries {
    public static final String CREATE = "CREATE SCHEMA IF NOT EXISTS geo_sumo; SET search_path = geo_sumo;  " +
            "" +
            "CREATE TABLE IF NOT EXISTS simulation (                                    \n" +
            "\tid          SERIAL PRIMARY KEY,                                          \n" +
            "\tname        TEXT NOT NULL,                                               \n" +
            "\tupload_date TIMESTAMP DEFAULT current_timestamp,                         \n" +
            "\tdescription TEXT );" +
            "\n" +
            "CREATE TABLE IF NOT EXISTS node (                                          \n" +
            "\tsim_id  SERIAL REFERENCES simulation (id) ON DELETE CASCADE NOT NULL,    \n" +
            "\tnode_id TEXT                                                NOT NULL,    \n" +
            "\tx       NUMERIC                                             NOT NULL,    \n" +
            "\ty       NUMERIC                                             NOT NULL,    \n" +
            "\ttype    TEXT,                                                            \n" +
            "\tPRIMARY KEY (sim_id, node_id) );                                         \n" +
            "\n" +
            "CREATE TABLE IF NOT EXISTS node_data (                                     \n" +
            "\tsim_id  SERIAL REFERENCES simulation (id) ON DELETE CASCADE NOT NULL,    \n" +
            "\tnode_id TEXT                                                NOT NULL,    \n" +
            "\tkey     TEXT                                                NOT NULL,    \n" +
            "\tvalue   TEXT                                                NOT NULL,    \n" +
            "\tPRIMARY KEY (sim_id, node_id),                                           \n" +
            "FOREIGN KEY (sim_id, node_id) REFERENCES node (sim_id, node_id) " +
            "       ON DELETE CASCADE );                                                \n" +
            "\n" +
            "CREATE TABLE IF NOT EXISTS node_tl (                                       \n" +
            "\tsim_id  SERIAL REFERENCES simulation (id) ON DELETE CASCADE NOT NULL,    \n" +
            "\tnode_id TEXT                                                NOT NULL,    \n" +
            "\ttl_id   TEXT                                                NOT NULL,    \n" +
            "\tPRIMARY KEY (sim_id, node_id),                                           \n" +
            "\tFOREIGN KEY (sim_id, node_id) REFERENCES node (sim_id, node_id) " +
            "       ON DELETE CASCADE );                                                \n" +
            "\n" +
            "CREATE TABLE IF NOT EXISTS route (                                         \n" +
            "\tsim_id     SERIAL REFERENCES simulation (id) ON DELETE CASCADE NOT NULL, \n" +
            "\tvehicle_id INT                                                 NOT NULL, \n" +
            "\tdepart     NUMERIC                                             NOT NULL, \n" +
            "\tedges      TEXT                                                NOT NULL, \n" +
            "\tPRIMARY KEY (sim_id, vehicle_id) );                                      \n" +
            "\n" +
            "CREATE TABLE IF NOT EXISTS edge (                                          \n" +
            "\tsim_id     SERIAL REFERENCES simulation (id) ON DELETE CASCADE NOT NULL, \n" +
            "\tedge_id    TEXT                                                NOT NULL, \n" +
            "\tstart      TEXT                                                NOT NULL, \n" +
            "\tfinish     TEXT                                                NOT NULL, \n   " +
            "\tpriority   NUMERIC,                                                      \n" +
            "\ttype       TEXT                                                NOT NULL, \n" +
            "\tnum_lanes  NUMERIC                                             NOT NULL, \n" +
            "\tspeed      NUMERIC                                             NOT NULL, \n" +
            "\tshape      TEXT,                                                         \n" +
            "\tspread_type TEXT,                                                        \n" +
            "\tlength     NUMERIC,                                                      \n" +
            "\twidth       NUMERIC,                                                     \n" +
            "\tname        TEXT,                                                        \n" +
            "\tallow       TEXT,                                                        \n" +
            "\tdisallow    TEXT,                                                        \n" +
            "\tPRIMARY KEY (sim_id, edge_id),                                           \n" +
            "\tFOREIGN KEY (sim_id, start) REFERENCES node (sim_id, node_id) " +
            "       ON DELETE CASCADE,                                                  \n" +
            "\tFOREIGN KEY (sim_id, finish) REFERENCES node (sim_id, node_id) " +
            "       ON DELETE CASCADE );                                                \n" +
            "\n" +
            "CREATE TABLE IF NOT EXISTS edge_lane (                                     \n" +
            "\tsim_id       SERIAL REFERENCES simulation (id) " +
            "                                               ON DELETE CASCADE NOT NULL, \n" +
            "\tedge_id      TEXT                                              NOT NULL, \n" +
            "\tline_id      INT,                                                        \n" +
            "\tacceleration INT,                                                        \n" +
            "\tallow        TEXT,                                                       \n" +
            "\tdisallow     TEXT,                                                       \n" +
            "\tspeed        NUMERIC,                                                    \n" +
            "\twidth        NUMERIC,                                                    \n" +
            "\tPRIMARY KEY (sim_id, edge_id, line_id),                                  \n" +
            "\tFOREIGN KEY (sim_id, edge_id) REFERENCES edge (sim_id, edge_id) " +
            "                                               ON DELETE CASCADE );        \n" +
            "\n" +
            "CREATE TABLE IF NOT EXISTS edge_data (                                     \n" +
            "\tsim_id  SERIAL REFERENCES simulation (id) ON DELETE CASCADE NOT NULL,    \n" +
            "\tedge_id TEXT                                                NOT NULL,    \n" +
            "\tkey     TEXT                                                NOT NULL,    \n" +
            "\tvalue   TEXT                                                NOT NULL,    \n" +
            "\tPRIMARY KEY (sim_id, edge_id),                                           \n" +
            "\tFOREIGN KEY (sim_id, edge_id) REFERENCES edge (sim_id, edge_id) " +
            "                                            ON DELETE CASCADE );           \n" +
            "\n" +
            "CREATE TABLE IF NOT EXISTS output (                                        \n" +
            "\tsim_id     SERIAL REFERENCES simulation (id) ON DELETE CASCADE NOT NULL, \n" +
            "\ttime_step  INT                                                 NOT NULL, \n" +
            "\tvehicle_id INT                                                 NOT NULL, \n" +
            "\tx          NUMERIC                                             NOT NULL, \n" +
            "\ty          NUMERIC                                             NOT NULL, \n" +
            "\tangle      NUMERIC                                             NOT NULL, \n" +
            "\ttype       TEXT                                                NOT NULL, \n" +
            "\tspeed      NUMERIC                                             NOT NULL, \n" +
            "\tpos        NUMERIC                                             NOT NULL, \n" +
            "\tslope      NUMERIC                                             NOT NULL, \n" +
            "\tlane       TEXT                                                NOT NULL, \n" +
            "\tPRIMARY KEY (sim_id, time_step, vehicle_id) );                           \n" +
            "\n" +
            "CREATE TABLE IF NOT EXISTS roundabout (                                    \n" +
            "\tsim_id        SERIAL REFERENCES simulation (id) " +
            "                                           ON DELETE CASCADE NOT NULL,     \n" +
            "\troundabout_id INT                                          NOT NULL,     \n" +
            "\tedges         TEXT                                         NOT NULL,     \n" +
            "\tnodes         TEXT,                                                      \n" +
            "\tPRIMARY KEY (sim_id, roundabout_id) );                                   \n" +
            "\n" +
            "CREATE TABLE IF NOT EXISTS files (                                         \n" +
            "\tid     SERIAL PRIMARY KEY,                                               \n" +
            "\toutput TEXT,                                                             \n" +
            "\troutes TEXT,                                                             \n" +
            "\tedges  TEXT,                                                             \n" +
            "\tnodes  TEXT );" +
            "CREATE TABLE IF NOT EXISTS users (" +
            "\tid SERIAL PRIMARY KEY,                                                   \n" +
            "\temail TEXT NOT NULL UNIQUE,                                              \n" +
            "\thashed_password VARCHAR NOT NULL, salt  VARCHAR );";

    public static final String DROP = "DROP TABLE IF EXISTS simulation CASCADE; " +
            "DROP TABLE IF EXISTS node CASCADE; " +
            "DROP TABLE IF EXISTS node_tl CASCADE; " +
            "DROP TABLE IF EXISTS node_data CASCADE; " +
            "DROP TABLE IF EXISTS roundabout CASCADE; " +
            "DROP TABLE IF EXISTS route CASCADE; " +
            "DROP TABLE IF EXISTS edge CASCADE; " +
            "DROP TABLE IF EXISTS edge_allow CASCADE; " +
            "DROP TABLE IF EXISTS edge_disallow CASCADE; " +
            "DROP TABLE IF EXISTS edge_data CASCADE; " +
            "DROP TABLE IF EXISTS edge_lane CASCADE; " +
            "DROP TABLE IF EXISTS output CASCADE; " +
            "DROP TABLE IF EXISTS files CASCADE;";
}
