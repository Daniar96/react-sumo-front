import { API_BASE } from "../../../util";
import { Link } from "../../../contexts/routerContext";
import { useState } from "react";
import {useUserState} from "../../../contexts/userContext";

export const UploadPage = (props) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0.0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const { token } = useUserState()

  function upload() {
    setUploading(true);

    console.log(files);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `${API_BASE}/simulations?name=${encodeURIComponent(
        name
      )}&description=${encodeURIComponent(description)}`
    );

    xhr.withCredentials = true;
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(e.loaded / e.total);
      }
    };

    xhr.upload.onloadend = () => {
      props.history.push('/dashboard')
    }

    xhr.send(files[0]);
  }

  return (
    <div className="container my-4">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="breadcrumb-item active">Upload</li>
      </ol>
      <h1 className="text-center mb-4">Upload a simulation</h1>
      {uploading ? (
        <div>
          <label>Uploading {name}...</label>
          <div class="progress mt-3">
            <div
              class="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              aria-valuenow={progress * 100}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: `${progress * 100}%` }}
            >
              {Math.round(progress * 100)}%
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={upload}>
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
              required
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
              required
            />
          </div>
          <div className="form-group mt-3">
            <label className="form-label" for="file">
              ZIP File
            </label>
            <input
              id="file"
              name="file"
              type="file"
              className="form-control"
              onChange={(e) => setFiles(e.currentTarget.files)}
              accept="application/zip"
              required
            />
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
      )}
    </div>
  );
};
