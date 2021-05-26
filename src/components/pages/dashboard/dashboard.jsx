import { Link } from "react-router-dom";

const simulations = [
  {
    id: "1",
    name: "Simulation 1",
    date: "April 10, 2020",
    location: "Helsinki, Finland",
  },
  {
    id: "2",
    name: "Simulation 2",
    date: "April 11, 2020",
    location: "Helsinki, Finland",
  },
  {
    id: "3",
    name: "Simulation 3",
    date: "April 12, 2020",
    location: "Helsinki, Finland",
  },
];

const simulationsList = simulations.map((sim) => (
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

export const DashboardPage = () => (
  <div className="container my-4">
    <ol className="breadcrumb">
      <li className="breadcrumb-item active">Dashboard</li>
    </ol>
    <h1 className="text-center mb-4">Simulation Files</h1>
    <div className="input-group mx-auto mb-4 w-50">
      <input type="text" className="form-control" placeholder="Search..." />
      <button className="btn btn-outline-primary">Search</button>
    </div>
    <div className="list-group">{simulationsList}</div>
  </div>
);
