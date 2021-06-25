import { useState, useEffect } from "react";
import { API_BASE } from "../../../util";
import { Link } from "../../../contexts/routerContext";

export const EditPage = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({});

  useEffect(async () => {
    setLoading(true);

    setMetadata(
      await (
        await fetch(`${API_BASE}/simulations/${match.params.id}/metadata`)
      ).json()
    );

    setLoading(false);
  }, [match.params.id]);

  if (loading) {
    return (
      <div className="my-4">
        <div class="mt-3 d-flex justify-content-center">
          <div class="spinner-border" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="container my-4">
        <h1 className="text-center mb-4">Edit {metadata.name}</h1>
        <form
          action={`${API_BASE}/simulations/${match.params.id}/metadata`}
          method="POST"
        >
          <div className="form-group mt-3">
            <label className="form-label" for="name">
              Simulation Name
            </label>
            <input
              id="name"
              name="name"
              className="form-control"
              value={metadata.name}
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
              value={metadata.description}
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
