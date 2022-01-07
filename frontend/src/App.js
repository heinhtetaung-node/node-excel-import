import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Employee from './components/Employee'
import AddEmployee from './components/AddEmployee'

function App() {
  return (
    <div className='bg-gray-200'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Employee />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/edit/:empId" element={<AddEmployee />} />
        </Routes>
      </BrowserRouter>    
    </div>
  )
}

export default App;
