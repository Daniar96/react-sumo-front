import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../../util";

export const DashboardPage = () => {
  const [search, setSearch] = useState("");
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/simulations`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);

        setSimulations([
          ...simulations,
          ...json.map((simulation) => ({
            id: simulation.id,
            name: simulation.name,
            date: simulation.date,
            description: simulation.description,
          })),
        ]);
      })
      .then(() => setLoading(false));
  }, []);

  const simulationsList = simulations
    .filter((sim) => sim.name.toLowerCase().includes(search.toLowerCase()))
    .map((sim) => (
      <Link
        to={`/sim/${sim.id}`}
        className="list-group-item list-group-item-action"
        key={sim.id}
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">{sim.name}</div>
          {sim.date} - {sim.description}
        </div>
      </Link>
    ));

  return (
    <div className="container my-4">
      <ol className="breadcrumb">
        <li className="breadcrumb-item active">Dashboard</li>
      </ol>
      <h1 className="text-center mb-4">Simulation Files</h1>
      <div className="d-flex gap-4 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          onChange={(event) => setSearch(event.target.value)}
        />
        <button className="btn btn-outline-primary">Upload</button>
      </div>
      {loading ? (
        <div class="d-flex justify-content-center">
          <div class="spinner-border" />
        </div>
      ) : (
        <div className="list-group">{simulationsList}</div>
      )}
    </div>
  );
};
