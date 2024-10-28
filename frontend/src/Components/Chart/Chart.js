import React from 'react';
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
);

function Chart() {
    const { incomes, expenses } = useGlobalContext();

    // Array of all month names
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Group incomes and expenses by month
    const groupByMonth = (data) => {
        return data.reduce((acc, curr) => {
            const monthIndex = new Date(curr.date).getMonth(); // Get month index (0-11)
            const amount = curr.amount;

            if (!acc[monthIndex]) {
                acc[monthIndex] = 0;
            }
            acc[monthIndex] += amount;
            return acc;
        }, new Array(12).fill(0)); // Initialize with 0 for all 12 months
    };

    // Aggregating amounts
    const monthlyIncomes = groupByMonth(incomes);
    const monthlyExpenses = groupByMonth(expenses);

    // Preparing the data for the chart
    const data = {
        labels: months, // Use month names as labels
        datasets: [
            {
                label: 'Income',
                data: monthlyIncomes,
                backgroundColor: 'green',
                borderColor: 'green',
                borderWidth: 2,
                tension: 0, // No curve in the line
                fill: false, // No fill under the line
                pointRadius: 5, // Size of the dots
                pointHoverRadius: 7, // Size of the dots when hovered
            },
            {
                label: 'Expenses',
                data: monthlyExpenses,
                backgroundColor: 'red',
                borderColor: 'red',
                borderWidth: 2,
                tension: 0, // No curve in the line
                fill: false, // No fill under the line
                pointRadius: 5, // Size of the dots
                pointHoverRadius: 7, // Size of the dots when hovered
            }
        ]
    };

    return (
        <ChartStyled>
            <Line 
                data={data} 
                options={{
                    responsive: true,
                    maintainAspectRatio: false, // Allow dynamic height adjustment
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                        tooltip: {
                            mode: 'index', // Show tooltip for all datasets at the same x-axis value
                            intersect: false,
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Months',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Amount',
                            },
                            beginAtZero: true, // Start y-axis from 0
                        },
                    },
                }} 
            />
        </ChartStyled>
    );
}

const ChartStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 400px;
    width: 100%;
    max-width: 100%; /* Ensure it does not exceed the parent container */

    @media (max-width: 1024px) {
        height: 300px;
        padding: 0.8rem;
    }

    @media (max-width: 768px) {
        height: 250px;
        padding: 0.6rem;
    }

    @media (max-width: 480px) {
        height: 200px;
        padding: 0.5rem;
    }

    /* Ensure the canvas scales with the container */
    canvas {
        width: 100% !important;
        height: 100% !important;
        max-height: 100%; 
    }
`;


export default Chart;
