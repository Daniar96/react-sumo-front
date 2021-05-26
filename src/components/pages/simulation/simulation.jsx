import { useState } from "react";
import { SylvereyeRoadNetwork } from "../../../lib/dash_sylvereye.react.min.js";

export const SimulationPage = ({ match }) => {
  const map_center = [60.1663, 24.9313];
  const map_zoom = 15;
  const map_style = { width: "100%", height: "100vh" };
  const tile_layer_url =
    "//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png";
  const tile_layer_subdomains = "abcd";
  const tile_layer_attribution =
    "Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://www.openstreetmap.org/copyright'>ODbL</a>.";
  const tile_layer_opacity = 0.2;
  const [props, setProps] = useState({});

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Simulation {match.params.id}</h1>
      <div className="mb-4">
        <SylvereyeRoadNetwork
          setProps={setProps}
          edges_data={[]}
          nodes_data={[]}
          map_center={map_center}
          map_zoom={map_zoom}
          map_style={map_style}
          tile_layer_url={tile_layer_url}
          tile_layer_subdomains={tile_layer_subdomains}
          tile_layer_attribution={tile_layer_attribution}
          tile_layer_opacity={tile_layer_opacity}
        />
      </div>
      <div className="row mb-4 gap-4 w-100 mx-auto">
        <div className="col card">
          a<br />1 a<br />1
        </div>
        <div className="col card">
          b<br />1 b<br />1
        </div>
        <div className="col card">
          c<br />1 c<br />1
        </div>
      </div>
      <div>
        <div>
          <b>Date: </b>April 10, 2020
        </div>
        <div>
          <b>Tags: </b>tag1 tag2 tag3
        </div>
        <div>
          <b>Location: </b>Helsinki, Finland
        </div>
        <div>
          <b>Time: </b>00:00 UTC
        </div>
        <div>
          <b>Extra: </b>a b c
        </div>
      </div>
    </div>
  );
};
