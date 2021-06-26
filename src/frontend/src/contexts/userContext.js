import { createContext, useContext, useReducer } from "react";
import { API_BASE } from "../util";

const initialLogin = {
  user: localStorage.getItem("user"),
  token: localStorage.getItem("token"),
  loading: false,
  errorMessage: null,
  active: false,
};

export const loginUser = async (dispatch, payload) => {
  try {
    dispatch({ type: "LOGIN" });

    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 200) {
      localStorage.setItem("user", res.data.user);
      localStorage.setItem("token", res.data.token);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: res.data.user,
          token: res.data.token,
        },
      });
      return { user: res.data.user };
    } else {
      dispatch({ type: "LOGIN_ERROR", payload: { error: res.data.error } });
      return { error: res.data.error };
    }
  } catch (error) {
    dispatch({ type: "LOGIN_ERROR", payload: { error: error.toString() } });
    return { error: error.toString() };
  }
};

export const registerUser = async (dispatch, payload) => {
  try {
    dispatch({type: 'REGISTER'})

    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.data && res.status === 200) {
      dispatch({type: 'REGISTER_SUCCESS', payload: { email: res.data.data}})
      return { email: res.data.data }
    } else {
      dispatch({type: 'LOGIN_ERROR', payload: {error: res.data.error}})
      return { error: res.data.error }
    }
  } catch (error) {
    dispatch( {type: 'LOGIN_ERROR', payload: { error: error.toString()}})
    return { error: error.toString()}
  }
}

export const logout = (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch({ type: "LOGOUT" });
};

export const UserContext = createContext(initialLogin);
export const UserDispatchContext = createContext();

export const useUserState = () => {
  return useContext(UserContext);
};

export const useUserDispatch = () => {
  return useContext(UserDispatchContext);
};

const userAuthReducer = (initial, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...initial, loading: true };
    case "REGISTER":
       return { ...initial, loading: true }
    case "REGISTER_SUCCESS":
       return { ...initial, user: action.payload.user, loading: false }
    case "LOGIN_SUCCESS":
      return { ...initial, user: action.payload.user, loading: false };
    case "LOGOUT":
      return { ...initial, user: null };
    case "LOGIN_ERROR":
      return { ...initial, loading: false, errorMessage: action.payload.error };
    default:
      throw new Error("Unhandled action type: " + action.type);
  }
};

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userAuthReducer, initialLogin);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};
