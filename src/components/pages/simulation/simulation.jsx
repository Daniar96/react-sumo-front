import { useEffect, useState } from "react";
import { SylvereyeRoadNetwork } from "../../../lib/dash_sylvereye.react.min.js";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Link } from "react-router-dom";
import { API_BASE } from "../../../util.js";

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
};

export const SimulationPage = ({ match }) => {
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

  useEffect(() => console.log(timestepGraph), [timestepGraph]);

  async function loadTimestep() {
    setLoadingTimestep(true);

    setMarkers(
      (
        await (
          await fetch(
            `${API_BASE}/simulations/${match.params.id}/vehicles?from=${timestep}&to=${timestep}`
          )
        ).json()
      )[0].vehicles.map((vehicle) => ({
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
      }))
    );

    const graphDynamic = await (
      await fetch(
        `${API_BASE}/simulations/${match.params.id}/graphs/dynamic?timestep=${timestep}`
      )
    ).json();
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

    setLoadingTimestep(false);
  }

  useEffect(async () => {
    setLoading(true);

    setTimestep(0);
    loadTimestep();

    setMetadata(
      await (
        await fetch(`${API_BASE}/simulations/${match.params.id}/metadata`)
      ).json()
    );

    setNodes(
      (
        await (
          await fetch(`${API_BASE}/simulations/${match.params.id}/nodes`)
        ).json()
      ).map((node) => ({
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

    setEdges(
      (
        await (
          await fetch(`${API_BASE}/simulations/${match.params.id}/edges`)
        ).json()
      )
        .filter((edge) => edge.geometry !== null)
        .map((edge) => ({
          coords: edge.geometry.map((coord) =>
            coord.split(",").map(parseFloat).reverse()
          ),
          visible: true,
          alpha: 1.0,
          width: 0.25,
          color: 26262,
          data: {
            id: edge.id,
            start: edge.start,
            finish: edge.finish,
          },
        }))
    );

    const graphStatic = await (
      await fetch(`${API_BASE}/simulations/${match.params.id}/graphs/static`)
    ).json();
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
          <div className="mb-4 card">
            <SylvereyeRoadNetwork
              setProps={setProps}
              edges_data={edges}
              nodes_data={nodes}
              markers_data={markers}
              marker_options={marker_options}
              map_center={[edges[0].coords[0][0], edges[0].coords[0][1]]}
              map_zoom={map_zoom}
              map_style={map_style}
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
              {metadata.date}
            </div>
            <div>
              <b>Description: </b>
              {metadata.description}
            </div>
          </div>
          <div className="btn-group">
            <button className="btn btn-outline-secondary">Edit</button>
            <button className="btn btn-outline-primary">Download</button>
            <button className="btn btn-outline-danger">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};
