import './App.less';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from './pages/LandingPage/LandingPage';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import SignIn from './pages/SignIn/SignIn';
import CreateAccountSteps from './pages/CreateAccountSteps/CreateAccountSteps';
import Dashboard from './pages/protected_routes/Dashboard/Dashboard';
import MailScape from './pages/protected_routes/MailScape/MailScape';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="*" element={<NoPage />} />
        </Route> */}

      <Route path="" element={<LandingPage/>} />
      <Route path="create_account" element={<CreateAccount/>} />
      <Route path="create_account/continue" element={<CreateAccountSteps/>} />
      <Route path="sign_in" element={<SignIn/>} />

      <Route path="/dashboard" element={<MailScape />}>
        {/* <Route path="" element={<MailScape />} /> */}
      </Route>

      
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
