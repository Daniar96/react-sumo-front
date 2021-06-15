import './App.css'
import {BrowserRouter, Switch, Route} from './contexts/routerContext'

import Footer from "./components/footer"
import Header from "./components/header"
import DashboardPage from './components/pages/dashboard'
import LoginPage from './components/pages/login'
import SimulationPage from './components/pages/simulation'

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Header/>

            <main>
            <Switch>
                <Route path='/login' component={LoginPage}/>
                <Route path='/dashboard' component={DashboardPage}/>
                <Route path='/sim/:id' component={SimulationPage}/>
                <Route exact path='/' component={LoginPage}/>
            </Switch>
            </main>

            <Footer/>
        </BrowserRouter>
    </div>
  );
}

export default App;
