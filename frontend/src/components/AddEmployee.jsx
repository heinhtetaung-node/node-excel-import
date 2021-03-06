import PieChart from './PieChart'
import BarChart from './BarChart'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
function AddEmployee() {

    const [errors, setErrors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employee, setEmployee] = useState(null);
    const navigate = useNavigate();
    const { empId } = useParams();

    useEffect(() => {
        if (empId) {
            getDetail(empId)
        }
        getDepartments()
    }, [])

    const getDetail = (empId) => {
        axios.get('http://167.172.72.132:8080/apiemp_selectbyempid/'+empId).then(res => {
            setEmployee(res.data.data)
            const emp = res.data.data
            document.querySelector('[name=empno]').value = emp.empNo
            document.querySelector('[name=empname]').value = emp.empName
            document.querySelector('[name=empdob]').value = showMdy(emp.empDob)
            document.querySelector('[name=joindate]').value = showMdy(emp.joinDate)
            setTimeout(() => {
                document.querySelector('[name=departmentId]').value = emp.departmentId
            }, 2000)
            document.querySelector('[name=salary]').value = emp.salary
            var inputs = document.querySelectorAll('.skills');   
            for (var i = 0; i < inputs.length; i++) {   
                const ski = inputs[i].value
                const filt = JSON.parse(emp.skills).filter(e => e.Name === ski)
                if (filt.length > 0) {
                    inputs[i].checked = true
                }
            } 
        })
    }

    const getDepartments = () => {
        axios.get('http://167.172.72.132:8080/apidep_select').then(res => {
            setDepartments(res.data.data)
        })
    }

    const saveEmployee = () => {
        const empno = document.querySelector('[name=empno]').value
        const empname = document.querySelector('[name=empname]').value
        const empdob = document.querySelector('[name=empdob]').value
        const joindate = document.querySelector('[name=joindate]').value
        const departmentId = document.querySelector('[name=departmentId]').value
        const salary = document.querySelector('[name=salary]').value

        const skill = []
        var inputs = document.querySelectorAll('.skills');   
        for (var i = 0; i < inputs.length; i++) {   
            if (inputs[i].checked == true) {
                skill.push({
                    id : i,
                    Name : inputs[i].value           
                })
            }
        } 

        if (employee != null) {
            axios.put('http://167.172.72.132:8080/apiemp_update/'+employee.id, {empname, empdob, joindate, departmentId, salary, skill}).then(res => {
                navigate('/', { replace: true });
            }).catch(err => {
                console.log(err.response.status);
                console.log(err.response.data);
                if (err.response.status == 400) {
                    setErrors(err.response.data.errors);
                }
            })
        } else {
            axios.post('http://167.172.72.132:8080/apiemp_insert', {empno, empname, empdob, joindate, departmentId, salary, skill}).then(res => {
                navigate('/', { replace: true });
            }).catch(err => {
                console.log(err.response.status);
                console.log(err.response.data);
                if (err.response.status == 400) {
                    setErrors(err.response.data.errors);
                }
            })
        }
    }

    const showMdy = (date) => {
        const dateObj = new Date(date);
        console.log(dateObj.getFullYear() + '-' + ( (dateObj.getMonth()+1 < 10)? '' + dateObj.getMonth()+1 : dateObj.getMonth()+1 ) + '-' + ( (dateObj.getDate() < 10)? '0' + dateObj.getDate() : dateObj.getDate() ))
        return dateObj.getFullYear() + '-' + ( (dateObj.getMonth() < 9)? '0'+(dateObj.getMonth()+1) : dateObj.getMonth()+1 ) + '-' + ( (dateObj.getDate() < 10)? '0' + dateObj.getDate() : dateObj.getDate() )
    }

    return (
        <div className=' min-h-full w-full'>
            <div className="w-screen h-auto  flex flex-col justify-start items-center p-4">
                <h1 className="text-yellow-600 text-2xl mt-2">HR Management</h1>
                <div className="flex flex-row-reverse w-full pr-8">
                    <Link to="/">
                        <button className="p-2 bg-blue-400">Employee List</button>
                    </Link>     
                </div>
                {errors.map(e => {
                    return (
                        <span className='w-full max-w-lg p-2 mb-1 bg-red-100 text-red-500'>{e.msg}</span>
                    )
                })}
                <div className="flex w-full max-w-lg">
                    <div className="w-1/3 text-right p-2 ">
                        EMPLOYEE NO : 
                    </div>
                    <div className='w-2/3 p-2 flex flex-col'>
                        <input type="text" name="empno" className='w-full p-1' disabled={employee != null}/>
                        
                    </div>
                </div>
                <div className="flex w-full max-w-lg">
                    <div className="w-1/3 text-right p-2 ">
                        EMPLOYEE NAME : 
                    </div>
                    <div className='w-2/3 p-2 '>
                        <input type="text" name="empname" className='w-full p-1' />
                    </div>
                </div>
                <div className="flex w-full max-w-lg">
                    <div className="w-1/3 text-right p-2 ">
                        DOB : 
                    </div>
                    <div className='w-2/3 p-2 '>
                        <input type="date" name="empdob" className='w-full p-1' />
                    </div>
                </div>
                <div className="flex w-full max-w-lg">
                    <div className="w-1/3 text-right p-2 ">
                        JOIN DATE : 
                    </div>
                    <div className='w-2/3 p-2 '>
                        <input type="date" name="joindate" className='w-full p-1' />
                    </div>
                </div>
                <div className="flex w-full max-w-lg">
                    <div className="w-1/3 text-right p-2 ">
                        DEPARTMENT : 
                    </div>
                    <div className='w-2/3 p-2 '>
                        <select className='p-1' name='departmentId' >
                            {departments.map(d => {
                                return (
                                    <option value={d.id}>{d.code}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <div className="flex w-full max-w-lg">
                    <div className="w-1/3 text-right p-2 ">
                        SALARY : 
                    </div>
                    <div className='w-2/3 p-2 '>
                        <input type="text" className='w-full p-1' name="salary" />
                    </div>
                </div>
                <div className="flex w-full max-w-lg">
                    <div className="w-1/3 text-right p-2 ">
                        SKILLS : 
                    </div>
                    <div className='w-2/3 m-2 ml-3 h-auto p-2 border-2 border-gray-400 flex flex-wrap'>
                        <div className="w-1/3">
                            <input type="checkbox" class="skills" value="Java"/> Java
                        </div>
                        <div className="w-1/3">
                            <input type="checkbox" class="skills" value=".Net Core"/> .Net Core
                        </div>
                        <div className="w-1/3">
                            <input type="checkbox" class="skills" value="AWS"/> AWS
                        </div>
                        <div className="w-1/3">
                            <input type="checkbox" class="skills" value="C#"/> C#
                        </div>
                        <div className="w-1/3">
                            <input type="checkbox" class="skills" value="Excel"/> Excel
                        </div>
                        <div className="w-1/3">
                            <input type="checkbox" class="skills" value="Accounting"/> Accounting
                        </div>
                        <div className="w-1/3">
                            <input type="checkbox" class="skills" value="MVC"/> MVC
                        </div>
                        <div className="w-1/3">
                            <input type="checkbox" class="skills" value="Bitbucket"/> Bitbucket
                        </div>
                        <div className="w-1/3">
                            <input type="checkbox" class="skills" value="Others"/> Others
                        </div>
                    </div>
                </div>
                <div className="flex w-full max-w-lg">
                    <div className="w-1/3 text-right p-2 ">
                       
                    </div>
                    <div className='w-2/3 p-2 '>
                        <button onClick={() => saveEmployee()} className='p-2 m-2 bg-blue-500'> &nbsp;&nbsp;  Save  &nbsp;&nbsp;  </button>
                        <Link to="/"><button className='p-2 m-2 bg-gray-300'>&nbsp; Cancel&nbsp; </button></Link>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default AddEmployee
