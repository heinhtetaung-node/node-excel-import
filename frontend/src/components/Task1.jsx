import PieChart from './PieChart'
import BarChart from './BarChart'
import { useState, useEffect } from 'react'
import axios from 'axios'
function Task1() {
    
    const [barData, setBarData] = useState(null);
    const [pieData, setPieData] = useState(null);

    useEffect(() => {
        getChartDatas()
    }, [])    
    
    const getChartDatas = () => {
        axios.get('http://localhost:8080/bar').then(res => {
            setBarData(res.data.data)
        })
        axios.get('http://localhost:8080/pie').then(res => {
            setPieData(res.data.data)
        })
    }

    const addData = (e) => {
        e.preventDefault()  
        const form = document.getElementById('addform')      
        const user = {
            name : form.txtname.value,
            age : form.txtage.value,
            gender : form.selgender.value
        }
        axios.post('http://localhost:8080/chart', user).then(res => {            
            resetVal()
            alert("Data inserted!")
            getChartDatas()
        })
    }

    const resetVal = () => {
        const form = document.getElementById('addform')   
        form.txtname.value = ''
        form.txtage.value = ''
        form.selgender.value = 'M'
    }

    return (
        <div className=' min-h-full w-full'>
            <div className="w-screen h-auto  flex flex-col justify-start items-center">
                <h1 className="text-yellow-600 text-2xl mt-2">Task 1 – Utilize any chart APIs</h1>
                <div className="flex flex-col md:flex-row w-full md:px-20 md:w-11/12">
                    <div className="w-full md:w-1/2 p-2 mt-10">
                        {(pieData != null) && <PieChart pieData={pieData} />}
                    </div>
                    <div className="w-full md:w-1/2 p-2 h-auto mt-20">
                        {(barData != null) && <BarChart barData={barData} />}
                    </div>
                </div>
                <h1 className="text-yellow-600 text-2xl mt-4">Task 2 – Data Manipulation</h1>
                <div className="flex">
                    <form id="addform" onSubmit={addData} className='w-full flex-col flex text-gray-600 p-2 mb-20'>
                        Name <input name="txtname" required type="text" className='bg-white' />
                        Age <input name="txtage" required type="number" className='bg-white' />
                        Gender <select name="selgender"><option value="M">Male</option><option value="F">Female</option></select>
                        <button className='mt-3 bg-blue-500 text-white'>Submit</button>
                    </form>
                </div>
            </div>
            
        </div>
    )
}

export default Task1