package com.geosumo.teamone;

import com.geosumo.teamone.dao.SimulationDao;
import com.geosumo.teamone.models.DynamicGraphs;
import com.geosumo.teamone.models.StaticGraphs;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;

import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

class SimulationTest {
    @Test
    void listTest() throws SQLException {
        JSONArray listJson = new JSONArray(SimulationDao.INSTANCE.getListJson());
        listJson.forEach((sim) -> {
            JSONObject object = (JSONObject) sim;
            assertTrue(object.getInt("id") >= 0);
            object.getString("date");
            object.getString("name");
            assertTrue(object.getInt("steps") >= 0);
            object.getString("description");
        });
    }

    @Test
    void metadataTest() throws SQLException {
        JSONObject metadataJson = new JSONObject(SimulationDao.INSTANCE.getMetadataJson(1));
        assertTrue(metadataJson.getInt("id") >= 0);
        metadataJson.getString("date");
        metadataJson.getString("name");
        assertTrue(metadataJson.getInt("steps") >= 0);
        metadataJson.getString("description");
    }

    @Test
    void vehiclesTest() throws SQLException {
        JSONArray timestepArray = new JSONArray(SimulationDao.INSTANCE.getVehiclesJson(1, 5, 10));
        for (int i = 0; i < timestepArray.length(); i++) {
            JSONObject ts = timestepArray.getJSONObject(i);
            assertEquals(ts.getInt("time_step"), i + 5);

            JSONArray vehicles = ts.getJSONArray("vehicles");
            for (Object vehicle : vehicles) {
                JSONObject object = (JSONObject) vehicle;
                object.getDouble("x");
                object.getDouble("y");
                object.getInt("id");
                object.getDouble("pos");
                object.getDouble("spd");
                object.getString("lane");
                object.getString("type");
                object.getDouble("angle");
                object.getDouble("slope");
            }
        }
    }

    @Test
    void nodesTest() throws SQLException {
        JSONArray timestepArray = new JSONArray(SimulationDao.INSTANCE.getNodesJson(1));
        timestepArray.forEach((node) -> {
            JSONObject object = (JSONObject) node;
            object.getDouble("lat");
            object.getDouble("lon");
            object.getString("id");
        });
    }

    @Test
    void edgesTest() throws SQLException {
        JSONArray edgesArray = new JSONArray(SimulationDao.INSTANCE.getEdgesJson(1, 100));
        int last = Integer.MAX_VALUE;
        for (int i = 0; i < edgesArray.length(); i++) {
            JSONObject edge = edgesArray.getJSONObject(i);
            assertTrue(last >= edge.getInt("count"));
            last = edge.getInt("count");
            edge.getDouble("x");
            edge.getDouble("y");
            edge.getString("start");
            edge.getString("finish");
            edge.getJSONArray("geometry");
        }
    }

    @Test
    void graphsTest() throws SQLException {
        StaticGraphs staticGraphs = SimulationDao.INSTANCE.getStaticGraphs(1);
        assertNotNull(staticGraphs.getCount());
        assertNotNull(staticGraphs.getSpeed());

        DynamicGraphs dynamicGraphs = SimulationDao.INSTANCE.getDynamicGraphs(1, 100);
        assertNotNull(dynamicGraphs.getBusiest());
        assertNotNull(dynamicGraphs.getSlowest());
    }
}
