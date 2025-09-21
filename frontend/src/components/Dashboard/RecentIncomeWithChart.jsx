import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const COLORS = ["#FF6900","#875CF5",  "#FA2C37", "#4f39f6"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {

    const [charData, setCharData] = useState([]);

    const prepareChartData = () => {
        const dataArr = data?.map((item) => ({
            name: item?.source || "unknown",
            amount: item?.amount
        }));

        setCharData(dataArr);
    };

    useEffect(() => {
        prepareChartData();
        return () => { };
    }, [data]);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Last 60 Days Income</h5>
            </div>

            <CustomPieChart
                data={charData}
                label={"Total Income"}
                totalAmount={`$${totalIncome}`}
                showTextAnchor
                colors={COLORS}
            />
        </div>
    )
}

export default RecentIncomeWithChart
