import { useEffect, useState } from "react";
import {
  SylvereyeRoadNetwork,
  EdgeAlphaMethod,
  EdgeWidthMethod,
} from "react-sylvereye";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Link } from "../../../contexts/routerContext";
import { API_BASE } from "../../../util.js";
import {useUserState} from "../../../contexts/userContext";

const map_zoom = 15;
const map_style = { width: "100%", height: "75vh" };
const tile_layer_url =
  "//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png";
const tile_layer_subdomains = "abcd";
const tile_layer_attribution =
  "Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://www.openstreetmap.org/copyright'>ODbL</a>.";
const tile_layer_opacity = 0.2;
const marker_options = {
  ...SylvereyeRoadNetwork.defaultProps.marker_options,
  enable_tooltips: true,
  enable_zoom_scaling: true,
};

export const SimulationPage = ({ match }) => {
  const { token } = useUserState()
  const authParams = {
      withCredentials: true,
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    };
  const [_props, setProps] = useState({});
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({});
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loadingTimestep, setLoadingTimestep] = useState(false);
  const [timestep, setTimestep] = useState(0);
  const [markers, setMarkers] = useState([]);
  const [vehiclesGraph, setVehiclesGraph] = useState({ count: [], speed: [] });
  const [timestepGraph, setTimestepGraph] = useState({
    slowest: [],
    busiest: [],
  });
  const [show, setShow] = useState({
    markerType: "0",
    nodes: true,
    edges: true,
    markers: true,
    alpha: false,
    scale: false,
  });
  const [potentialMarkers, setPotentialMarkers] = useState({
    all: [],
    slow: [],
    busiest: [],
  });
  const [edgeOptions, setEdgeOptions] = useState({
    ...SylvereyeRoadNetwork.defaultProps.edge_options,
    alpha_method: EdgeAlphaMethod.SCALE,
    alpha_scale_field: "vehicles",
    width_method: EdgeWidthMethod.SCALE,
    width_scale_field: "vehicles",
    alpha_min: 0.2,
  });

  useEffect(() => {
    setEdgeOptions({
      ...edgeOptions,
      alpha_method: show.alpha
        ? EdgeAlphaMethod.SCALE
        : EdgeAlphaMethod.DEFAULT,
      width_method: show.scale
        ? EdgeWidthMethod.SCALE
        : EdgeWidthMethod.DEFAULT,
    });
  }, [show.alpha, show.scale]);

  useEffect(() => {
    switch (show.markerType) {
      case "0":
        setMarkers(potentialMarkers.all);
        break;
      case "1":
        setMarkers(potentialMarkers.busiest);
        break;
      case "2":
        setMarkers(potentialMarkers.slow);
        break;
    }
  }, [potentialMarkers, show.markerType]);

  function deleteSimulation() {
    if (confirm("Are you sure you want to delete this simulation?")) {
      fetch(`${API_BASE}/simulations/${match.params.id}`, {
        method: "DELETE",
        ...authParams
      }).then(() => {
        window.location.href = "/dashboard";
      });
    }
  }

  async function loadTimestep() {
    setLoadingTimestep(true);

    const [fGraphDynamic, fVehicles, fEdges] = await Promise.all([
      await fetch(
        `${API_BASE}/simulations/${match.params.id}/graphs/dynamic?timestep=${timestep}`,
        { method: "GET", ...authParams}
      ),
      await fetch(
        `${API_BASE}/simulations/${match.params.id}/vehicles?from=${timestep}&to=${timestep}`,
        { method: "GET", ...authParams}
      ),
      await fetch(
        `${API_BASE}/simulations/${match.params.id}/edges?timestep=${timestep}`,
      { method: "GET", ...authParams}
      ),
    ]);

    const graphDynamic = await fGraphDynamic.json();
    setTimestepGraph({
      slowest: graphDynamic.slowest.map((slowest) => [
        slowest.id.toString(),
        slowest.speed,
      ]),
      busiest: graphDynamic.busiest.map((busiest) => [
        busiest.edge_id,
        busiest.count,
      ]),
    });

    setPotentialMarkers({
      slow: graphDynamic.slowest.map((slowest) => ({
        icon_id: "vehicle_marker",
        icon_image:
          "<svg height='100' width='100'><circle cx='50' cy='50' r='40' stroke='black' stroke-width='3' fill='red' /></svg>",
        lon: slowest.x,
        lat: slowest.y,
        color: 0x066cc,
        visible: true,
        alpha: 1.0,
        size: 0.25,
        size_scale_min: 0.25,
        size_scale_max: 0.5,
        data: slowest,
        tooltip: `
          <b>ID: </b>${slowest.id}<br/>
          <b>Speed: </b>${slowest.speed}
        `,
      })),
      busiest: graphDynamic.busiest.map((busiest) => ({
        icon_id: "vehicle_marker",
        icon_image:
          "<svg height='100' width='100'><circle cx='50' cy='50' r='40' stroke='black' stroke-width='3' fill='red' /></svg>",
        lon: busiest.x,
        lat: busiest.y,
        color: 0x066cc,
        visible: true,
        alpha: 1.0,
        size: 0.25,
        size_scale_min: 0.25,
        size_scale_max: 0.5,
        data: busiest,
        tooltip: `
          <b>ID: </b>${busiest.edge_id}<br/>
          <b>Number of vehicles: </b>${busiest.count}
        `,
      })),
      all: (await fVehicles.json())[0].vehicles.map((vehicle) => ({
        icon_id: "vehicle_marker",
        icon_image:
          "<svg height='100' width='100'><circle cx='50' cy='50' r='40' stroke='black' stroke-width='3' fill='red' /></svg>",
        lon: vehicle.x,
        lat: vehicle.y,
        color: 0x066cc,
        visible: true,
        alpha: 1.0,
        size: 0.25,
        size_scale_min: 0.25,
        size_scale_max: 0.5,
        data: vehicle,
        tooltip: `
          <b>ID: </b>${vehicle.id}<br/>
          <b>Speed: </b>${vehicle.spd}<br/>
          <b>Type: </b>${vehicle.type}
        `,
      })),
    });

    setEdges(
      (await fEdges.json()).map((edge) => {
        return {
          coords: edge.geometry.map((coord) =>
            coord.split(",").map(parseFloat).reverse()
          ),
          visible: true,
          alpha: 1.0,
          width: 0.25,
          color: 26262,
          data: {
            vehicles: edge.count,
            id: edge.id,
            start: edge.start,
            finish: edge.finish,
          },
        };
      })
    );

    setLoadingTimestep(false);
  }

  useEffect(async () => {
    setLoading(true);

    const [fMetadata, fNodes, fGraphStatic] = await Promise.all([
      await fetch(`${API_BASE}/simulations/${match.params.id}/metadata`, authParams),
      await fetch(`${API_BASE}/simulations/${match.params.id}/nodes`, authParams),
      await fetch(`${API_BASE}/simulations/${match.params.id}/graphs/static`, authParams),
    ]);

    setMetadata(await fMetadata.json());

    setNodes(
      (await fNodes.json()).map((node) => ({
        lon: node.lon,
        lat: node.lat,
        visible: true,
        alpha: 1.0,
        size: 0.005,
        color: 10551296,
        data: {
          id: node.id,
        },
      }))
    );

    const graphStatic = await fGraphStatic.json();
    setVehiclesGraph({
      count: graphStatic.count.map((count) => [
        count.time_step,
        count.vehicles,
      ]),
      speed: graphStatic.speed.map((speed) => [
        speed.time_step,
        speed.averagespeed,
      ]),
    });

    setTimestep(0);
    loadTimestep();

    setLoading(false);
  }, [match.params.id]);

  return (
    <div className="container my-4">
      {loading ? (
        <div>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">
              Simulation {match.params.id}
            </li>
          </ol>
          <div class="d-flex justify-content-center">
            <div class="spinner-border" />
          </div>
        </div>
      ) : (
        <div>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">{metadata.name}</li>
          </ol>
          <h1 className="text-center mb-4">{metadata.name}</h1>
          <div className="mb-2 d-flex align-items-center justify-content-between">
            <div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="show-nodes"
                  checked={show.nodes}
                  onChange={(e) =>
                    setShow({ ...show, nodes: e.target.checked })
                  }
                />
                <label class="form-check-label" for="show-nodes">
                  Show nodes
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="show-edges"
                  checked={show.edges}
                  onChange={(e) =>
                    setShow({ ...show, edges: e.target.checked })
                  }
                />
                <label class="form-check-label" for="show-edges">
                  Show edges
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="show-markers"
                  checked={show.markers}
                  onChange={(e) =>
                    setShow({ ...show, markers: e.target.checked })
                  }
                />
                <label class="form-check-label" for="show-markers">
                  Show markers
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="show-alpha"
                  checked={show.alpha}
                  onChange={(e) =>
                    setShow({ ...show, alpha: e.target.checked })
                  }
                />
                <label class="form-check-label" for="show-alpha">
                  Edge busyness by alpha
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="show-scale"
                  checked={show.scale}
                  onChange={(e) =>
                    setShow({ ...show, scale: e.target.checked })
                  }
                />
                <label class="form-check-label" for="show-scale">
                  Edge busyness by scale
                </label>
              </div>
            </div>
            <select
              class="form-select"
              style={{ width: "auto" }}
              value={show.markerType}
              onChange={(e) => setShow({ ...show, markerType: e.target.value })}
            >
              <option selected value="0">
                Show all vehicles
              </option>
              <option value="1">Show busiest edges</option>
              <option value="2">Show slowest vehicles</option>
            </select>
          </div>
          <div className="mb-4 card">
            <SylvereyeRoadNetwork
              setProps={setProps}
              edges_data={edges}
              nodes_data={nodes}
              markers_data={markers}
              marker_options={marker_options}
              edge_options={edgeOptions}
              map_center={[nodes[0].lat, nodes[0].lon]}
              map_zoom={map_zoom}
              map_style={map_style}
              show_nodes={show.nodes}
              show_edges={show.edges}
              show_arrows={show.edges}
              show_markers={show.markers}
              tile_layer_url={tile_layer_url}
              tile_layer_subdomains={tile_layer_subdomains}
              tile_layer_attribution={tile_layer_attribution}
              tile_layer_opacity={tile_layer_opacity}
            />
            {loadingTimestep && (
              <div class="overlay-spinner d-flex justify-content-center align-items-center">
                <div class="spinner-border text-light" />
              </div>
            )}
          </div>
          <div>
            <label class="form-label">Current timestep: {timestep}</label>
            <input
              type="range"
              class="mb-4 form-range"
              min="0"
              max={metadata.steps - 1}
              value={timestep}
              onChange={async (e) => setTimestep(e.target.value)}
              onMouseUp={() => loadTimestep()}
            />
          </div>
          <div className="row mb-4 gap-4 w-100 mx-auto">
            <div className="col card">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  title: { text: "Slowest vehicles this timestep" },
                  chart: { type: "column" },
                  xAxis: { title: { text: "Vehicle ID" }, type: "category" },
                  yAxis: { title: { text: "Speed (m/s)" } },
                  series: [
                    {
                      name: "Vehicle speed",
                      data: timestepGraph.slowest,
                      color: "red",
                      showInLegend: false,
                    },
                  ],
                }}
              />
              {loadingTimestep && (
                <div class="overlay-spinner d-flex justify-content-center align-items-center">
                  <div class="spinner-border text-light" />
                </div>
              )}
            </div>
            <div className="col card">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  title: { text: "Busiest edges this timestep" },
                  chart: { type: "column" },
                  xAxis: { title: { text: "Edge ID" }, type: "category" },
                  yAxis: { title: { text: "Number of vehicles" } },
                  series: [
                    {
                      name: "Number of vehicles",
                      data: timestepGraph.busiest,
                      color: "red",
                      showInLegend: false,
                    },
                  ],
                }}
              />
              {loadingTimestep && (
                <div class="overlay-spinner d-flex justify-content-center align-items-center">
                  <div class="spinner-border text-light" />
                </div>
              )}
            </div>
          </div>
          <div className="row mb-4 gap-4 w-100 mx-auto">
            <div className="col card">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  title: { text: "Average vehicle speed over time" },
                  xAxis: { title: { text: "Timestep" } },
                  yAxis: { title: { text: "Average speed (m/s)" } },
                  series: [
                    {
                      name: "Average speed",
                      data: vehiclesGraph.speed,
                      showInLegend: false,
                    },
                  ],
                }}
              />
            </div>
            <div className="col card">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  title: { text: "Number of vehicles over time" },
                  xAxis: { title: { text: "Timestep" } },
                  yAxis: { title: { text: "Vehicles" } },
                  series: [
                    {
                      name: "Number of vehicles",
                      data: vehiclesGraph.count,
                      showInLegend: false,
                    },
                  ],
                }}
              />
            </div>
          </div>
          <div className="mb-4">
            <div>
              <b>Date: </b>
              {new Date(metadata.date).toLocaleString()}
            </div>
            <div>
              <b>Description: </b>
              {metadata.description}
            </div>
          </div>
          <div className="btn-group">
            <Link
              to={`/edit/${match.params.id}`}
              className="btn btn-outline-secondary"
            >
              Edit
            </Link>
            <button
              className="btn btn-outline-danger"
              onClick={deleteSimulation}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
