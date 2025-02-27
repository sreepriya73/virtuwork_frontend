import logo from './logo.svg';
import './App.css';
import HomePage from './components/HomePage';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import UserRegister from './components/UserRegister';
import ClientDash from './components/ClientDash';
import AdminLogin from './components/AdminLogin';


import FreelancerDash from './components/FreelancerDash';
import AdminRegister from './components/AdminRegister';
import AddTask from './components/AddTask';
import AdminDash from './components/AdminDash';
import ViewTasks from './components/ViewTasks';



function App() {
  return (
    <div >
<BrowserRouter>
<Routes>
  <Route path='/' element={<HomePage/>}/>
  <Route path='/SignIn' element={<SignIn/>}/>
  <Route path='/UserRegister' element={<UserRegister/>}/>
  <Route path='/ClientDash' element={<ClientDash/>}/>
  <Route path='/AdminLogin' element={<AdminLogin/>}/>
  <Route path='/AdminRegister' element={<AdminRegister/>}/>
  <Route path='/FreelancerDash' element={<FreelancerDash/>}/>
  <Route path='/AddTask' element={<AddTask/>}/>
  <Route path='/AdminDash' element={<AdminDash/>}/>
  <Route path='/ViewTasks' element={<ViewTasks/>}/>
  
  

 
</Routes>
</BrowserRouter>

       
    </div>
  );
}

export default App;
