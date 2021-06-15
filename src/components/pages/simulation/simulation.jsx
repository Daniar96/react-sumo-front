import { useEffect, useState } from "react";
import { SylvereyeRoadNetwork } from "../../../lib/dash_sylvereye.react.min.js";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Link } from "../../../contexts/routerContext"
import { API_BASE } from "../../../util.js";

const map_center = [60.1663, 24.9313];
const map_zoom = 15;
const map_style = { width: "100%", height: "75vh" };
const tile_layer_url =
  "//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png";
const tile_layer_subdomains = "abcd";
const tile_layer_attribution =
  "Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://www.openstreetmap.org/copyright'>ODbL</a>.";
const tile_layer_opacity = 0.2;

export const SimulationPage = ({ match }) => {
  const [_props, setProps] = useState({});
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({});
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loadingTimestep, setLoadingTimestep] = useState(false);
  const [timestep, setTimestep] = useState(0);

  function loadTimestep() {
    setLoadingTimestep(true);

    setTimeout(() => {
      setLoadingTimestep(false);
    }, 1000);
  }

  useEffect(async () => {
    setLoading(true);

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
              map_center={[edges[50].coords[0][0], edges[50].coords[0][1]]}
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
              max={metadata.steps}
              value={timestep}
              onChange={(e) => setTimestep(e.target.value)}
              onMouseUp={() => loadTimestep()}
            />
          </div>
          <div className="row mb-4 gap-4 w-100 mx-auto">
            <div className="col card">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  title: { text: "Average turns taken by each car" },
                  series: [
                    {
                      data: [8, 4, 2, 1, 2, 4, 8, 16],
                    },
                    {
                      data: [1, 1, 2, 3, 5, 8, 13, 21],
                    },
                  ],
                }}
              />
            </div>
            <div className="col card">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  title: { text: "Number of vehicles on the road" },
                  series: [
                    {
                      data: [58, 3254, 23, 532, 6135],
                    },
                  ],
                }}
              />
            </div>
            <div className="col card">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  title: { text: "Something" },
                  series: [
                    {
                      data: [1, 1, 2, 3, 5, 8, 13, 21],
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
