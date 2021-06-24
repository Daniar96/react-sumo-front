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
import { UserProvider, useUserState } from "./contexts/userContext";

const ProtectedRoute = ({ props }) => {
  const { active } = useUserState();
  return <>{active ? <Route {...props} /> : <Redirect to={"/login"} />}</>;
};

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Header />

          <main>
            <Switch>
              <Route path="/login" component={LoginPage} />
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/edit/:id" component={EditPage} />
              <Route path="/sim/:id" component={SimulationPage} />
              <Route exact path="/" component={LoginPage} />
            </Switch>
          </main>

          <Footer />
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
