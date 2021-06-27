import { useState, useEffect } from "react";
import { API_BASE } from "../../../util";
import { Link } from "../../../contexts/routerContext";
import {useUserState} from "../../../contexts/userContext";

export const EditPage = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({});
  const [name, setName] = useState({});
  const [description, setDescription] = useState({});

  const { authHeaders } = useUserState()

  function submitForm(e) {
    e.preventDefault();
    fetch(`${API_BASE}/simulations/${match.params.id}/metadata`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        description: description,
      }),
      ...authHeaders
    }).then(() => {
      location.href = `/sim/${match.params.id}`;
    });
  }

  useEffect(async () => {
    setLoading(true);

    const metadata = await (
      await fetch(`${API_BASE}/simulations/${match.params.id}/metadata`)
    ).json();

    setMetadata(metadata);

    setName(metadata.name);
    setDescription(metadata.description);

    setLoading(false);
  }, [match.params.id]);

  if (loading) {
    return (
      <div className="container my-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/sim/${match.params.id}`}>
              Simulation {match.params.id}
            </Link>
          </li>
          <li className="breadcrumb-item active">Edit</li>
        </ol>
        <div class="mt-3 d-flex justify-content-center">
          <div class="spinner-border" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="container my-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/sim/${match.params.id}`}>{metadata.name}</Link>
          </li>
          <li className="breadcrumb-item active">Edit</li>
        </ol>
        <h1 className="text-center mb-4">Edit {metadata.name}</h1>
        <form onSubmit={submitForm}>
          <div className="form-group mt-3">
            <label className="form-label" for="name">
              Simulation Name
            </label>
            <input
              id="name"
              name="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label className="form-label" for="description">
              Description
            </label>
            <input
              id="description"
              name="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="btn-group">
            <button type="submit" className="mt-3 btn btn-primary">
              Save
            </button>
            <Link
              to={`/sim/${match.params.id}`}
              className="mt-3 btn btn-outline-secondary"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    );
  }
};
