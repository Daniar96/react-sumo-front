import { useState } from "react";
import { Link } from "react-router-dom";

const simulations = [
  {
    id: "1",
    name: "This is Simulation 1",
    date: "April 10, 2020",
    location: "Helsinki, Finland",
  },
  {
    id: "2",
    name: "The Simulation 2",
    date: "April 11, 2020",
    location: "Helsinki, Finland",
  },
  {
    id: "3",
    name: "A Simulation 3",
    date: "April 12, 2020",
    location: "Helsinki, Finland",
  },
];

export const DashboardPage = () => {
  const [search, setSearch] = useState("");

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
          {sim.date} - {sim.location}
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
      <div className="list-group">{simulationsList}</div>
    </div>
  );
};
