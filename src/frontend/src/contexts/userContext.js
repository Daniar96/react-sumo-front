import {createContext, useContext, useReducer} from "react";
import {API_BASE} from "../util";

const initialLogin = {
  user: localStorage.getItem("user"),
  token: localStorage.getItem("token"),
  loading: false,
};

export const loginUser = async (dispatch, payload) => {
  dispatch({type: "LOGIN"});
  return await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (res.status !== 200) {
        throw "login failed"
      }
      return res.json()
    })
    .then(data => {
      localStorage.setItem("user", data.username);
      localStorage.setItem("token", data.token);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: data.username,
          token: data.token,
        },
      });
      return {username: data.username};
    })
    .catch(e => {
      dispatch({type: "LOGIN_ERROR", error: e});
      return {error: e.toString()}
    })
};

export const registerUser = async (dispatch, payload) => {
  dispatch({type: 'REGISTER'})

  return await fetch(`${API_BASE}/login`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (res.status !== 200) {
        throw "Registration error"
      }
      return res.json()
    })
    .then(data => {
      console.log(data)
      dispatch({type: 'REGISTER_SUCCESS', payload: {username: data.username}})
      return {user: data.username}
    })
    .catch(e => {
      dispatch({type: 'LOGIN_ERROR', payload: {error: e.toString()}})
      return {error: e.toString()}
    })
}

export const logout = (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch({type: "LOGOUT"});
};

export const UserContext = createContext(initialLogin);
export const UserDispatchContext = createContext();

export const useUserState = () => {
  const userState = useContext(UserContext)
  userState.active = userState.token !== null && userState.user !== null
  return userState;
};

export const useUserDispatch = () => {
  return useContext(UserDispatchContext);
};

const userAuthReducer = (initial, action) => {
  switch (action.type) {
    case "LOGIN":
      return {...initial, loading: true};
    case "REGISTER":
      return {...initial, loading: true}
    case "REGISTER_SUCCESS":
      return {...initial, loading: false}
    case "LOGIN_SUCCESS":
      return {...initial, user: action.payload.user, token: action.payload.token, loading: false};
    case "LOGOUT":
      return {...initial, user: null, token: null};
    case "LOGIN_ERROR":
      return {...initial, loading: false};
    default:
      throw new Error("Unhandled action type: " + action.type);
  }
};

export const UserProvider = ({children}) => {
  const [user, dispatch] = useReducer(userAuthReducer, initialLogin);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};
