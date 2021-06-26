package com.geosumo.teamone.queries;

public class DataAggregationQueries {
    public static final String GET_SIMULATIONS =
            "SELECT COALESCE(to_jsonb(array_agg(jsonobj.simdata)), '[]') " +
                    "FROM simulation s, " +
                    "     LATERAL (SELECT json_build_object('id', s.id, 'name', s.name, 'date', s.upload_date, 'description', " +
                    "                                       s.description, 'steps', count(DISTINCT o.time_step)) simdata " +
                    "              FROM output o " +
                    "              WHERE o.sim_id = s.id) jsonobj;";

    public static final String GET_SIMULATION_BY_ID =
            "SELECT COALESCE(jsonb_build_object('id', s.id, " +
                    "                          'name', s.name, " +
                    "                          'date', s.upload_date, " +
                    "                          'description', s.description, " +
                    "                          'steps', count(DISTINCT o.time_step)), '[]') " +
                    "FROM simulation s, " +
                    "     output o " +
                    "WHERE s.id = ? " +
                    "  AND o.sim_id = ? " +
                    "GROUP BY s.id;";

    public static final String GET_TIME_STAMP = "SELECT COALESCE(jsonb_agg(data), '[]') \n" +
            "FROM (\n" +
            "SELECT time_step, jsonb_agg(json_build_object('id', vehicle_id, 'x', x, 'y', y, 'angle', angle, 'type', type, 'spd', speed, 'pos', pos, 'lane', lane, 'slope', slope)) as vehicles\n" +
            "FROM geo_sumo.output out\n" +
            "WHERE out.sim_id = ?\n" +
            "AND out.time_step >= ?\n" +
            "AND out.time_step <= ?\n" +
            "GROUP BY time_step ) as data";

    public static final String GET_ALL_NODES =
            "SELECT COALESCE(to_jsonb(array_agg(nodes.data)), '[]') " +
                    "FROM node, " +
                    "     LATERAL ( SELECT jsonb_build_object('id', node_id, 'lon', x, 'lat', y) AS data) nodes " +
                    "WHERE sim_id = ?";

    public static final String GET_ALL_EDGES =
            "SELECT COALESCE(jsonb_agg(ultimateData.line), '[]')                    \n" +
                    "FROM (                                         \n" +
                    " SELECT json_build_object('id', e.edge_id, 'start', e.start, 'finish', e.finish,                                   \n" +
                    "                          'geometry', COALESCE(string_to_array(e.shape, ' '),  \n" +
                    "                          string_to_array(CONCAT(CONCAT(nst.x,',',nst.y), ' ', \n" +
                    "                          CONCAT(nfin.x,',',nfin.y)),' '))) AS line          \n" +
                    " FROM node nst, edge e, node nfin \n" +
                    " WHERE e.sim_id  = ? \n" +
                    " AND nst.sim_id  = ? \n" +
                    " AND nfin.sim_id = ? \n" +
                    " AND e.start = nst.node_id \n" +
                    " AND e.finish = nfin.node_id \n" +
                    " ORDER BY e.edge_id) AS ultimateData;";
    public static final String GET_ALL_EDGES_WITH_COUNT = "" +
            "SELECT COALESCE(jsonb_agg(ultimatedata), '[]')\n" +
            "FROM(\n" +
            "SELECT data.*, COUNT(out.sim_id) AS count\n" +
            "FROM (\n" +
            " SELECT e.edge_id AS id, e.start AS start, e.finish AS finish, \n" +
            "        COALESCE(string_to_array(e.shape, ' '), string_to_array(CONCAT(CONCAT(nst.x,',',nst.y), ' ', CONCAT(nfin.x,',',nfin.y)),' ')) AS geometry ,\n" +
            "        (nst.x+nfin.x)/2 as x, (nst.y+nfin.y)/2 as y                                         \n" +
            " FROM node nst, edge e, node nfin \n" +
            " WHERE e.sim_id  = ? \n" +
            " AND nst.sim_id  = ? \n" +
            " AND nfin.sim_id = ? \n" +
            " AND e.start = nst.node_id \n" +
            " AND e.finish = nfin.node_id \n" +
            " ORDER BY e.edge_id ) AS data\n" +
            "LEFT JOIN (\n" +
            " SELECT *\n" +
            " FROM output\n" +
            " WHERE output.sim_id = ?  \n" +
            " AND output.time_step = ? \n" +
            ") AS out\n" +
            "ON out.lane LIKE CONCAT(data.id, '$_%') ESCAPE '$'\n" +
            "GROUP BY data.id, data.start, data.finish, data.geometry, data.x, data.y\n" +
            "ORDER BY count DESC) AS ultimateData";



    public static final String VEHICLE_PER_TIME_STEP = "" +
            "SELECT COALESCE(jsonb_agg(data), '[]') " +
            "            FROM ( SELECT time_step, count(*) AS vehicles " +
            "                    FROM output " +
            "                    WHERE sim_id = ? " +
            "                    GROUP BY time_step" +
            "                    ORDER BY time_step) AS data;";

    public static final String SPEED_PER_TIME_STEP = "SELECT COALESCE(jsonb_agg(data), '[]') " +
            "                    FROM ( " +
            "                    SELECT time_step, AVG(speed) as averagespeed " +
            "                    FROM output " +
            "                    WHERE sim_id = ? " +
            "                    GROUP BY time_step" +
            "                    ORDER BY time_step) as data;";

    public static final String SLOWEST_VEHICLE_PER_TIME_STEP = "" +
            "SELECT COALESCE(jsonb_agg(data), '[]')                         \n" +
            "FROM ( SELECT vehicle_id AS ID, speed, x, y                    \n" +
            "       FROM output                                             \n" +
            "       WHERE sim_id = ?                                        \n" +
            "       AND time_step = ?                                       \n" +
            "       AND speed > 0                                           \n" +
            "       ORDER BY speed                                          \n" +
            "       LIMIT 10 ) AS data;                                     \n";

	public static final String GET_USER = "SELECT to_jsonb(data) FROM (SELECT u.email, u.hashedpassword, u.salt FROM users u WHERE u.email = ?) as data;";

    public static final String BUSIEST_ROADS_PER_TIME_STEP =
            "SELECT COALESCE(jsonb_agg(data), '[]')                         \n" +
                    "FROM(                                  \n" +
                    " SELECT DISTINCT edge_id, count, (n1.x+n2.x)/2 as x, (n1.y+n2.y)/2 as y\n" +
                    " FROM(\n" +
                    "  SELECT edge_id, start, finish, count(*) AS count\n" +
                    "  FROM output\n" +
                    "  INNER JOIN edge\n" +
                    "  ON output.lane LIKE CONCAT(edge.edge_id, '$_%') ESCAPE '$'\n" +
                    "  WHERE output.sim_id = ?\n" +
                    "  AND output.time_step = ?\n" +
                    "  GROUP by edge.edge_id, start, finish \n" +
                    "  ORDER by count DESC\n" +
                    "  LIMIT 10) as edge, node n1, node n2\n" +
                    " WHERE edge.start = n1.node_id\n" +
                    " AND edge.finish = n2.node_id\n" +
                    " ORDER BY count DESC) as data";

}
