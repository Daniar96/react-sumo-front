import "./App.css";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from "./contexts/routerContext";

import Footer from "./components/footer";
import Header from "./components/header";
import DashboardPage from "./components/pages/dashboard";
import LoginPage from "./components/pages/login";
import SimulationPage from "./components/pages/simulation";
import EditPage from "./components/pages/edit";
import UploadPage from "./components/pages/upload";
import { UserProvider, useUserState } from "./contexts/userContext";
import { SUBPATH } from './util'

const ProtectedRoute = ({ ...rest }) => {
  const { active } = useUserState();
  return <>{ active ? <Route {...rest}/> : <Redirect to={"/login"} />}</>;
};

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter basename={SUBPATH}>
          <Header />

          <main>
            <Switch>
              <Route path="/login" component={LoginPage} />
              <ProtectedRoute path="/dashboard" component={DashboardPage} />
              <ProtectedRoute path="/edit/:id" component={EditPage} />
              <ProtectedRoute path="/sim/:id" component={SimulationPage} />
              <ProtectedRoute path="/upload" component={UploadPage} />
              <Route exact path="/">
                <Redirect to={'/login'}/>
              </Route>
            </Switch>
          </main>

          <Footer />
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
