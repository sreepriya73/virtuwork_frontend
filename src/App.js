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
import ViewAcceptedTasks from './components/ViewAcceptedTasks';
import ConfirmTask from './components/ConfirmTask';
import FreelancerConfirmedTasks from './components/FreelancerConfirmedTasks';
import CurrentWork from './components/CurrentWork';
import SubmitWork from './components/SubmitWork';
import ViewSubmittedWorks from './components/ViewSubmittedWorks';
import TaskProgress from './components/TaskProgress';
import TaskRecommender from './components/TaskRecommender';



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
  <Route path='/ViewAcceptedTasks' element={<ViewAcceptedTasks/>}/>
  <Route path='/ConfirmTask' element={<ConfirmTask/>}/>
  <Route path='/FreelancerCinfirmedTask' element={<FreelancerConfirmedTasks/>}/>
  <Route path='/CurrentWork' element={<CurrentWork/>}/>
  <Route path='/SubmitWork' element={<SubmitWork/>}/>
  <Route path='/ViewSubmittedWorks' element={<ViewSubmittedWorks/>}/>
  <Route path='/TaskProgress' element={<TaskProgress/>}/>
  <Route path='/TaskRecommender' element={<TaskRecommender/>}/>
  
  

 
</Routes>
</BrowserRouter>

       
    </div>
  );
}

export default App;
