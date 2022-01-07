import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = (props) => {  
  const noOfMale = props.pieData.noOfMale
  const noOfFemale = props.pieData.noOfFemale
  const data = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'ratio of M and F according to gender',
        data: [noOfMale, noOfFemale],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'         
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
}

export default PieChart