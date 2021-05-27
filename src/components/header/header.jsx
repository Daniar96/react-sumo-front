import "./header.css";

export const Header = () => (
  <div className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <div className="navbar-nav">
        <span className="navbar-brand">CentreGeo SUMO</span>
      </div>
      <ul className="nav navbar-nav navbar-right">
        <li className="nav-item">
          <a href="#" className="nav-link">
            Logged in as User
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link btn btn-outline-secondary">Log out</a>
        </li>
      </ul>
    </div>
  </div>
);
