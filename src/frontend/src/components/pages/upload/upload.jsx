import { API_BASE } from "../../../util";
import { Link } from "../../../contexts/routerContext";

export const UploadPage = () => (
  <div className="container my-4">
    <h1 className="text-center mb-4">Upload a simulation</h1>
    <form action={`${API_BASE}/simulations`} method="POST">
      <div className="form-group mt-3">
        <label className="form-label" for="name">
          Simulation Name
        </label>
        <input id="name" name="name" className="form-control" />
      </div>
      <div className="form-group mt-3">
        <label className="form-label" for="description">
          Description
        </label>
        <input id="description" name="description" className="form-control" />
      </div>
      <div className="form-group mt-3">
        <label className="form-label" for="file">
          ZIP File
        </label>
        <input id="file" name="file" type="file" className="form-control" />
      </div>
      <div className="btn-group">
        <button type="submit" className="mt-3 btn btn-primary">
          Save
        </button>
        <Link to="/dashboard" className="mt-3 btn btn-outline-secondary">
          Cancel
        </Link>
      </div>
    </form>
  </div>
);
