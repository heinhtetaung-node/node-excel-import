import PieChart from './PieChart'
import BarChart from './BarChart'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import csv from '../sample-csv.csv'

function Employee() {
    
    const [employees, setEmployees] = useState([])
    const [total, setTotal] = useState(0)
    const [noOfLink, setNoOfLink] = useState([])
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(0)
    const navigate = useNavigate();
    const order = useRef('asc');

    useEffect(() => {
        document.getElementById('pagi').value = 1
        getEmployees()
    }, [])

    const getEmployees = (offsetP = 0, limitP = 10, orderBy = 'empName') => {
        const keyword = document.querySelector('[name=searchtxt]').value
        axios.get('http://167.172.72.132:8080/apiemp_select?offset='+offsetP+'&limit='+limitP+'&keyword='+keyword+'&orderBy='+orderBy+'&order='+order.current).then(res => {
            setEmployees(res.data.data)
            setTotal(res.data.count)
            const cnt = res.data.count
            const links = Math.ceil(cnt / limit)
            const arrr = []
            for (let i = 0; i < links; i++) {
                arrr.push(i+1);
            }
            setNoOfLink(arrr)
        })
    }

    const showYmD = (date) => {
        const dateObj = new Date(date);
        return dateObj.getDate() + '/' + (dateObj.getMonth()+1) + '/' + dateObj.getFullYear()
    }

    const handleFileInput = (e) => {
        alert('hrere')
        const file = e.target.files[0];
        const data = new FormData();
        data.append('csv', file);
        axios.post('http://167.172.72.132:8080/apicsv_upload', data).then(res => {
            console.log(res)
            alert("Complete")
        })
    }

    const changePage = (page) => {
        const offset = (page - 1) * limit
        setOffset(offset)
        getEmployees(offset)
    }

    const goPrev = () => {
        if ( document.getElementById('pagi').value > 1 ) {
            document.getElementById('pagi').value = parseInt(document.getElementById('pagi').value) - 1
            changePage(document.getElementById('pagi').value)
        }
    }

    const goNext = () => {
        document.getElementById('pagi').value = parseInt(document.getElementById('pagi').value) + 1
        changePage(document.getElementById('pagi').value)
    }

    const deleteEmp = (id) => {
        axios.delete('http://167.172.72.132:8080/apiemp_delete/'+id).then(res => {
            document.getElementById('pagi').value = 1
            changePage(1)
        })
    }

    const changeOrder = (ord) => {
        if (order.current == 'asc') {
            order.current = 'desc'
        } else {
            order.current = 'asc'
        }
        getEmployees(0, 10, ord)
    }

    return (
        <div className=' min-h-full w-full'>
            <div className="w-screen h-auto  flex flex-col justify-start items-center p-4">
                <h1 className="text-yellow-600 text-2xl mt-2">HR Management</h1>
                <div className="flex flex-row-reverse w-full pr-8">
                    <Link to="/add-employee">
                        <button className="p-2 bg-blue-400">Add Employee</button>
                    </Link>     
                    <a href={csv} download className='mr-2'>
                        <button className="ml-2 p-2 bg-blue-400">Export Csv Format</button>
                    </a>
                    <input type="file" className="hidden" id="csvfile" onChange={handleFileInput}/>
                    <button className="ml-2 p-2 bg-blue-400" onClick={() => document.getElementById('csvfile').click()}>Import Csv Data</button>
                </div>
                <input type="text" placeholder="Search" onChange={(e) => getEmployees()} name="searchtxt" />
                <table className="w-full mt-10">
                    <thead>
                    <tr>
                        <th className="p-2 border-2 border-gray-400">#</th>
                        <th className="p-2 border-2 border-gray-400"><a href="#" onClick={() => changeOrder('empNo')}>EMPLOYEE NO &#9660; &#9650;</a></th>
                        <th className="p-2 border-2 border-gray-400"><a href="#" onClick={() => changeOrder('empName')}>EMPLOYEE NAME &#9660; &#9650;</a></th>
                        <th className="p-2 border-2 border-gray-400">DOB</th>
                        <th className="p-2 border-2 border-gray-400">JOIN DATE</th>
                        <th className="p-2 border-2 border-gray-400">SALARY</th>
                        <th className="p-2 border-2 border-gray-400"><a href="#" onClick={() => changeOrder('departmentId')}>DEPARTMENT &#9660; &#9650;</a></th>
                        <th className="p-2 border-2 border-gray-400">SKILLS</th>
                        <th className="p-2 border-2 border-gray-400">Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((e,i) => {
                        return (
                            <tr key={i}>
                                <td className="p-2 border-2 border-gray-400" >{i+1}</td>
                                <td className="p-2 border-2 border-gray-400">{e.empNo}</td>
                                <td className="p-2 border-2 border-gray-400">{e.empName}</td>
                                <td className="p-2 border-2 border-gray-400">{showYmD(e.empDob)}</td>
                                <td className="p-2 border-2 border-gray-400">{showYmD(e.joinDate)}</td>
                                <td className="p-2 border-2 border-gray-400">{e.salary}</td>
                                <td className="p-2 border-2 border-gray-400">{e.department.code}</td>
                                <td className="p-2 border-2 border-gray-400">
                                    {JSON.parse(e.skills).map(s => { 
                                        return (<span>{s.Name}&nbsp;</span>) 
                                    })}
                                </td>
                                <td className="p-2 border-2 border-gray-400">
                                    <button onClick={() => navigate('/edit/'+e.id, { replace: true })}>Edit</button>
                                    <button className="ml-4" onClick={()=> deleteEmp(e.id)}>Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <div className='flex'>
                <button onClick={() => goPrev()}>Prev</button>&nbsp;&nbsp;
                <select className='pagi mt-2 p-2' id="pagi" name="pagi" onChange={(e) => changePage(e.target.value)}>
                    {noOfLink.map(l => {
                        return (
                            <option value={l}>{l}</option>
                        )
                    })}
                </select>&nbsp;&nbsp;
                <button onClick={() => goNext()}>Next</button>
                </div>
            </div>
            
        </div>
    )
}

export default Employee
