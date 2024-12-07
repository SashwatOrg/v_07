import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface PieChartProps {
  data: { name: string; value: number }[]; // Accepts an array of name-value pairs
  title: string; // Accepts a title for the chart
}

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  // Calculate total and add percentage values to the data
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = data.map(item => ({
    name: item.name,
    y: (item.value / total) * 100, // Percentage for rendering
    absolute: item.value, // Absolute value for tooltip
  }));

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      plotShadow: true,
    },
    title: {
      text: title,
    },
    tooltip: {
      formatter: function () {
        return `<b>${this.point.name}</b>: ${this.point.options.absolute} (${this.point.percentage.toFixed(1)}%)`;
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
            style: {
                fontSize: '18px'
            },
            distance: 10,
          enabled: true,
          formatter: function () {
            return `${this.point.name}: ${this.point.options.absolute}`;
          },
        },
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Distribution',
        colorByPoint: true,
        data: chartData, // Use the transformed data
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;


// import React from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';

// // Define the props type for the PieChart component
// interface PieChartProps {
//   data: { name: string; value: number }[]; // Accepts an array of name-value pairs
//   title: string; // Accepts a title for the chart
// }

// const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
//   // Transform the data props into the format required by Highcharts
//   const chartData = data.map(item => ({
//     name: item.name,
//     y: item.value,
//   }));

//   const options: Highcharts.Options = {
//     chart: {
//       type: 'pie',
//       plotShadow: true, // Enables shadow for the chart
//     },
//     title: {
//       text: title,
//     },
//     tooltip: {
//       valueSuffix: '%',
//     },
//     subtitle: {
//       text: 'Source:<a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>',
//     },
//     plotOptions: {
//       series: {
//         allowPointSelect: true,
//         cursor: 'pointer',
//         shadow: true, // Enables shadow for the series
//         dataLabels: [
//           {
//             enabled: true,
//             distance: 20,
//           },
//           {
//             enabled: true,
//             distance: -40,
//             format: '{point.percentage:.1f}%',
//             style: {
//               fontSize: '1.2em',
//               textOutline: 'none',
//               opacity: 0.7,
//             },
//             filter: {
//               operator: '>',
//               property: 'percentage',
//               value: 10,
//             },
//           },
//         ],
//       },
//     },
//     series: [
//       {
//         type: 'pie',
//         name: 'Percentage',
//         colorByPoint: true,
//         data: chartData, // Use the transformed data here
//       },
//     ],
//   };

//   return <HighchartsReact highcharts={Highcharts} options={options} />;
// };

// export default PieChart;
