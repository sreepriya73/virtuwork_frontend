import logo from './logo.svg';
import './App.css';
import HomePage from './components/HomePage';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import UserRegister from './components/UserRegister';
import ProfilePage from './components/ProfilePage';
import AdminLogin from './components/AdminLogin';

function App() {
  return (
    <div >
<BrowserRouter>
<Routes>
  <Route path='/' element={<HomePage/>}/>
  <Route path='/SignIn' element={<SignIn/>}/>
  <Route path='/UserRegister' element={<UserRegister/>}/>
  <Route path='/ProfilePage' element={<ProfilePage/>}/>
  <Route path='/AdminLogin' element={<AdminLogin/>}/>
</Routes>
</BrowserRouter>

       
    </div>
  );
}

export default App;
