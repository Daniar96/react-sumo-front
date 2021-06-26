import "./header.css";
import {useUserDispatch, useUserState, logout} from "../../contexts/userContext";

export const Header = () => {
  const { user, active } = useUserState()
  const dispatch = useUserDispatch()

  const logoutPressed = () => {
    logout(dispatch)
  }

  return (
    <div className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-nav">
          <span className="navbar-brand">CentreGeo SUMO</span>
        </div>
        { active ?
          <ul className="nav navbar-nav navbar-right">
            <li className="nav-item">
              <a href="#" className="nav-link">
                Logged in as {user}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link btn btn-outline-secondary" onClick={logoutPressed}>Log out</a>
            </li>
          </ul>
          :
          null
        }
      </div>
    </div>
  );
}
