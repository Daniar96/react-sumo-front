import {
  cloneElement,
  createContext,
  useEffect,
  useState,
} from "react";
import { SUBPATH } from '../util'

const initialState = {
  path: window.location.pathname,
};

export const RouterContext = createContext(initialState);

const base_url = SUBPATH

export const BrowserRouter = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPathChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", onPathChange);
    return () => window.removeEventListener("popstate", onPathChange);
  }, []);

  const navigate = (url) => {
    setCurrentPath(base_url + url);
    window.history.pushState(null, null, base_url + url);
  };

  return (
    <RouterContext.Provider value={{ path: currentPath, navigate: navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Switch = ({ children }) => {
  const routeMatches = (currentPath, route) => {
    const URItokens = currentPath.split("/");
    const routeTokens = route.split("/");
    const URIpair = routeTokens.map((e, i) => {
      return { route: e, url: i >= URItokens.length ? null : URItokens[i] };
    });

    const matchReducer = (acc, pair) => {
      if (acc.matched === false) return acc;
      if (pair.url === null) return { matched: false, params: {} };

      if (pair.route[0] === ":") {
        return {
          matched: true,
          params: { ...acc.params, [pair.route.slice(1)]: pair.url },
        };
      } else if (pair.route === pair.url) {
        return acc;
      } else {
        return { matched: false, params: {} };
      }
    };

    return URIpair.reduce(matchReducer, { matched: true, params: {} });
  };

  const toRender = (nav, currentPath) =>
    children.map((child) => {
      const match = routeMatches(currentPath, base_url + child.props.path);
      return match.matched
        ? cloneElement(child, { path: child.props.path, match: match, history: {push: nav}})
        : null;
    })

  return (
    <RouterContext.Consumer>
      {({ navigate, path }) => toRender(navigate, path)}
    </RouterContext.Consumer>
  );
};

export const Route = ({ component: Component, children, ...rest}) => {
  return Component === undefined ? <>{children}</> : <Component {...rest} />;
};

export const Link = ({ children, to, ...props }) => {
  return (
    <RouterContext.Consumer>
      {({ navigate }) => (
        <a
          href={to}
          className={props.className}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(to);
          }}
        >
          {children}
        </a>
      )}
    </RouterContext.Consumer>
  );
};

export const Redirect = ({ to }) => {
  return (
    <RouterContext.Consumer>
      {({ navigate }) => navigate(to)}
    </RouterContext.Consumer>
  );
};

export default BrowserRouter;
