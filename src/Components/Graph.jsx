
// import React, { useState, useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsAnnotations from 'highcharts/modules/annotations';
// import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// import DataTable from 'react-data-table-component';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { generateContinuousData } from '../Utils/dataGenerator';

// HighchartsExporting(Highcharts);
// HighchartsAnnotations(Highcharts);
// HighchartsMore(Highcharts); // Initialize highcharts-more

// const HighchartsGraph = () => {
//   const [showSpikeLines, setShowSpikeLines] = useState(false);
//   const [compareWithTarget, setCompareWithTarget] = useState(false);
//   const [selectedCurrencies, setSelectedCurrencies] = useState(['AUD']);
//   const [summary, setSummary] = useState('');
//   const [startDate, setStartDate] = useState(new Date('2023-01-01'));
//   const [endDate, setEndDate] = useState(new Date('2023-01-30'));

//   const mockData = generateContinuousData('2023-01-01', 30); // 30 days of data

//   const latestSummaryRef = useRef('');

//   const data = [
//     {
//       name: 'Target',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
//       color: 'blue',
//       marker: { enabled: false },
//       zIndex: 1,
//     },
//     {
//       name: 'AUD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.AUD]),
//       color: 'orange',
//       marker: { enabled: false },
//     },
//     {
//       name: 'EUR',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.EUR]),
//       color: 'green',
//       marker: { enabled: false },
//     },
//     {
//       name: 'GBP',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.GBP]),
//       color: 'red',
//       marker: { enabled: false },
//     },
//     {
//       name: 'JPY',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.JPY]),
//       color: 'purple',
//       marker: { enabled: false },
//     },
//     {
//       name: 'USD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.USD]),
//       color: 'brown',
//       marker: { enabled: false },
//     }
//   ];

//   const calculateTotal = () => {
//     return mockData.map(d => {
//       return [new Date(d.Date).getTime(), selectedCurrencies.reduce((acc, curr) => acc + d[curr], 0)];
//     });
//   };

//   const totalValues = calculateTotal();

//   const totalLine = {
//     name: 'Total',
//     data: totalValues,
//     color: 'black',
//     marker: { enabled: false },
//     zIndex: 1,
//   };

//   const shadeData = {
//     name: 'Shaded Area',
//     data: totalValues.map((point, index) => ({
//       x: point[0],
//       low: Math.min(point[1], mockData[index].Target),
//       high: Math.max(point[1], mockData[index].Target)
//     })),
//     type: 'arearange',
//     lineWidth: 0,
//     linkedTo: ':previous',
//     color: 'rgba(0, 100, 80, 0.2)',
//     fillOpacity: 0.3,
//     zIndex: 0,
//     marker: {
//       enabled: false
//     }
//   };

//   const handleCurrencyChange = (e) => {
//     const options = e.target.options;
//     const selected = [];
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         selected.push(options[i].value);
//       }
//     }
//     setSelectedCurrencies(selected);
//   };

//   const getData = () => {
//     const compareData = [
//       totalLine,
//       ...data.filter(d => selectedCurrencies.includes(d.name)),
//       {
//         name: 'Target',
//         data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
//         color: 'blue',
//         marker: { enabled: false },
//         zIndex: 1,
//       },
//     ];
//     return compareWithTarget ? [...compareData, shadeData] : compareData;
//   };

//   const getFilteredData = (start, end) => {
//     return mockData.filter(d => {
//       const date = new Date(d.Date).getTime();
//       return date >= start.getTime() && date <= end.getTime();
//     });
//   };

//   const columns = [
//     { name: 'Date', selector: row => row.Date, sortable: true },
//     { name: 'Target', selector: row => row.Target, sortable: true },
//     { name: 'AUD', selector: row => row.AUD, sortable: true },
//     { name: 'EUR', selector: row => row.EUR, sortable: true },
//     { name: 'GBP', selector: row => row.GBP, sortable: true },
//     { name: 'JPY', selector: row => row.JPY, sortable: true },
//     { name: 'USD', selector: row => row.USD, sortable: true },
//     { name: 'Total', selector: row => row.Total, sortable: true },
//   ];

//   const tableData = getFilteredData(startDate, endDate).map(d => ({
//     Date: d.Date,
//     Target: d.Target,
//     AUD: d.AUD,
//     EUR: d.EUR,
//     GBP: d.GBP,
//     JPY: d.JPY,
//     USD: d.USD,
//     Total: totalValues[mockData.indexOf(d)][1]
//   }));

//   const handleTooltipFormatter = function () {
//     const points = this.points;
//     let targetValue = null;
//     let totalValue = null;

//     points.forEach(point => {
//       if (point.series.name === 'Target') {
//         targetValue = point.y;
//       }
//       if (point.series.name === 'Total') {
//         totalValue = point.y;
//       }
//     });

//     if (targetValue !== null && totalValue !== null) {
//       const difference = (totalValue - targetValue).toFixed(2);
//       const totalBreakdown = selectedCurrencies.map(currency => {
//         const point = points.find(p => p.series.name === currency);
//         return `${currency}: ${point.y.toFixed(2)}`;
//       }).join('<br>');

//       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `Difference: ${difference}<br><br>`;
//       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

//       // Update the summary ref instead of state
//       latestSummaryRef.current = summaryHTML;

//       return points.reduce((s, point) => {
//         return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//     }

//     return points.reduce((s, point) => {
//       return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//   };

//   // Update the summary state in a controlled manner
//   useEffect(() => {
//     const updateSummary = () => {
//       if (summary !== latestSummaryRef.current) {
//         setSummary(latestSummaryRef.current);
//       }
//     };

//     const interval = setInterval(updateSummary, 1000);
//     return () => clearInterval(interval);
//   }, [summary]);

//   const options = {
//     chart: {
//       type: 'line',
//       zoomType: 'x',
//       events: {
//         load: function () {
//           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         }
//       }
//     },
//     title: {
//       text: 'Currency Exchange Rates',
//     },
//     xAxis: {
//       type: 'datetime',
//       title: {
//         text: 'Date',
//       },
//       min: startDate.getTime(),
//       max: endDate.getTime(),
//     },
//     yAxis: {
//       title: {
//         text: 'Value',
//       },
//     },
//     tooltip: {
//       shared: true,
//       crosshairs: showSpikeLines,
//       formatter: handleTooltipFormatter,
//     },
//     series: getData(),
//     navigation: {
//       buttonOptions: {
//         enabled: true,
//       },
//     },
//     exporting: {
//       enabled: true,
//     },
//   };

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
//         <div>
//           <label>Select Currencies to Include in Total: </label>
//           <select
//             multiple
//             name="selectedCurrencies"
//             onChange={handleCurrencyChange}
//             value={selectedCurrencies}
//             style={{ height: '100px', width: '200px', padding: '5px', fontSize: '14px' }}
//           >
//             <option value="AUD">AUD</option>
//             <option value="EUR">EUR</option>
//             <option value="GBP">GBP</option>
//             <option value="JPY">JPY</option>
//             <option value="USD">USD</option>
//           </select>
//         </div>
//       </div>
//       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
//         <div>
//           <label>Select Date Range: </label>
//           <DatePicker
//             selected={startDate}
//             onChange={date => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//           />
//           <DatePicker
//             selected={endDate}
//             onChange={date => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//           />
//         </div>
//       </div>
//       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
//         <button
//           onClick={() => setShowSpikeLines(!showSpikeLines)}
//           style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginRight: '10px' }}
//         >
//           {showSpikeLines ? 'Hide Spike Lines' : 'Show Spike Lines'}
//         </button>
//         <button
//           onClick={() => setCompareWithTarget(!compareWithTarget)}
//           style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginRight: '10px' }}
//         >
//           {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
//         </button>
//       </div>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         containerProps={{ style: { width: '100%', height: '500px' } }}
//         updateArgs={[true, true, true]}
//       />
//       {compareWithTarget && (
//         <div style={{ border: '1px solid black', padding: '10px', marginTop: '20px', backgroundColor: '#f9f9f9' }}>
//           <h3>Summary</h3>
//           <div dangerouslySetInnerHTML={{ __html: summary }} />
//         </div>
//       )}
//       <DataTable
//         title="LCH Notional | Summary Table"
//         columns={columns}
//         data={tableData}
//         pagination
//         highlightOnHover
//         pointerOnHover
//         selectableRows
//         onSelectedRowsChange={({ selectedRows }) => {
//           if (selectedRows.length > 0) {
//             const start = new Date(selectedRows[0].Date);
//             const end = new Date(selectedRows[selectedRows.length - 1].Date);
//             setStartDate(start);
//             setEndDate(end);
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default HighchartsGraph;


// import React, { useState, useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsAnnotations from 'highcharts/modules/annotations';
// import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// import DataTable from 'react-data-table-component';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { generateContinuousData } from '../Utils/dataGenerator';
// import '../Styles/HighChartsGraph.css';

// HighchartsExporting(Highcharts);
// HighchartsAnnotations(Highcharts);
// HighchartsMore(Highcharts); // Initialize highcharts-more

// const HighchartsGraph = () => {
//   const [showSpikeLines, setShowSpikeLines] = useState(false);
//   const [compareWithTarget, setCompareWithTarget] = useState(false);
//   const [selectedCurrencies, setSelectedCurrencies] = useState(['AUD']);
//   const [summary, setSummary] = useState('');
//   const [startDate, setStartDate] = useState(new Date('2023-01-01'));
//   const [endDate, setEndDate] = useState(new Date('2023-01-30'));

//   const mockData = generateContinuousData('2023-01-01', 30); // 30 days of data

//   const latestSummaryRef = useRef('');

//   const data = [
//     {
//       name: 'Target',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
//       color: 'blue',
//       marker: { enabled: false },
//       zIndex: 1,
//     },
//     {
//       name: 'AUD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.AUD]),
//       color: 'orange',
//       marker: { enabled: false },
//     },
//     {
//       name: 'EUR',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.EUR]),
//       color: 'green',
//       marker: { enabled: false },
//     },
//     {
//       name: 'GBP',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.GBP]),
//       color: 'red',
//       marker: { enabled: false },
//     },
//     {
//       name: 'JPY',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.JPY]),
//       color: 'purple',
//       marker: { enabled: false },
//     },
//     {
//       name: 'USD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.USD]),
//       color: 'brown',
//       marker: { enabled: false },
//     }
//   ];

//   const calculateTotal = (filteredData) => {
//     return filteredData.map(d => {
//       return [new Date(d.Date).getTime(), selectedCurrencies.reduce((acc, curr) => acc + d[curr], 0)];
//     });
//   };

//   const getFilteredData = () => {
//     return mockData.filter(d => {
//       const date = new Date(d.Date).getTime();
//       return date >= startDate.getTime() && date <= endDate.getTime();
//     });
//   };

//   const filteredData = getFilteredData();
//   const totalValues = calculateTotal(filteredData);

//   const totalLine = {
//     name: 'Total',
//     data: totalValues,
//     color: 'black',
//     marker: { enabled: false },
//     zIndex: 1,
//   };

//   const shadeData = {
//     name: 'Shaded Area',
//     data: totalValues.map((point, index) => ({
//       x: point[0],
//       low: Math.min(point[1], filteredData[index].Target),
//       high: Math.max(point[1], filteredData[index].Target)
//     })),
//     type: 'arearange',
//     lineWidth: 0,
//     linkedTo: ':previous',
//     color: 'rgba(0, 100, 80, 0.2)',
//     fillOpacity: 0.3,
//     zIndex: 0,
//     marker: {
//       enabled: false
//     }
//   };

//   const handleCurrencyChange = (e) => {
//     const options = e.target.options;
//     const selected = [];
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         selected.push(options[i].value);
//       }
//     }
//     setSelectedCurrencies(selected);
//   };

//   const getData = () => {
//     const compareData = [
//       totalLine,
//       ...data.filter(d => selectedCurrencies.includes(d.name)),
//       {
//         name: 'Target',
//         data: filteredData.map(d => [new Date(d.Date).getTime(), d.Target]),
//         color: 'blue',
//         marker: { enabled: false },
//         zIndex: 1,
//       },
//     ];
//     return compareWithTarget ? [...compareData, shadeData] : compareData;
//   };

//   const columns = [
//     { name: 'Date', selector: row => row.Date, sortable: true },
//     { name: 'Target', selector: row => row.Target, sortable: true },
//     { name: 'AUD', selector: row => row.AUD, sortable: true },
//     { name: 'EUR', selector: row => row.EUR, sortable: true },
//     { name: 'GBP', selector: row => row.GBP, sortable: true },
//     { name: 'JPY', selector: row => row.JPY, sortable: true },
//     { name: 'USD', selector: row => row.USD, sortable: true },
//     { name: 'Total', selector: row => row.Total, sortable: true },
//   ];

//   const tableData = filteredData.map(d => ({
//     Date: d.Date,
//     Target: d.Target,
//     AUD: d.AUD,
//     EUR: d.EUR,
//     GBP: d.GBP,
//     JPY: d.JPY,
//     USD: d.USD,
//     Total: totalValues[filteredData.indexOf(d)][1]
//   }));

//   const handleTooltipFormatter = function () {
//     const points = this.points;
//     let targetValue = null;
//     let totalValue = null;

//     points.forEach(point => {
//       if (point.series.name === 'Target') {
//         targetValue = point.y;
//       }
//       if (point.series.name === 'Total') {
//         totalValue = point.y;
//       }
//     });

//     if (targetValue !== null && totalValue !== null) {
//       const difference = (totalValue - targetValue).toFixed(2);
//       const totalBreakdown = selectedCurrencies.map(currency => {
//         const point = points.find(p => p.series.name === currency);
//         return `${currency}: ${point.y.toFixed(2)}`;
//       }).join('<br>');

//       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `Difference: ${difference}<br><br>`;
//       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

//       // Update the summary ref instead of state
//       latestSummaryRef.current = summaryHTML;

//       return points.reduce((s, point) => {
//         return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//     }

//     return points.reduce((s, point) => {
//       return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//   };

//   // Update the summary state in a controlled manner
//   useEffect(() => {
//     const updateSummary = () => {
//       if (summary !== latestSummaryRef.current) {
//         setSummary(latestSummaryRef.current);
//       }
//     };

//     const interval = setInterval(updateSummary, 1000);
//     return () => clearInterval(interval);
//   }, [summary]);

//   const options = {
//     chart: {
//       type: 'line',
//       zoomType: 'x',
//       events: {
//         load: function () {
//           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         }
//       }
//     },
//     title: {
//       text: 'Currency Exchange Rates',
//     },
//     xAxis: {
//       type: 'datetime',
//       title: {
//         text: 'Date',
//       },
//       min: startDate.getTime(),
//       max: endDate.getTime(),
//     },
//     yAxis: {
//       title: {
//         text: 'Value',
//       },
//     },
//     tooltip: {
//       shared: true,
//       crosshairs: showSpikeLines,
//       formatter: handleTooltipFormatter,
//     },
//     series: getData(),
//     navigation: {
//       buttonOptions: {
//         enabled: true,
//       },
//     },
//     exporting: {
//       enabled: true,
//     },
//   };

//   useEffect(() => {
//     Highcharts.charts.forEach(chart => {
//       if (chart) {
//         chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         chart.series.forEach(series => {
//           series.setData(getData().find(s => s.name === series.name).data);
//         });
//       }
//     });
//   }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines]);

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
//         <div>
//           <label>Select Currencies to Include in Total: </label>
//           <select
//             multiple
//             name="selectedCurrencies"
//             onChange={handleCurrencyChange}
//             value={selectedCurrencies}
//             style={{ height: '100px', width: '200px', padding: '5px', fontSize: '14px' }}
//           >
//             <option value="AUD">AUD</option>
//             <option value="EUR">EUR</option>
//             <option value="GBP">GBP</option>
//             <option value="JPY">JPY</option>
//             <option value="USD">USD</option>
//           </select>
//         </div>
//       </div>
//       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
//         <div>
//           <label>Select Date Range: </label>
//           <DatePicker
//             selected={startDate}
//             onChange={date => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//           />
//           <DatePicker
//             selected={endDate}
//             onChange={date => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//           />
//         </div>
//       </div>
//       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
//         <button
//           onClick={() => setShowSpikeLines(!showSpikeLines)}
//           style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginRight: '10px' }}
//         >
//           {showSpikeLines ? 'Hide Spike Lines' : 'Show Spike Lines'}
//         </button>
//         <button
//           onClick={() => setCompareWithTarget(!compareWithTarget)}
//           style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginRight: '10px' }}
//         >
//           {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
//         </button>
//       </div>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         containerProps={{ style: { width: '100%', height: '500px' } }}
//         updateArgs={[true, true, true]}
//       />
//       {compareWithTarget && (
//         <div style={{ border: '1px solid black', padding: '10px', marginTop: '20px', backgroundColor: '#f9f9f9' }}>
//           <h3>Summary</h3>
//           <div dangerouslySetInnerHTML={{ __html: summary }} />
//         </div>
//       )}
//       <DataTable
//         title="LCH Notional | Summary Table"
//         columns={columns}
//         data={tableData}
//         pagination
//         highlightOnHover
//         pointerOnHover
//         selectableRows
//         onSelectedRowsChange={({ selectedRows }) => {
//           if (selectedRows.length > 0) {
//             const start = new Date(selectedRows[0].Date);
//             const end = new Date(selectedRows[selectedRows.length - 1].Date);
//             setStartDate(start);
//             setEndDate(end);
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default HighchartsGraph;


//WORKING VERSION


// import React, { useState, useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsAnnotations from 'highcharts/modules/annotations';
// import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// import DataTable from 'react-data-table-component';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { generateContinuousData } from '../Utils/dataGenerator';
// import '../Styles/HighChartsGraph.css'; // Import the CSS file

// HighchartsExporting(Highcharts);
// HighchartsAnnotations(Highcharts);
// HighchartsMore(Highcharts); // Initialize highcharts-more

// const HighchartsGraph = () => {
//   const [showSpikeLines, setShowSpikeLines] = useState(false);
//   const [compareWithTarget, setCompareWithTarget] = useState(false);
//   const [selectedCurrencies, setSelectedCurrencies] = useState(['AUD']);
//   const [summary, setSummary] = useState('');
//   const [startDate, setStartDate] = useState(new Date('2023-01-01'));
//   const [endDate, setEndDate] = useState(new Date('2023-01-30'));

//   const mockData = generateContinuousData('2023-01-01', 30); // 30 days of data

//   const latestSummaryRef = useRef('');

//   const data = [
//     {
//       name: 'Target',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
//       color: 'blue',
//       marker: { enabled: false },
//       zIndex: 1,
//     },
//     {
//       name: 'AUD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.AUD]),
//       color: 'orange',
//       marker: { enabled: false },
//     },
//     {
//       name: 'EUR',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.EUR]),
//       color: 'green',
//       marker: { enabled: false },
//     },
//     {
//       name: 'GBP',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.GBP]),
//       color: 'red',
//       marker: { enabled: false },
//     },
//     {
//       name: 'JPY',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.JPY]),
//       color: 'purple',
//       marker: { enabled: false },
//     },
//     {
//       name: 'USD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.USD]),
//       color: 'brown',
//       marker: { enabled: false },
//     }
//   ];

//   const calculateTotal = (filteredData) => {
//     return filteredData.map(d => {
//       return [new Date(d.Date).getTime(), selectedCurrencies.reduce((acc, curr) => acc + d[curr], 0)];
//     });
//   };

//   const getFilteredData = () => {
//     return mockData.filter(d => {
//       const date = new Date(d.Date).getTime();
//       return date >= startDate.getTime() && date <= endDate.getTime();
//     });
//   };

//   const filteredData = getFilteredData();
//   const totalValues = calculateTotal(filteredData);

//   const totalLine = {
//     name: 'Total',
//     data: totalValues,
//     color: 'black',
//     marker: { enabled: false },
//     zIndex: 1,
//   };

//   const shadeData = {
//     name: 'Shaded Area',
//     data: totalValues.map((point, index) => ({
//       x: point[0],
//       low: Math.min(point[1], filteredData[index].Target),
//       high: Math.max(point[1], filteredData[index].Target)
//     })),
//     type: 'arearange',
//     lineWidth: 0,
//     linkedTo: ':previous',
//     color: 'rgba(0, 100, 80, 0.2)',
//     fillOpacity: 0.3,
//     zIndex: 0,
//     marker: {
//       enabled: false
//     }
//   };

//   const handleCurrencyChange = (e) => {
//     const options = e.target.options;
//     const selected = [];
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         selected.push(options[i].value);
//       }
//     }
//     setSelectedCurrencies(selected);
//   };

//   const getData = () => {
//     const compareData = [
//       totalLine,
//       ...data.filter(d => selectedCurrencies.includes(d.name)),
//       {
//         name: 'Target',
//         data: filteredData.map(d => [new Date(d.Date).getTime(), d.Target]),
//         color: 'blue',
//         marker: { enabled: false },
//         zIndex: 1,
//       },
//     ];
//     return compareWithTarget ? [...compareData, shadeData] : compareData;
//   };

//   const columns = [
//     { name: 'Date', selector: row => row.Date, sortable: true },
//     { name: 'Target', selector: row => row.Target, sortable: true },
//     { name: 'AUD', selector: row => row.AUD, sortable: true },
//     { name: 'EUR', selector: row => row.EUR, sortable: true },
//     { name: 'GBP', selector: row => row.GBP, sortable: true },
//     { name: 'JPY', selector: row => row.JPY, sortable: true },
//     { name: 'USD', selector: row => row.USD, sortable: true },
//     { name: 'Total', selector: row => row.Total, sortable: true },
//   ];

//   const tableData = filteredData.map(d => ({
//     Date: d.Date,
//     Target: d.Target,
//     AUD: d.AUD,
//     EUR: d.EUR,
//     GBP: d.GBP,
//     JPY: d.JPY,
//     USD: d.USD,
//     Total: totalValues[filteredData.indexOf(d)][1]
//   }));

//   const handleTooltipFormatter = function () {
//     const points = this.points;
//     let targetValue = null;
//     let totalValue = null;

//     points.forEach(point => {
//       if (point.series.name === 'Target') {
//         targetValue = point.y;
//       }
//       if (point.series.name === 'Total') {
//         totalValue = point.y;
//       }
//     });

//     if (targetValue !== null && totalValue !== null) {
//       const difference = (totalValue - targetValue).toFixed(2);
//       const totalBreakdown = selectedCurrencies.map(currency => {
//         const point = points.find(p => p.series.name === currency);
//         return `${currency}: ${point.y.toFixed(2)}`;
//       }).join('<br>');

//       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `Difference: ${difference}<br><br>`;
//       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

//       // Update the summary ref instead of state
//       latestSummaryRef.current = summaryHTML;

//       return points.reduce((s, point) => {
//         return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//     }

//     return points.reduce((s, point) => {
//       return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//   };

//   // Update the summary state in a controlled manner
//   useEffect(() => {
//     const updateSummary = () => {
//       if (summary !== latestSummaryRef.current) {
//         setSummary(latestSummaryRef.current);
//       }
//     };

//     const interval = setInterval(updateSummary, 1000);
//     return () => clearInterval(interval);
//   }, [summary]);

//   const options = {
//     chart: {
//       type: 'line',
//       zoomType: 'x',
//       events: {
//         load: function () {
//           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         }
//       }
//     },
//     title: {
//       text: 'Currency Exchange Rates',
//     },
//     xAxis: {
//       type: 'datetime',
//       title: {
//         text: 'Date',
//       },
//       min: startDate.getTime(),
//       max: endDate.getTime(),
//     },
//     yAxis: {
//       title: {
//         text: 'Value',
//       },
//     },
//     tooltip: {
//       shared: true,
//       crosshairs: showSpikeLines,
//       formatter: handleTooltipFormatter,
//     },
//     series: getData(),
//     navigation: {
//       buttonOptions: {
//         enabled: true,
//       },
//     },
//     exporting: {
//       enabled: true,
//     },
//   };

//   useEffect(() => {
//     Highcharts.charts.forEach(chart => {
//       if (chart) {
//         chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         chart.series.forEach(series => {
//           series.setData(getData().find(s => s.name === series.name).data);
//         });
//       }
//     });
//   }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines]);

//   return (
//     <div className="highcharts-container">
//       <div className="currency-selector">
//         <label>Select Currencies to Include in Total: </label>
//         <select
//           multiple
//           name="selectedCurrencies"
//           onChange={handleCurrencyChange}
//           value={selectedCurrencies}
//           className="currency-dropdown"
//         >
//           <option value="AUD">AUD</option>
//           <option value="EUR">EUR</option>
//           <option value="GBP">GBP</option>
//           <option value="JPY">JPY</option>
//           <option value="USD">USD</option>
//         </select>
//       </div>
//       <div className="date-picker">
//         <label>Select Date Range: </label>
//         <DatePicker
//           selected={startDate}
//           onChange={date => setStartDate(date)}
//           selectsStart
//           startDate={startDate}
//           endDate={endDate}
//           className="date-input"
//         />
//         <DatePicker
//           selected={endDate}
//           onChange={date => setEndDate(date)}
//           selectsEnd
//           startDate={startDate}
//           endDate={endDate}
//           minDate={startDate}
//           className="date-input"
//         />
//       </div>
//       <div className="button-group">
//         <button
//           onClick={() => setShowSpikeLines(!showSpikeLines)}
//           className="toggle-button"
//         >
//           {showSpikeLines ? 'Hide Spike Lines' : 'Show Spike Lines'}
//         </button>
//         <button
//           onClick={() => setCompareWithTarget(!compareWithTarget)}
//           className="toggle-button"
//         >
//           {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
//         </button>
//       </div>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//         containerProps={{ className: 'chart-container' }}
//         updateArgs={[true, true, true]}
//       />
//       {compareWithTarget && (
//         <div className="summary-box">
//           <h3>Summary</h3>
//           <div dangerouslySetInnerHTML={{ __html: summary }} />
//         </div>
//       )}
//       <DataTable
//         title="LCH Notional | Summary Table"
//         columns={columns}
//         data={tableData}
//         pagination
//         highlightOnHover
//         pointerOnHover
//         selectableRows
//         onSelectedRowsChange={({ selectedRows }) => {
//           if (selectedRows.length > 0) {
//             const start = new Date(selectedRows[0].Date);
//             const end = new Date(selectedRows[selectedRows.length - 1].Date);
//             setStartDate(start);
//             setEndDate(end);
//           }
//         }}
//         customStyles={customTableStyles}
//       />
//     </div>
//   );
// };

// const customTableStyles = {
//   header: {
//     style: {
//       fontSize: '22px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#8B0000',
//     },
//   },
//   rows: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#4B0000',
//       '&:not(:last-of-type)': {
//         borderBottomStyle: 'solid',
//         borderBottomWidth: '1px',
//         borderBottomColor: '#8B0000',
//       },
//     },
//   },
//   headCells: {
//     style: {
//       fontSize: '18px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#8B0000',
//     },
//   },
//   cells: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#4B0000',
//     },
//   },
// };

// export default HighchartsGraph;

//WORKING - GOOD COLOURS BUT NOT RESIZABLE 

// import React, { useState, useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsAnnotations from 'highcharts/modules/annotations';
// import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// import DataTable from 'react-data-table-component';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { generateContinuousData } from '../Utils/dataGenerator';
// import '../Styles/HighChartsGraph.css'; // Import the CSS file

// HighchartsExporting(Highcharts);
// HighchartsAnnotations(Highcharts);
// HighchartsMore(Highcharts); // Initialize highcharts-more

// const HighchartsGraph = () => {
//   const [showSpikeLines, setShowSpikeLines] = useState(false);
//   const [compareWithTarget, setCompareWithTarget] = useState(false);
//   const [selectedCurrencies, setSelectedCurrencies] = useState(['AUD']);
//   const [summary, setSummary] = useState('');
//   const [startDate, setStartDate] = useState(new Date('2023-01-01'));
//   const [endDate, setEndDate] = useState(new Date('2023-01-30'));

//   const mockData = generateContinuousData('2023-01-01', 30); // 30 days of data

//   const latestSummaryRef = useRef('');

//   const data = [
//     {
//       name: 'Target',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
//       color: '#007bff',
//       marker: { enabled: false },
//       zIndex: 1,
//     },
//     {
//       name: 'AUD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.AUD]),
//       color: '#ff6f61',
//       marker: { enabled: false },
//     },
//     {
//       name: 'EUR',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.EUR]),
//       color: '#28a745',
//       marker: { enabled: false },
//     },
//     {
//       name: 'GBP',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.GBP]),
//       color: '#dc3545',
//       marker: { enabled: false },
//     },
//     {
//       name: 'JPY',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.JPY]),
//       color: '#6f42c1',
//       marker: { enabled: false },
//     },
//     {
//       name: 'USD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.USD]),
//       color: '#ffc107',
//       marker: { enabled: false },
//     }
//   ];

//   const calculateTotal = (filteredData) => {
//     return filteredData.map(d => {
//       return [new Date(d.Date).getTime(), selectedCurrencies.reduce((acc, curr) => acc + d[curr], 0)];
//     });
//   };

//   const getFilteredData = () => {
//     return mockData.filter(d => {
//       const date = new Date(d.Date).getTime();
//       return date >= startDate.getTime() && date <= endDate.getTime();
//     });
//   };

//   const filteredData = getFilteredData();
//   const totalValues = calculateTotal(filteredData);

//   const totalLine = {
//     name: 'Total',
//     data: totalValues,
//     color: '#343a40',
//     marker: { enabled: false },
//     zIndex: 1,
//   };

//   const shadeData = {
//     name: 'Shaded Area',
//     data: totalValues.map((point, index) => ({
//       x: point[0],
//       low: Math.min(point[1], filteredData[index].Target),
//       high: Math.max(point[1], filteredData[index].Target)
//     })),
//     type: 'arearange',
//     lineWidth: 0,
//     linkedTo: ':previous',
//     color: 'rgba(0, 123, 255, 0.2)',
//     fillOpacity: 0.3,
//     zIndex: 0,
//     marker: {
//       enabled: false
//     }
//   };

//   const handleCurrencyChange = (e) => {
//     const options = e.target.options;
//     const selected = [];
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         selected.push(options[i].value);
//       }
//     }
//     setSelectedCurrencies(selected);
//   };

//   const getData = () => {
//     const compareData = [
//       totalLine,
//       ...data.filter(d => selectedCurrencies.includes(d.name)),
//       {
//         name: 'Target',
//         data: filteredData.map(d => [new Date(d.Date).getTime(), d.Target]),
//         color: '#007bff',
//         marker: { enabled: false },
//         zIndex: 1,
//       },
//     ];
//     return compareWithTarget ? [...compareData, shadeData] : compareData;
//   };

//   const columns = [
//     { name: 'Date', selector: row => row.Date, sortable: true },
//     { name: 'Target', selector: row => row.Target, sortable: true },
//     { name: 'AUD', selector: row => row.AUD, sortable: true },
//     { name: 'EUR', selector: row => row.EUR, sortable: true },
//     { name: 'GBP', selector: row => row.GBP, sortable: true },
//     { name: 'JPY', selector: row => row.JPY, sortable: true },
//     { name: 'USD', selector: row => row.USD, sortable: true },
//     { name: 'Total', selector: row => row.Total, sortable: true },
//   ];

//   const tableData = filteredData.map(d => ({
//     Date: d.Date,
//     Target: d.Target,
//     AUD: d.AUD,
//     EUR: d.EUR,
//     GBP: d.GBP,
//     JPY: d.JPY,
//     USD: d.USD,
//     Total: totalValues[filteredData.indexOf(d)][1]
//   }));

//   const handleTooltipFormatter = function () {
//     const points = this.points;
//     let targetValue = null;
//     let totalValue = null;

//     points.forEach(point => {
//       if (point.series.name === 'Target') {
//         targetValue = point.y;
//       }
//       if (point.series.name === 'Total') {
//         totalValue = point.y;
//       }
//     });

//     if (targetValue !== null && totalValue !== null) {
//       const difference = (totalValue - targetValue).toFixed(2);
//       const totalBreakdown = selectedCurrencies.map(currency => {
//         const point = points.find(p => p.series.name === currency);
//         return `${currency}: ${point.y.toFixed(2)}`;
//       }).join('<br>');

//       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `Difference: ${difference}<br><br>`;
//       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

//       // Update the summary ref instead of state
//       latestSummaryRef.current = summaryHTML;

//       return points.reduce((s, point) => {
//         return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//     }

//     return points.reduce((s, point) => {
//       return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//   };

//   // Update the summary state in a controlled manner
//   useEffect(() => {
//     const updateSummary = () => {
//       if (summary !== latestSummaryRef.current) {
//         setSummary(latestSummaryRef.current);
//       }
//     };

//     const interval = setInterval(updateSummary, 1000);
//     return () => clearInterval(interval);
//   }, [summary]);

//   const options = {
//     chart: {
//       type: 'line',
//       zoomType: 'x',
//       events: {
//         load: function () {
//           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         }
//       }
//     },
//     title: {
//       text: 'Currency Exchange Rates',
//     },
//     xAxis: {
//       type: 'datetime',
//       title: {
//         text: 'Date',
//       },
//       min: startDate.getTime(),
//       max: endDate.getTime(),
//     },
//     yAxis: {
//       title: {
//         text: 'Value',
//       },
//     },
//     tooltip: {
//       shared: true,
//       crosshairs: showSpikeLines,
//       formatter: handleTooltipFormatter,
//     },
//     series: getData(),
//     navigation: {
//       buttonOptions: {
//         enabled: true,
//       },
//     },
//     exporting: {
//       enabled: true,
//     },
//   };

//   useEffect(() => {
//     Highcharts.charts.forEach(chart => {
//       if (chart) {
//         chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         chart.series.forEach(series => {
//           series.setData(getData().find(s => s.name === series.name).data);
//         });
//       }
//     });
//   }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines]);

//   return (
//     <div className="highcharts-container">
//       <div className="side-panel">
//         <div className="side-panel-header">
//           <h2>Dashboard</h2>
//           <img src="/path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
//           <p className="welcome-message">Welcome back, User!</p>
//         </div>
//         <div className="currency-selector">
//           <label>Select Currencies to Include in Total: </label>
//           <select
//             multiple
//             name="selectedCurrencies"
//             onChange={handleCurrencyChange}
//             value={selectedCurrencies}
//             className="currency-dropdown"
//           >
//             <option value="AUD">AUD</option>
//             <option value="EUR">EUR</option>
//             <option value="GBP">GBP</option>
//             <option value="JPY">JPY</option>
//             <option value="USD">USD</option>
//           </select>
//         </div>
//         <div className="date-picker">
//           <label>Select Date Range: </label>
//           <DatePicker
//             selected={startDate}
//             onChange={date => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//             className="date-input"
//           />
//           <DatePicker
//             selected={endDate}
//             onChange={date => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//             className="date-input"
//           />
//         </div>
//         <div className="button-group">
//           <button
//             onClick={() => setShowSpikeLines(!showSpikeLines)}
//             className="toggle-button"
//           >
//             {showSpikeLines ? 'Hide Spike Lines' : 'Show Spike Lines'}
//           </button>
//           <button
//             onClick={() => setCompareWithTarget(!compareWithTarget)}
//             className="toggle-button"
//           >
//             {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
//           </button>
//         </div>
//       </div>
//       <div className="main-panel">
//         <HighchartsReact
//           highcharts={Highcharts}
//           options={options}
//           containerProps={{ className: 'chart-container' }}
//           updateArgs={[true, true, true]}
//         />
//         {compareWithTarget && (
//           <div className="summary-box">
//             <h3>Summary</h3>
//             <div dangerouslySetInnerHTML={{ __html: summary }} />
//           </div>
//         )}
//         <DataTable
//           title="LCH Notional | Summary Table"
//           columns={columns}
//           data={tableData}
//           pagination
//           highlightOnHover
//           pointerOnHover
//           selectableRows
//           onSelectedRowsChange={({ selectedRows }) => {
//             if (selectedRows.length > 0) {
//               const start = new Date(selectedRows[0].Date);
//               const end = new Date(selectedRows[selectedRows.length - 1].Date);
//               setStartDate(start);
//               setEndDate(end);
//             }
//           }}
//           customStyles={customTableStyles}
//         />
//       </div>
//     </div>
//   );
// };

// const customTableStyles = {
//   header: {
//     style: {
//       fontSize: '22px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   rows: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//       '&:not(:last-of-type)': {
//         borderBottomStyle: 'solid',
//         borderBottomWidth: '1px',
//         borderBottomColor: '#343a40',
//       },
//     },
//   },
//   headCells: {
//     style: {
//       fontSize: '18px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   cells: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//     },
//   },
// };

// export default HighchartsGraph;


// import React, { useState, useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsAnnotations from 'highcharts/modules/annotations';
// import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// import DataTable from 'react-data-table-component';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { generateContinuousData } from '../Utils/dataGenerator';
// import '../Styles/HighChartsGraph.css'; // Import the CSS file

// HighchartsExporting(Highcharts);
// HighchartsAnnotations(Highcharts);
// HighchartsMore(Highcharts); // Initialize highcharts-more

// const HighchartsGraph = () => {
//   const [showSpikeLines, setShowSpikeLines] = useState(false);
//   const [compareWithTarget, setCompareWithTarget] = useState(false);
//   const [selectedCurrencies, setSelectedCurrencies] = useState(['AUD']);
//   const [summary, setSummary] = useState('');
//   const [startDate, setStartDate] = useState(new Date('2023-01-01'));
//   const [endDate, setEndDate] = useState(new Date('2023-01-30'));

//   const mockData = generateContinuousData('2023-01-01', 30); // 30 days of data

//   const latestSummaryRef = useRef('');

//   const data = [
//     {
//       name: 'Target',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
//       color: '#007bff',
//       marker: { enabled: false },
//       zIndex: 1,
//     },
//     {
//       name: 'AUD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.AUD]),
//       color: '#ff6f61',
//       marker: { enabled: false },
//     },
//     {
//       name: 'EUR',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.EUR]),
//       color: '#28a745',
//       marker: { enabled: false },
//     },
//     {
//       name: 'GBP',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.GBP]),
//       color: '#dc3545',
//       marker: { enabled: false },
//     },
//     {
//       name: 'JPY',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.JPY]),
//       color: '#6f42c1',
//       marker: { enabled: false },
//     },
//     {
//       name: 'USD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.USD]),
//       color: '#ffc107',
//       marker: { enabled: false },
//     }
//   ];

//   const calculateTotal = (filteredData) => {
//     return filteredData.map(d => {
//       return [new Date(d.Date).getTime(), selectedCurrencies.reduce((acc, curr) => acc + d[curr], 0)];
//     });
//   };

//   const getFilteredData = () => {
//     return mockData.filter(d => {
//       const date = new Date(d.Date).getTime();
//       return date >= startDate.getTime() && date <= endDate.getTime();
//     });
//   };

//   const filteredData = getFilteredData();
//   const totalValues = calculateTotal(filteredData);

//   const totalLine = {
//     name: 'Total',
//     data: totalValues,
//     color: '#343a40',
//     marker: { enabled: false },
//     zIndex: 1,
//   };

//   const shadeData = {
//     name: 'Shaded Area',
//     data: totalValues.map((point, index) => ({
//       x: point[0],
//       low: Math.min(point[1], filteredData[index].Target),
//       high: Math.max(point[1], filteredData[index].Target)
//     })),
//     type: 'arearange',
//     lineWidth: 0,
//     linkedTo: ':previous',
//     color: 'rgba(0, 123, 255, 0.2)',
//     fillOpacity: 0.3,
//     zIndex: 0,
//     marker: {
//       enabled: false
//     }
//   };

//   const handleCurrencyChange = (e) => {
//     const options = e.target.options;
//     const selected = [];
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         selected.push(options[i].value);
//       }
//     }
//     setSelectedCurrencies(selected);
//   };

//   const getData = () => {
//     const compareData = [
//       totalLine,
//       ...data.filter(d => selectedCurrencies.includes(d.name)),
//       {
//         name: 'Target',
//         data: filteredData.map(d => [new Date(d.Date).getTime(), d.Target]),
//         color: '#007bff',
//         marker: { enabled: false },
//         zIndex: 1,
//       },
//     ];
//     return compareWithTarget ? [...compareData, shadeData] : compareData;
//   };

//   const columns = [
//     { name: 'Date', selector: row => row.Date, sortable: true },
//     { name: 'Target', selector: row => row.Target, sortable: true },
//     { name: 'AUD', selector: row => row.AUD, sortable: true },
//     { name: 'EUR', selector: row => row.EUR, sortable: true },
//     { name: 'GBP', selector: row => row.GBP, sortable: true },
//     { name: 'JPY', selector: row => row.JPY, sortable: true },
//     { name: 'USD', selector: row => row.USD, sortable: true },
//     { name: 'Total', selector: row => row.Total, sortable: true },
//   ];

//   const tableData = filteredData.map(d => ({
//     Date: d.Date,
//     Target: d.Target,
//     AUD: d.AUD,
//     EUR: d.EUR,
//     GBP: d.GBP,
//     JPY: d.JPY,
//     USD: d.USD,
//     Total: totalValues[filteredData.indexOf(d)][1]
//   }));

//   const handleTooltipFormatter = function () {
//     const points = this.points;
//     let targetValue = null;
//     let totalValue = null;

//     points.forEach(point => {
//       if (point.series.name === 'Target') {
//         targetValue = point.y;
//       }
//       if (point.series.name === 'Total') {
//         totalValue = point.y;
//       }
//     });

//     if (targetValue !== null && totalValue !== null) {
//       const difference = (totalValue - targetValue).toFixed(2);
//       const totalBreakdown = selectedCurrencies.map(currency => {
//         const point = points.find(p => p.series.name === currency);
//         return `${currency}: ${point.y.toFixed(2)}`;
//       }).join('<br>');

//       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `Difference: ${difference}<br><br>`;
//       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

//       // Update the summary ref instead of state
//       latestSummaryRef.current = summaryHTML;

//       return points.reduce((s, point) => {
//         return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//     }

//     return points.reduce((s, point) => {
//       return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//   };

//   // Update the summary state in a controlled manner
//   useEffect(() => {
//     const updateSummary = () => {
//       if (summary !== latestSummaryRef.current) {
//         setSummary(latestSummaryRef.current);
//       }
//     };

//     const interval = setInterval(updateSummary, 1000);
//     return () => clearInterval(interval);
//   }, [summary]);

//   const options = {
//     chart: {
//       type: 'line',
//       zoomType: 'x',
//       events: {
//         load: function () {
//           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         }
//       }
//     },
//     title: {
//       text: 'Currency Exchange Rates',
//     },
//     xAxis: {
//       type: 'datetime',
//       title: {
//         text: 'Date',
//       },
//       min: startDate.getTime(),
//       max: endDate.getTime(),
//     },
//     yAxis: {
//       title: {
//         text: 'Value',
//       },
//     },
//     tooltip: {
//       shared: true,
//       crosshairs: showSpikeLines,
//       formatter: handleTooltipFormatter,
//     },
//     series: getData(),
//     navigation: {
//       buttonOptions: {
//         enabled: true,
//       },
//     },
//     exporting: {
//       enabled: true,
//     },
//   };

//   useEffect(() => {
//     Highcharts.charts.forEach(chart => {
//       if (chart) {
//         chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         chart.series.forEach(series => {
//           series.setData(getData().find(s => s.name === series.name).data);
//         });
//       }
//     });
//   }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines]);

//   return (
//     <div className="highcharts-container">
//       <div className="side-panel">
//         <div className="side-panel-header">
//           <h2>Dashboard</h2>
//           <img src="/path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
//           <p className="welcome-message">Welcome back, User!</p>
//         </div>
//         <div className="currency-selector">
//           <label>Select Currencies to Include in Total: </label>
//           <select
//             multiple
//             name="selectedCurrencies"
//             onChange={handleCurrencyChange}
//             value={selectedCurrencies}
//             className="currency-dropdown"
//           >
//             <option value="AUD">AUD</option>
//             <option value="EUR">EUR</option>
//             <option value="GBP">GBP</option>
//             <option value="JPY">JPY</option>
//             <option value="USD">USD</option>
//           </select>
//         </div>
//         <div className="date-picker">
//           <label>Select Date Range: </label>
//           <DatePicker
//             selected={startDate}
//             onChange={date => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//             className="date-input"
//           />
//           <DatePicker
//             selected={endDate}
//             onChange={date => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//             className="date-input"
//           />
//         </div>
//         <div className="button-group">
//           <button
//             onClick={() => setShowSpikeLines(!showSpikeLines)}
//             className="toggle-button"
//           >
//             {showSpikeLines ? 'Hide Spike Lines' : 'Show Spike Lines'}
//           </button>
//           <button
//             onClick={() => setCompareWithTarget(!compareWithTarget)}
//             className="toggle-button"
//           >
//             {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
//           </button>
//         </div>
//       </div>
//       <div className="main-panel">
//         <HighchartsReact
//           highcharts={Highcharts}
//           options={options}
//           containerProps={{ className: 'chart-container' }}
//           updateArgs={[true, true, true]}
//         />
//         {compareWithTarget && (
//           <div className="summary-box">
//             <h3>Summary</h3>
//             <div dangerouslySetInnerHTML={{ __html: summary }} />
//           </div>
//         )}
//         <DataTable
//           title="LCH Notional | Summary Table"
//           columns={columns}
//           data={tableData}
//           pagination
//           highlightOnHover
//           pointerOnHover
//           selectableRows
//           onSelectedRowsChange={({ selectedRows }) => {
//             if (selectedRows.length > 0) {
//               const start = new Date(selectedRows[0].Date);
//               const end = new Date(selectedRows[selectedRows.length - 1].Date);
//               setStartDate(start);
//               setEndDate(end);
//             }
//           }}
//           customStyles={customTableStyles}
//         />
//       </div>
//     </div>
//   );
// };

// const customTableStyles = {
//   header: {
//     style: {
//       fontSize: '22px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   rows: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//       '&:not(:last-of-type)': {
//         borderBottomStyle: 'solid',
//         borderBottomWidth: '1px',
//         borderBottomColor: '#343a40',
//       },
//     },
//   },
//   headCells: {
//     style: {
//       fontSize: '18px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   cells: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//     },
//   },
// };

// export default HighchartsGraph;

// import React, { useState, useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsAnnotations from 'highcharts/modules/annotations';
// import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// import DataTable from 'react-data-table-component';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { generateContinuousData } from '../Utils/dataGenerator';
// import '../Styles/HighChartsGraph.css'; // Import the CSS file

// HighchartsExporting(Highcharts);
// HighchartsAnnotations(Highcharts);
// HighchartsMore(Highcharts); // Initialize highcharts-more

// const HighchartsGraph = () => {
//   const [showSpikeLines, setShowSpikeLines] = useState(false);
//   const [compareWithTarget, setCompareWithTarget] = useState(false);
//   const [selectedCurrencies, setSelectedCurrencies] = useState(['AUD']);
//   const [summary, setSummary] = useState('');
//   const [startDate, setStartDate] = useState(new Date('2023-01-01'));
//   const [endDate, setEndDate] = useState(new Date('2023-01-30'));

//   const mockData = generateContinuousData('2023-01-01', 30); // 30 days of data

//   const latestSummaryRef = useRef('');

//   const data = [
//     {
//       name: 'Target',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
//       color: '#007bff',
//       marker: { enabled: false },
//       zIndex: 1,
//     },
//     {
//       name: 'AUD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.AUD]),
//       color: '#ff6f61',
//       marker: { enabled: false },
//     },
//     {
//       name: 'EUR',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.EUR]),
//       color: '#28a745',
//       marker: { enabled: false },
//     },
//     {
//       name: 'GBP',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.GBP]),
//       color: '#dc3545',
//       marker: { enabled: false },
//     },
//     {
//       name: 'JPY',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.JPY]),
//       color: '#6f42c1',
//       marker: { enabled: false },
//     },
//     {
//       name: 'USD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.USD]),
//       color: '#ffc107',
//       marker: { enabled: false },
//     }
//   ];

//   const calculateTotal = (filteredData) => {
//     return filteredData.map(d => {
//       return [new Date(d.Date).getTime(), selectedCurrencies.reduce((acc, curr) => acc + d[curr], 0)];
//     });
//   };

//   const getFilteredData = () => {
//     return mockData.filter(d => {
//       const date = new Date(d.Date).getTime();
//       return date >= startDate.getTime() && date <= endDate.getTime();
//     });
//   };

//   const filteredData = getFilteredData();
//   const totalValues = calculateTotal(filteredData);

//   const totalLine = {
//     name: 'Total',
//     data: totalValues,
//     color: '#343a40',
//     marker: { enabled: false },
//     zIndex: 1,
//   };

//   const shadeData = {
//     name: 'Shaded Area',
//     data: totalValues.map((point, index) => ({
//       x: point[0],
//       low: Math.min(point[1], filteredData[index].Target),
//       high: Math.max(point[1], filteredData[index].Target)
//     })),
//     type: 'arearange',
//     lineWidth: 0,
//     linkedTo: ':previous',
//     color: 'rgba(0, 123, 255, 0.2)',
//     fillOpacity: 0.3,
//     zIndex: 0,
//     marker: {
//       enabled: false
//     }
//   };

//   const handleCurrencyChange = (e) => {
//     const options = e.target.options;
//     const selected = [];
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         selected.push(options[i].value);
//       }
//     }
//     setSelectedCurrencies(selected);
//   };

//   const getData = () => {
//     const compareData = [
//       totalLine,
//       ...data.filter(d => selectedCurrencies.includes(d.name)),
//       {
//         name: 'Target',
//         data: filteredData.map(d => [new Date(d.Date).getTime(), d.Target]),
//         color: '#007bff',
//         marker: { enabled: false },
//         zIndex: 1,
//       },
//     ];
//     return compareWithTarget ? [...compareData, shadeData] : compareData;
//   };

//   const columns = [
//     { name: 'Date', selector: row => row.Date, sortable: true },
//     { name: 'Target', selector: row => row.Target, sortable: true },
//     { name: 'AUD', selector: row => row.AUD, sortable: true },
//     { name: 'EUR', selector: row => row.EUR, sortable: true },
//     { name: 'GBP', selector: row => row.GBP, sortable: true },
//     { name: 'JPY', selector: row => row.JPY, sortable: true },
//     { name: 'USD', selector: row => row.USD, sortable: true },
//     { name: 'Total', selector: row => row.Total, sortable: true },
//   ];

//   const tableData = filteredData.map(d => ({
//     Date: d.Date,
//     Target: d.Target,
//     AUD: d.AUD,
//     EUR: d.EUR,
//     GBP: d.GBP,
//     JPY: d.JPY,
//     USD: d.USD,
//     Total: totalValues[filteredData.indexOf(d)][1]
//   }));

//   const handleTooltipFormatter = function () {
//     const points = this.points;
//     let targetValue = null;
//     let totalValue = null;

//     points.forEach(point => {
//       if (point.series.name === 'Target') {
//         targetValue = point.y;
//       }
//       if (point.series.name === 'Total') {
//         totalValue = point.y;
//       }
//     });

//     if (targetValue !== null && totalValue !== null) {
//       const difference = (totalValue - targetValue).toFixed(2);
//       const totalBreakdown = selectedCurrencies.map(currency => {
//         const point = points.find(p => p.series.name === currency);
//         return `${currency}: ${point.y.toFixed(2)}`;
//       }).join('<br>');

//       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `Difference: ${difference}<br><br>`;
//       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

//       // Update the summary ref instead of state
//       latestSummaryRef.current = summaryHTML;

//       return points.reduce((s, point) => {
//         return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//     }

//     return points.reduce((s, point) => {
//       return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//   };

//   // Update the summary state in a controlled manner
//   useEffect(() => {
//     const updateSummary = () => {
//       if (summary !== latestSummaryRef.current) {
//         setSummary(latestSummaryRef.current);
//       }
//     };

//     const interval = setInterval(updateSummary, 1000);
//     return () => clearInterval(interval);
//   }, [summary]);

//   const options = {
//     chart: {
//       type: 'line',
//       zoomType: 'x',
//       events: {
//         load: function () {
//           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         }
//       }
//     },
//     title: {
//       text: 'Currency Exchange Rates',
//     },
//     xAxis: {
//       type: 'datetime',
//       title: {
//         text: 'Date',
//       },
//       min: startDate.getTime(),
//       max: endDate.getTime(),
//     },
//     yAxis: {
//       title: {
//         text: 'Value',
//       },
//     },
//     tooltip: {
//       shared: true,
//       crosshairs: showSpikeLines,
//       formatter: handleTooltipFormatter,
//     },
//     series: getData(),
//     navigation: {
//       buttonOptions: {
//         enabled: true,
//       },
//     },
//     exporting: {
//       enabled: true,
//     },
//   };

//   useEffect(() => {
//     Highcharts.charts.forEach(chart => {
//       if (chart) {
//         chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         chart.series.forEach(series => {
//           series.setData(getData().find(s => s.name === series.name).data);
//         });
//       }
//     });
//   }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines]);

//   return (
//     <div className="highcharts-container">
//       <div className="side-panel">
//         <div className="side-panel-header">
//           <h2>Dashboard</h2>
//           <img src="/path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
//           <p className="welcome-message">Welcome back, User!</p>
//         </div>
//         <div className="currency-selector">
//           <label>Select Currencies to Include in Total: </label>
//           <select
//             multiple
//             name="selectedCurrencies"
//             onChange={handleCurrencyChange}
//             value={selectedCurrencies}
//             className="currency-dropdown"
//           >
//             <option value="AUD">AUD</option>
//             <option value="EUR">EUR</option>
//             <option value="GBP">GBP</option>
//             <option value="JPY">JPY</option>
//             <option value="USD">USD</option>
//           </select>
//         </div>
//         <div className="date-picker">
//           <label>Select Date Range: </label>
//           <DatePicker
//             selected={startDate}
//             onChange={date => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//             className="date-input"
//           />
//           <DatePicker
//             selected={endDate}
//             onChange={date => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//             className="date-input"
//           />
//         </div>
//         <div className="button-group">
//           <button
//             onClick={() => setShowSpikeLines(!showSpikeLines)}
//             className="toggle-button"
//           >
//             {showSpikeLines ? 'Hide Spike Lines' : 'Show Spike Lines'}
//           </button>
//           <button
//             onClick={() => setCompareWithTarget(!compareWithTarget)}
//             className="toggle-button"
//           >
//             {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
//           </button>
//         </div>
//       </div>
//       <div className="main-panel">
//         <HighchartsReact
//           highcharts={Highcharts}
//           options={options}
//           containerProps={{ className: 'chart-container' }}
//           updateArgs={[true, true, true]}
//         />
//         {compareWithTarget && (
//           <div className="summary-box">
//             <h3>Summary</h3>
//             <div dangerouslySetInnerHTML={{ __html: summary }} />
//           </div>
//         )}
//         <div className="data-table-section">
//           <DataTable
//             title="LCH Notional | Summary Table"
//             columns={columns}
//             data={tableData}
//             pagination
//             highlightOnHover
//             pointerOnHover
//             selectableRows
//             onSelectedRowsChange={({ selectedRows }) => {
//               if (selectedRows.length > 0) {
//                 const start = new Date(selectedRows[0].Date);
//                 const end = new Date(selectedRows[selectedRows.length - 1].Date);
//                 setStartDate(start);
//                 setEndDate(end);
//               }
//             }}
//             customStyles={customTableStyles}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const customTableStyles = {
//   header: {
//     style: {
//       fontSize: '22px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   rows: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//       '&:not(:last-of-type)': {
//         borderBottomStyle: 'solid',
//         borderBottomWidth: '1px',
//         borderBottomColor: '#343a40',
//       },
//     },
//   },
//   headCells: {
//     style: {
//       fontSize: '18px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   cells: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//     },
//   },
// };

// export default HighchartsGraph;

// import React, { useState, useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsAnnotations from 'highcharts/modules/annotations';
// import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// import DataTable from 'react-data-table-component';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { generateContinuousData } from '../Utils/dataGenerator';
// import '../Styles/HighChartsGraph.css'; // Import the CSS file

// HighchartsExporting(Highcharts);
// HighchartsAnnotations(Highcharts);
// HighchartsMore(Highcharts); // Initialize highcharts-more

// const HighchartsGraph = () => {
//   const [showSpikeLines, setShowSpikeLines] = useState(false);
//   const [compareWithTarget, setCompareWithTarget] = useState(false);
//   const [selectedCurrencies, setSelectedCurrencies] = useState(['AUD']);
//   const [summary, setSummary] = useState('');
//   const [startDate, setStartDate] = useState(new Date('2023-01-01'));
//   const [endDate, setEndDate] = useState(new Date('2023-01-30'));

//   const mockData = generateContinuousData('2023-01-01', 30); // 30 days of data

//   const latestSummaryRef = useRef('');

//   const data = [
//     {
//       name: 'Target',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
//       color: '#007bff',
//       marker: { enabled: false },
//       zIndex: 1,
//     },
//     {
//       name: 'AUD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.AUD]),
//       color: '#ff6f61',
//       marker: { enabled: false },
//     },
//     {
//       name: 'EUR',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.EUR]),
//       color: '#28a745',
//       marker: { enabled: false },
//     },
//     {
//       name: 'GBP',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.GBP]),
//       color: '#dc3545',
//       marker: { enabled: false },
//     },
//     {
//       name: 'JPY',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.JPY]),
//       color: '#6f42c1',
//       marker: { enabled: false },
//     },
//     {
//       name: 'USD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.USD]),
//       color: '#ffc107',
//       marker: { enabled: false },
//     }
//   ];

//   const calculateTotal = (filteredData) => {
//     return filteredData.map(d => {
//       return [new Date(d.Date).getTime(), selectedCurrencies.reduce((acc, curr) => acc + d[curr], 0)];
//     });
//   };

//   const getFilteredData = () => {
//     return mockData.filter(d => {
//       const date = new Date(d.Date).getTime();
//       return date >= startDate.getTime() && date <= endDate.getTime();
//     });
//   };

//   const filteredData = getFilteredData();
//   const totalValues = calculateTotal(filteredData);

//   const totalLine = {
//     name: 'Total',
//     data: totalValues,
//     color: '#343a40',
//     marker: { enabled: false },
//     zIndex: 1,
//   };

//   const shadeData = {
//     name: 'Shaded Area',
//     data: totalValues.map((point, index) => ({
//       x: point[0],
//       low: Math.min(point[1], filteredData[index].Target),
//       high: Math.max(point[1], filteredData[index].Target)
//     })),
//     type: 'arearange',
//     lineWidth: 0,
//     linkedTo: ':previous',
//     color: 'rgba(0, 123, 255, 0.2)',
//     fillOpacity: 0.3,
//     zIndex: 0,
//     marker: {
//       enabled: false
//     }
//   };

//   const handleCurrencyChange = (e) => {
//     const options = e.target.options;
//     const selected = [];
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         selected.push(options[i].value);
//       }
//     }
//     setSelectedCurrencies(selected);
//   };

//   const getData = () => {
//     const compareData = [
//       totalLine,
//       ...data.filter(d => selectedCurrencies.includes(d.name)),
//       {
//         name: 'Target',
//         data: filteredData.map(d => [new Date(d.Date).getTime(), d.Target]),
//         color: '#007bff',
//         marker: { enabled: false },
//         zIndex: 1,
//       },
//     ];
//     return compareWithTarget ? [...compareData, shadeData] : compareData;
//   };

//   const columns = [
//     { name: 'Date', selector: row => row.Date, sortable: true },
//     { name: 'Target', selector: row => row.Target, sortable: true },
//     { name: 'AUD', selector: row => row.AUD, sortable: true },
//     { name: 'EUR', selector: row => row.EUR, sortable: true },
//     { name: 'GBP', selector: row => row.GBP, sortable: true },
//     { name: 'JPY', selector: row => row.JPY, sortable: true },
//     { name: 'USD', selector: row => row.USD, sortable: true },
//     { name: 'Total', selector: row => row.Total, sortable: true },
//   ];

//   const tableData = filteredData.map(d => ({
//     Date: d.Date,
//     Target: d.Target,
//     AUD: d.AUD,
//     EUR: d.EUR,
//     GBP: d.GBP,
//     JPY: d.JPY,
//     USD: d.USD,
//     Total: totalValues[filteredData.indexOf(d)][1]
//   }));

//   const handleTooltipFormatter = function () {
//     const points = this.points;
//     let targetValue = null;
//     let totalValue = null;

//     points.forEach(point => {
//       if (point.series.name === 'Target') {
//         targetValue = point.y;
//       }
//       if (point.series.name === 'Total') {
//         totalValue = point.y;
//       }
//     });

//     if (targetValue !== null && totalValue !== null) {
//       const difference = (totalValue - targetValue).toFixed(2);
//       const totalBreakdown = selectedCurrencies.map(currency => {
//         const point = points.find(p => p.series.name === currency);
//         return `${currency}: ${point.y.toFixed(2)}`;
//       }).join('<br>');

//       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `Difference: ${difference}<br><br>`;
//       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

//       // Update the summary ref instead of state
//       latestSummaryRef.current = summaryHTML;

//       return points.reduce((s, point) => {
//         return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//     }

//     return points.reduce((s, point) => {
//       return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//   };

//   // Update the summary state in a controlled manner
//   useEffect(() => {
//     const updateSummary = () => {
//       if (summary !== latestSummaryRef.current) {
//         setSummary(latestSummaryRef.current);
//       }
//     };

//     const interval = setInterval(updateSummary, 1000);
//     return () => clearInterval(interval);
//   }, [summary]);

//   const options = {
//     chart: {
//       type: 'line',
//       zoomType: 'x',
//       events: {
//         load: function () {
//           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         }
//       }
//     },
//     title: {
//       text: 'Currency Exchange Rates',
//     },
//     xAxis: {
//       type: 'datetime',
//       title: {
//         text: 'Date',
//       },
//       min: startDate.getTime(),
//       max: endDate.getTime(),
//     },
//     yAxis: {
//       title: {
//         text: 'Value',
//       },
//     },
//     tooltip: {
//       shared: true,
//       crosshairs: showSpikeLines,
//       formatter: handleTooltipFormatter,
//     },
//     series: getData(),
//     navigation: {
//       buttonOptions: {
//         enabled: true,
//       },
//     },
//     exporting: {
//       enabled: true,
//     },
//   };

//   useEffect(() => {
//     Highcharts.charts.forEach(chart => {
//       if (chart) {
//         chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         chart.series.forEach(series => {
//           series.setData(getData().find(s => s.name === series.name).data);
//         });
//       }
//     });
//   }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines]);

//   return (
//     <div className="highcharts-container">
//       <div className="side-panel">
//         <div className="side-panel-header">
//           <h2>Dashboard</h2>
//           <img src="/path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
//           <p className="welcome-message">Welcome back, User!</p>
//         </div>
//         <div className="currency-selector">
//           <label>Select Currencies to Include in Total: </label>
//           <select
//             multiple
//             name="selectedCurrencies"
//             onChange={handleCurrencyChange}
//             value={selectedCurrencies}
//             className="currency-dropdown"
//           >
//             <option value="AUD">AUD</option>
//             <option value="EUR">EUR</option>
//             <option value="GBP">GBP</option>
//             <option value="JPY">JPY</option>
//             <option value="USD">USD</option>
//           </select>
//         </div>
//         <div className="date-picker">
//           <label>Select Date Range: </label>
//           <DatePicker
//             selected={startDate}
//             onChange={date => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//             className="date-input"
//           />
//           <DatePicker
//             selected={endDate}
//             onChange={date => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//             className="date-input"
//           />
//         </div>
//       </div>
//       <div className="main-panel">
//         <HighchartsReact
//           highcharts={Highcharts}
//           options={options}
//           containerProps={{ className: 'chart-container' }}
//           updateArgs={[true, true, true]}
//         />
//         <div className="chart-controls">
//           <button
//             onClick={() => setShowSpikeLines(!showSpikeLines)}
//             className="toggle-button"
//           >
//             {showSpikeLines ? 'Hide Spike Lines' : 'Show Spike Lines'}
//           </button>
//           <button
//             onClick={() => setCompareWithTarget(!compareWithTarget)}
//             className="toggle-button"
//           >
//             {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
//           </button>
//         </div>
//         {compareWithTarget && (
//           <div className="summary-box">
//             <h3>Summary</h3>
//             <div dangerouslySetInnerHTML={{ __html: summary }} />
//           </div>
//         )}
//         <div className="data-table-section">
//           <DataTable
//             title="LCH Notional | Summary Table"
//             columns={columns}
//             data={tableData}
//             pagination
//             highlightOnHover
//             pointerOnHover
//             selectableRows
//             onSelectedRowsChange={({ selectedRows }) => {
//               if (selectedRows.length > 0) {
//                 const start = new Date(selectedRows[0].Date);
//                 const end = new Date(selectedRows[selectedRows.length - 1].Date);
//                 setStartDate(start);
//                 setEndDate(end);
//               }
//             }}
//             customStyles={customTableStyles}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const customTableStyles = {
//   header: {
//     style: {
//       fontSize: '22px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   rows: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//       '&:not(:last-of-type)': {
//         borderBottomStyle: 'solid',
//         borderBottomWidth: '1px',
//         borderBottomColor: '#343a40',
//       },
//     },
//   },
//   headCells: {
//     style: {
//       fontSize: '18px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   cells: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//     },
//   },
// };

// export default HighchartsGraph;

// import React, { useState, useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsAnnotations from 'highcharts/modules/annotations';
// import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// import DataTable from 'react-data-table-component';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { generateContinuousData } from '../Utils/dataGenerator';
// import '../Styles/HighChartsGraph.css'; // Import the CSS file

// HighchartsExporting(Highcharts);
// HighchartsAnnotations(Highcharts);
// HighchartsMore(Highcharts); // Initialize highcharts-more

// const HighchartsGraph = () => {
//   const [showSpikeLines, setShowSpikeLines] = useState(false);
//   const [compareWithTarget, setCompareWithTarget] = useState(false);
//   const [selectedCurrencies, setSelectedCurrencies] = useState(['AUD']);
//   const [summary, setSummary] = useState('');
//   const [startDate, setStartDate] = useState(new Date('2023-01-01'));
//   const [endDate, setEndDate] = useState(new Date('2023-01-30'));

//   const mockData = generateContinuousData('2023-01-01', 30); // 30 days of data

//   const latestSummaryRef = useRef('');

//   const data = [
//     {
//       name: 'Target',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
//       color: '#007bff',
//       marker: { enabled: false },
//       zIndex: 1,
//     },
//     {
//       name: 'AUD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.AUD]),
//       color: '#ff6f61',
//       marker: { enabled: false },
//     },
//     {
//       name: 'EUR',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.EUR]),
//       color: '#28a745',
//       marker: { enabled: false },
//     },
//     {
//       name: 'GBP',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.GBP]),
//       color: '#dc3545',
//       marker: { enabled: false },
//     },
//     {
//       name: 'JPY',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.JPY]),
//       color: '#6f42c1',
//       marker: { enabled: false },
//     },
//     {
//       name: 'USD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.USD]),
//       color: '#ffc107',
//       marker: { enabled: false },
//     }
//   ];

//   const calculateTotal = (filteredData) => {
//     return filteredData.map(d => {
//       return [new Date(d.Date).getTime(), selectedCurrencies.reduce((acc, curr) => acc + d[curr], 0)];
//     });
//   };

//   const getFilteredData = () => {
//     return mockData.filter(d => {
//       const date = new Date(d.Date).getTime();
//       return date >= startDate.getTime() && date <= endDate.getTime();
//     });
//   };

//   const filteredData = getFilteredData();
//   const totalValues = calculateTotal(filteredData);

//   const totalLine = {
//     name: 'Total',
//     data: totalValues,
//     color: '#343a40',
//     marker: { enabled: false },
//     zIndex: 1,
//   };

//   const shadeData = {
//     name: 'Shaded Area',
//     data: totalValues.map((point, index) => ({
//       x: point[0],
//       low: Math.min(point[1], filteredData[index].Target),
//       high: Math.max(point[1], filteredData[index].Target)
//     })),
//     type: 'arearange',
//     lineWidth: 0,
//     linkedTo: ':previous',
//     color: 'rgba(0, 123, 255, 0.2)',
//     fillOpacity: 0.3,
//     zIndex: 0,
//     marker: {
//       enabled: false
//     }
//   };

//   const handleCurrencyChange = (e) => {
//     const options = e.target.options;
//     const selected = [];
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         selected.push(options[i].value);
//       }
//     }
//     setSelectedCurrencies(selected);
//   };

//   const getData = () => {
//     const compareData = [
//       totalLine,
//       ...data.filter(d => selectedCurrencies.includes(d.name)),
//       {
//         name: 'Target',
//         data: filteredData.map(d => [new Date(d.Date).getTime(), d.Target]),
//         color: '#007bff',
//         marker: { enabled: false },
//         zIndex: 1,
//       },
//     ];
//     return compareWithTarget ? [...compareData, shadeData] : compareData;
//   };

//   const columns = [
//     { name: 'Date', selector: row => row.Date, sortable: true },
//     { name: 'Target', selector: row => row.Target, sortable: true },
//     { name: 'AUD', selector: row => row.AUD, sortable: true },
//     { name: 'EUR', selector: row => row.EUR, sortable: true },
//     { name: 'GBP', selector: row => row.GBP, sortable: true },
//     { name: 'JPY', selector: row => row.JPY, sortable: true },
//     { name: 'USD', selector: row => row.USD, sortable: true },
//     { name: 'Total', selector: row => row.Total, sortable: true },
//   ];

//   const tableData = filteredData.map(d => ({
//     Date: d.Date,
//     Target: d.Target,
//     AUD: d.AUD,
//     EUR: d.EUR,
//     GBP: d.GBP,
//     JPY: d.JPY,
//     USD: d.USD,
//     Total: totalValues[filteredData.indexOf(d)][1]
//   }));

//   const handleTooltipFormatter = function () {
//     const points = this.points;
//     let targetValue = null;
//     let totalValue = null;

//     points.forEach(point => {
//       if (point.series.name === 'Target') {
//         targetValue = point.y;
//       }
//       if (point.series.name === 'Total') {
//         totalValue = point.y;
//       }
//     });

//     if (targetValue !== null && totalValue !== null) {
//       const difference = (totalValue - targetValue).toFixed(2);
//       const totalBreakdown = selectedCurrencies.map(currency => {
//         const point = points.find(p => p.series.name === currency);
//         return `${currency}: ${point.y.toFixed(2)}`;
//       }).join('<br>');

//       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `Difference: ${difference}<br><br>`;
//       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

//       // Update the summary ref instead of state
//       latestSummaryRef.current = summaryHTML;

//       return points.reduce((s, point) => {
//         return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//     }

//     return points.reduce((s, point) => {
//       return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//   };

//   // Update the summary state in a controlled manner
//   useEffect(() => {
//     const updateSummary = () => {
//       if (summary !== latestSummaryRef.current) {
//         setSummary(latestSummaryRef.current);
//       }
//     };

//     const interval = setInterval(updateSummary, 1000);
//     return () => clearInterval(interval);
//   }, [summary]);

//   const options = {
//     chart: {
//       type: 'line',
//       zoomType: 'x',
//       backgroundColor: '#d3d3d3', // Light gray background for the chart
//       events: {
//         load: function () {
//           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         }
//       }
//     },
//     title: {
//       text: 'Currency Exchange Rates',
//     },
//     xAxis: {
//       type: 'datetime',
//       title: {
//         text: 'Date',
//       },
//       min: startDate.getTime(),
//       max: endDate.getTime(),
//     },
//     yAxis: {
//       title: {
//         text: 'Value',
//       },
//     },
//     tooltip: {
//       shared: true,
//       crosshairs: showSpikeLines,
//       formatter: handleTooltipFormatter,
//     },
//     series: getData(),
//     navigation: {
//       buttonOptions: {
//         enabled: true,
//       },
//     },
//     exporting: {
//       enabled: true,
//     },
//   };

//   useEffect(() => {
//     Highcharts.charts.forEach(chart => {
//       if (chart) {
//         chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         chart.series.forEach(series => {
//           series.setData(getData().find(s => s.name === series.name).data);
//         });
//       }
//     });
//   }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines]);

//   return (
//     <div className="highcharts-container">
//       <div className="side-panel">
//         <div className="side-panel-header">
//           <h2>Dashboard</h2>
//           <img src="/path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
//           <p className="welcome-message">Welcome back, User!</p>
//         </div>
//         <div className="currency-selector">
//           <label>Select Currencies to Include in Total: </label>
//           <select
//             multiple
//             name="selectedCurrencies"
//             onChange={handleCurrencyChange}
//             value={selectedCurrencies}
//             className="currency-dropdown"
//           >
//             <option value="AUD">AUD</option>
//             <option value="EUR">EUR</option>
//             <option value="GBP">GBP</option>
//             <option value="JPY">JPY</option>
//             <option value="USD">USD</option>
//           </select>
//         </div>
//         <div className="date-picker">
//           <label>Select Date Range: </label>
//           <DatePicker
//             selected={startDate}
//             onChange={date => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//             className="date-input"
//           />
//           <DatePicker
//             selected={endDate}
//             onChange={date => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//             className="date-input"
//           />
//         </div>
//       </div>
//       <div className="main-panel">
//         <HighchartsReact
//           highcharts={Highcharts}
//           options={options}
//           containerProps={{ className: 'chart-container' }}
//           updateArgs={[true, true, true]}
//         />
//         <div className="chart-controls">
//           <button
//             onClick={() => setShowSpikeLines(!showSpikeLines)}
//             className="toggle-button"
//           >
//             {showSpikeLines ? 'Hide Spike Lines' : 'Show Spike Lines'}
//           </button>
//           <button
//             onClick={() => setCompareWithTarget(!compareWithTarget)}
//             className="toggle-button"
//           >
//             {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
//           </button>
//         </div>
//         {compareWithTarget && (
//           <div className="summary-box">
//             <h3>Summary</h3>
//             <div dangerouslySetInnerHTML={{ __html: summary }} />
//           </div>
//         )}
//         <div className="data-table-section">
//           <DataTable
//             title="LCH Notional | Summary Table"
//             columns={columns}
//             data={tableData}
//             pagination
//             highlightOnHover
//             pointerOnHover
//             selectableRows
//             onSelectedRowsChange={({ selectedRows }) => {
//               if (selectedRows.length > 0) {
//                 const start = new Date(selectedRows[0].Date);
//                 const end = new Date(selectedRows[selectedRows.length - 1].Date);
//                 setStartDate(start);
//                 setEndDate(end);
//               }
//             }}
//             customStyles={customTableStyles}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const customTableStyles = {
//   header: {
//     style: {
//       fontSize: '22px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   rows: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//       '&:not(:last-of-type)': {
//         borderBottomStyle: 'solid',
//         borderBottomWidth: '1px',
//         borderBottomColor: '#343a40',
//       },
//     },
//   },
//   headCells: {
//     style: {
//       fontSize: '18px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   cells: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//     },
//   },
// };

// export default HighchartsGraph;


// import React, { useState, useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsAnnotations from 'highcharts/modules/annotations';
// import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// import DataTable from 'react-data-table-component';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import Select from 'react-select'; // Import react-select
// import { generateContinuousData } from '../Utils/dataGenerator';
// import '../Styles/HighChartsGraph.css'; // Import the CSS file
// import Topbar from './Topbar';

// HighchartsExporting(Highcharts);
// HighchartsAnnotations(Highcharts);
// HighchartsMore(Highcharts); // Initialize highcharts-more

// const HighchartsGraph = () => {
//   const [showSpikeLines, setShowSpikeLines] = useState(false);
//   const [compareWithTarget, setCompareWithTarget] = useState(false);
//   const [selectedCurrencies, setSelectedCurrencies] = useState([{ value: 'AUD', label: 'AUD' }]);
//   const [summary, setSummary] = useState('');
//   const [startDate, setStartDate] = useState(new Date('2023-01-01'));
//   const [endDate, setEndDate] = useState(new Date('2023-01-30'));

//   const mockData = generateContinuousData('2023-01-01', 30); // 30 days of data

//   const latestSummaryRef = useRef('');

//   const data = [
//     {
//       name: 'Target',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
//       color: '#007bff',
//       marker: { enabled: false },
//       zIndex: 1,
//     },
//     {
//       name: 'AUD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.AUD]),
//       color: '#ff6f61',
//       marker: { enabled: false },
//     },
//     {
//       name: 'EUR',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.EUR]),
//       color: '#28a745',
//       marker: { enabled: false },
//     },
//     {
//       name: 'GBP',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.GBP]),
//       color: '#dc3545',
//       marker: { enabled: false },
//     },
//     {
//       name: 'JPY',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.JPY]),
//       color: '#6f42c1',
//       marker: { enabled: false },
//     },
//     {
//       name: 'USD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.USD]),
//       color: '#ffc107',
//       marker: { enabled: false },
//     }
//   ];

//   const calculateTotal = (filteredData) => {
//     return filteredData.map(d => {
//       return [new Date(d.Date).getTime(), selectedCurrencies.reduce((acc, curr) => acc + d[curr.value], 0)];
//     });
//   };

//   const getFilteredData = () => {
//     return mockData.filter(d => {
//       const date = new Date(d.Date).getTime();
//       return date >= startDate.getTime() && date <= endDate.getTime();
//     });
//   };

//   const filteredData = getFilteredData();
//   const totalValues = calculateTotal(filteredData);

//   const totalLine = {
//     name: 'Total',
//     data: totalValues,
//     color: '#343a40',
//     marker: { enabled: false },
//     zIndex: 1,
//   };

//   const shadeData = {
//     name: 'Shaded Area',
//     data: totalValues.map((point, index) => ({
//       x: point[0],
//       low: Math.min(point[1], filteredData[index].Target),
//       high: Math.max(point[1], filteredData[index].Target)
//     })),
//     type: 'arearange',
//     lineWidth: 0,
//     linkedTo: ':previous',
//     color: 'rgba(0, 123, 255, 0.2)',
//     fillOpacity: 0.3,
//     zIndex: 0,
//     marker: {
//       enabled: false
//     }
//   };

//   const handleCurrencyChange = (selectedOptions) => {
//     setSelectedCurrencies(selectedOptions);
//   };

//   const getData = () => {
//     const compareData = [
//       totalLine,
//       ...data.filter(d => selectedCurrencies.some(currency => currency.value === d.name)),
//       {
//         name: 'Target',
//         data: filteredData.map(d => [new Date(d.Date).getTime(), d.Target]),
//         color: '#007bff',
//         marker: { enabled: false },
//         zIndex: 1,
//       },
//     ];
//     return compareWithTarget ? [...compareData, shadeData] : compareData;
//   };

//   const columns = [
//     { name: 'Date', selector: row => row.Date, sortable: true },
//     { name: 'Target', selector: row => row.Target, sortable: true },
//     { name: 'AUD', selector: row => row.AUD, sortable: true },
//     { name: 'EUR', selector: row => row.EUR, sortable: true },
//     { name: 'GBP', selector: row => row.GBP, sortable: true },
//     { name: 'JPY', selector: row => row.JPY, sortable: true },
//     { name: 'USD', selector: row => row.USD, sortable: true },
//     { name: 'Total', selector: row => row.Total, sortable: true },
//   ];

//   const tableData = filteredData.map(d => ({
//     Date: d.Date,
//     Target: d.Target,
//     AUD: d.AUD,
//     EUR: d.EUR,
//     GBP: d.GBP,
//     JPY: d.JPY,
//     USD: d.USD,
//     Total: totalValues[filteredData.indexOf(d)][1]
//   }));

//   const handleTooltipFormatter = function () {
//     const points = this.points;
//     let targetValue = null;
//     let totalValue = null;

//     points.forEach(point => {
//       if (point.series.name === 'Target') {
//         targetValue = point.y;
//       }
//       if (point.series.name === 'Total') {
//         totalValue = point.y;
//       }
//     });

//     if (targetValue !== null && totalValue !== null) {
//       const difference = (totalValue - targetValue).toFixed(2);
//       const totalBreakdown = selectedCurrencies.map(currency => {
//         const point = points.find(p => p.series.name === currency.value);
//         return `${currency.value}: ${point.y.toFixed(2)}`;
//       }).join('<br>');

//       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `Difference: ${difference}<br><br>`;
//       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

//       // Update the summary ref instead of state
//       latestSummaryRef.current = summaryHTML;

//       return points.reduce((s, point) => {
//         return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//     }

//     return points.reduce((s, point) => {
//       return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//   };

//   // Update the summary state in a controlled manner
//   useEffect(() => {
//     const updateSummary = () => {
//       if (summary !== latestSummaryRef.current) {
//         setSummary(latestSummaryRef.current);
//       }
//     };

//     const interval = setInterval(updateSummary, 1000);
//     return () => clearInterval(interval);
//   }, [summary]);

//   const options = {
//     chart: {
//       type: 'line',
//       zoomType: 'x',
//       backgroundColor: '#d3d3d3', // Light gray background for the chart
//       events: {
//         load: function () {
//           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         }
//       }
//     },
//     title: {
//       text: 'Currency Exchange Rates',
//     },
//     xAxis: {
//       type: 'datetime',
//       title: {
//         text: 'Date',
//       },
//       min: startDate.getTime(),
//       max: endDate.getTime(),
//     },
//     yAxis: {
//       title: {
//         text: 'Value',
//       },
//     },
//     tooltip: {
//       shared: true,
//       crosshairs: showSpikeLines,
//       formatter: handleTooltipFormatter,
//     },
//     series: getData(),
//     navigation: {
//       buttonOptions: {
//         enabled: true,
//       },
//     },
//     exporting: {
//       enabled: true,
//     },
//   };

//   useEffect(() => {
//     Highcharts.charts.forEach(chart => {
//       if (chart) {
//         chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         chart.series.forEach(series => {
//           series.setData(getData().find(s => s.name === series.name).data);
//         });
//       }
//     });
//   }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines]);

//   return (
//     <div className="app-container">
//       <Topbar />
//     <div className="highcharts-container">
//       <div className="side-panel">
//         <div className="side-panel-header">
//           <h2>Dashboard</h2>
//           <img src="/path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
//           <p className="welcome-message">Welcome back, User!</p>
//         </div>
//         <div className="currency-selector">
//           <label>Select Currencies to Include in Total: </label>
//           <Select
//             isMulti
//             name="currencies"
//             options={[
//               { value: 'AUD', label: 'AUD' },
//               { value: 'EUR', label: 'EUR' },
//               { value: 'GBP', label: 'GBP' },
//               { value: 'JPY', label: 'JPY' },
//               { value: 'USD', label: 'USD' },
//             ]}
//             className="currency-dropdown"
//             classNamePrefix="select"
//             value={selectedCurrencies}
//             onChange={handleCurrencyChange}
//           />
//         </div>
//         <div className="date-picker">
//           <label>Select Date Range: </label>
//           <DatePicker
//             selected={startDate}
//             onChange={date => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//             className="date-input"
//           />
//           <DatePicker
//             selected={endDate}
//             onChange={date => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//             className="date-input"
//           />
//         </div>
//       </div>
//       <div className="main-panel">
//         <HighchartsReact
//           highcharts={Highcharts}
//           options={options}
//           containerProps={{ className: 'chart-container' }}
//           updateArgs={[true, true, true]}
//         />
//         <div className="chart-controls">
//           <button
//             onClick={() => setShowSpikeLines(!showSpikeLines)}
//             className="toggle-button"
//           >
//             {showSpikeLines ? 'Hide Spike Lines' : 'Show Spike Lines'}
//           </button>
//           <button
//             onClick={() => setCompareWithTarget(!compareWithTarget)}
//             className="toggle-button"
//           >
//             {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
//           </button>
//         </div>
//         {compareWithTarget && (
//           <div className="summary-box">
//             <h3>Summary</h3>
//             <div dangerouslySetInnerHTML={{ __html: summary }} />
//           </div>
//         )}
//         <div className="data-table-section">
//           <DataTable
//             title="LCH Notional | Summary Table"
//             columns={columns}
//             data={tableData}
//             pagination
//             highlightOnHover
//             pointerOnHover
//             selectableRows
//             onSelectedRowsChange={({ selectedRows }) => {
//               if (selectedRows.length > 0) {
//                 const start = new Date(selectedRows[0].Date);
//                 const end = new Date(selectedRows[selectedRows.length - 1].Date);
//                 setStartDate(start);
//                 setEndDate(end);
//               }
//             }}
//             customStyles={customTableStyles}
//           />
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// const customTableStyles = {
//   header: {
//     style: {
//       fontSize: '22px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   rows: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//       '&:not(:last-of-type)': {
//         borderBottomStyle: 'solid',
//         borderBottomWidth: '1px',
//         borderBottomColor: '#343a40',
//       },
//     },
//   },
//   headCells: {
//     style: {
//       fontSize: '18px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   cells: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//     },
//   },
// };

// export default HighchartsGraph;






// src/components/HighchartsGraph.js

// import React, { useState, useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsAnnotations from 'highcharts/modules/annotations';
// import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// import DataTable from 'react-data-table-component';
// import DatePicker from 'react-datepicker';
// import Select from 'react-select';
// import 'react-datepicker/dist/react-datepicker.css';
// import { generateContinuousData } from '../Utils/dataGenerator';
// import Topbar from './Topbar'; // Import Topbar component
// import '../Styles/HighChartsGraph.css'; // Import the CSS file

// HighchartsExporting(Highcharts);
// HighchartsAnnotations(Highcharts);
// HighchartsMore(Highcharts); // Initialize highcharts-more

// const HighchartsGraph = () => {
//   const [showSpikeLines, setShowSpikeLines] = useState(false);
//   const [compareWithTarget, setCompareWithTarget] = useState(false);
//   const [selectedCurrencies, setSelectedCurrencies] = useState([{ value: 'AUD', label: 'AUD' }]);
//   const [summary, setSummary] = useState('');
//   const [startDate, setStartDate] = useState(new Date('2023-01-01'));
//   const [endDate, setEndDate] = useState(new Date('2023-01-30'));

//   const mockData = generateContinuousData('2023-01-01', 30); // 30 days of data

//   const latestSummaryRef = useRef('');

//   const data = [
//     {
//       name: 'Target',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
//       color: '#007bff',
//       marker: { enabled: false },
//       zIndex: 1,
//     },
//     {
//       name: 'AUD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.AUD]),
//       color: '#ff6f61',
//       marker: { enabled: false },
//     },
//     {
//       name: 'EUR',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.EUR]),
//       color: '#28a745',
//       marker: { enabled: false },
//     },
//     {
//       name: 'GBP',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.GBP]),
//       color: '#dc3545',
//       marker: { enabled: false },
//     },
//     {
//       name: 'JPY',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.JPY]),
//       color: '#6f42c1',
//       marker: { enabled: false },
//     },
//     {
//       name: 'USD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.USD]),
//       color: '#ffc107',
//       marker: { enabled: false },
//     }
//   ];

//   const calculateTotal = (filteredData) => {
//     return filteredData.map(d => {
//       return [new Date(d.Date).getTime(), selectedCurrencies.reduce((acc, curr) => acc + d[curr.value], 0)];
//     });
//   };

//   const getFilteredData = () => {
//     return mockData.filter(d => {
//       const date = new Date(d.Date).getTime();
//       return date >= startDate.getTime() && date <= endDate.getTime();
//     });
//   };

//   const filteredData = getFilteredData();
//   const totalValues = calculateTotal(filteredData);

//   const totalLine = {
//     name: 'Total',
//     data: totalValues,
//     color: '#343a40',
//     marker: { enabled: false },
//     zIndex: 1,
//   };

//   const shadeData = {
//     name: 'Shaded Area',
//     data: totalValues.map((point, index) => ({
//       x: point[0],
//       low: Math.min(point[1], filteredData[index].Target),
//       high: Math.max(point[1], filteredData[index].Target)
//     })),
//     type: 'arearange',
//     lineWidth: 0,
//     linkedTo: ':previous',
//     color: 'rgba(0, 123, 255, 0.2)',
//     fillOpacity: 0.3,
//     zIndex: 0,
//     marker: {
//       enabled: false
//     }
//   };

//   const handleCurrencyChange = (selectedOptions) => {
//     setSelectedCurrencies(selectedOptions);
//   };

//   const getData = () => {
//     const compareData = [
//       totalLine,
//       ...data.filter(d => selectedCurrencies.some(currency => currency.value === d.name)),
//       {
//         name: 'Target',
//         data: filteredData.map(d => [new Date(d.Date).getTime(), d.Target]),
//         color: '#007bff',
//         marker: { enabled: false },
//         zIndex: 1,
//       },
//     ];
//     return compareWithTarget ? [...compareData, shadeData] : compareData;
//   };

//   const columns = [
//     { name: 'Date', selector: row => row.Date, sortable: true },
//     { name: 'Target', selector: row => row.Target, sortable: true },
//     { name: 'AUD', selector: row => row.AUD, sortable: true },
//     { name: 'EUR', selector: row => row.EUR, sortable: true },
//     { name: 'GBP', selector: row => row.GBP, sortable: true },
//     { name: 'JPY', selector: row => row.JPY, sortable: true },
//     { name: 'USD', selector: row => row.USD, sortable: true },
//     { name: 'Total', selector: row => row.Total, sortable: true },
//   ];

//   const tableData = filteredData.map(d => ({
//     Date: d.Date,
//     Target: d.Target,
//     AUD: d.AUD,
//     EUR: d.EUR,
//     GBP: d.GBP,
//     JPY: d.JPY,
//     USD: d.USD,
//     Total: totalValues[filteredData.indexOf(d)][1]
//   }));

//   const handleTooltipFormatter = function () {
//     const points = this.points;
//     let targetValue = null;
//     let totalValue = null;

//     points.forEach(point => {
//       if (point.series.name === 'Target') {
//         targetValue = point.y;
//       }
//       if (point.series.name === 'Total') {
//         totalValue = point.y;
//       }
//     });

//     if (targetValue !== null && totalValue !== null) {
//       const difference = (totalValue - targetValue).toFixed(2);
//       const totalBreakdown = selectedCurrencies.map(currency => {
//         const point = points.find(p => p.series.name === currency.value);
//         return `${currency.value}: ${point.y.toFixed(2)}`;
//       }).join('<br>');

//       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `Difference: ${difference}<br><br>`;
//       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

//       // Update the summary ref instead of state
//       latestSummaryRef.current = summaryHTML;

//       return points.reduce((s, point) => {
//         return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//     }

//     return points.reduce((s, point) => {
//       return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//   };

//   // Update the summary state in a controlled manner
//   useEffect(() => {
//     const updateSummary = () => {
//       if (summary !== latestSummaryRef.current) {
//         setSummary(latestSummaryRef.current);
//       }
//     };

//     const interval = setInterval(updateSummary, 1000);
//     return () => clearInterval(interval);
//   }, [summary]);

//   const options = {
//     chart: {
//       type: 'line',
//       zoomType: 'x',
//       backgroundColor: '#d3d3d3', // Light gray background for the chart
//       spacingBottom: 80, // Add extra space below the X-axis
//       events: {
//         load: function () {
//           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         }
//       }
//     },
//     title: {
//       text: 'Currency Exchange Rates',
//     },
//     xAxis: {
//       type: 'datetime',
//       title: {
//         text: 'Date',
//       },
//       min: startDate.getTime(),
//       max: endDate.getTime(),
//     },
//     yAxis: {
//       title: {
//         text: 'Value',
//       },
//     },
//     tooltip: {
//       shared: true,
//       crosshairs: showSpikeLines,
//       formatter: handleTooltipFormatter,
//     },
//     series: getData(),
//     navigation: {
//       buttonOptions: {
//         enabled: true,
//       },
//     },
//     exporting: {
//       enabled: true,
//     },
//   };

//   useEffect(() => {
//     Highcharts.charts.forEach(chart => {
//       if (chart) {
//         chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         chart.series.forEach(series => {
//           series.setData(getData().find(s => s.name === series.name).data);
//         });
//       }
//     });
//   }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines]);

//   return (
//     <div className="app-container">
//       <Topbar /> {/* Include Topbar component */}
//       <div className="highcharts-container">
//         <div className="side-panel">
//           <div className="side-panel-header">
//             <h2>Dashboard</h2>
//             <img src="/path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
//             <p className="welcome-message">Welcome back, User!</p>
//           </div>
//           <div className="currency-selector">
//             <label>Select Currencies to Include in Total: </label>
//             <Select
//               isMulti
//               name="currencies"
//               options={[
//                 { value: 'AUD', label: 'AUD' },
//                 { value: 'EUR', label: 'EUR' },
//                 { value: 'GBP', label: 'GBP' },
//                 { value: 'JPY', label: 'JPY' },
//                 { value: 'USD', label: 'USD' },
//               ]}
//               className="currency-dropdown"
//               classNamePrefix="select"
//               value={selectedCurrencies}
//               onChange={handleCurrencyChange}
//             />
//           </div>
//           <div className="date-picker">
//             <label>Select Date Range: </label>
//             <DatePicker
//               selected={startDate}
//               onChange={date => setStartDate(date)}
//               selectsStart
//               startDate={startDate}
//               endDate={endDate}
//               className="date-input"
//             />
//             <DatePicker
//               selected={endDate}
//               onChange={date => setEndDate(date)}
//               selectsEnd
//               startDate={startDate}
//               endDate={endDate}
//               minDate={startDate}
//               className="date-input"
//             />
//           </div>
//         </div>
//         <div className="main-panel">
//           <HighchartsReact
//             highcharts={Highcharts}
//             options={options}
//             containerProps={{ className: 'chart-container' }}
//             updateArgs={[true, true, true]}
//           />
//           <div className="chart-controls">
//             <button
//               onClick={() => setShowSpikeLines(!showSpikeLines)}
//               className="toggle-button"
//             >
//               {showSpikeLines ? 'Hide Spike Lines' : 'Show Spike Lines'}
//             </button>
//             <button
//               onClick={() => setCompareWithTarget(!compareWithTarget)}
//               className="toggle-button"
//             >
//               {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
//             </button>
//           </div>
//           {compareWithTarget && (
//             <div className="summary-box">
//               <h3>Summary</h3>
//               <div dangerouslySetInnerHTML={{ __html: summary }} />
//             </div>
//           )}
//           <div className="data-table-section">
//             <DataTable
//               title="LCH Notional | Summary Table"
//               columns={columns}
//               data={tableData}
//               pagination
//               highlightOnHover
//               pointerOnHover
//               selectableRows
//               onSelectedRowsChange={({ selectedRows }) => {
//                 if (selectedRows.length > 0) {
//                   const start = new Date(selectedRows[0].Date);
//                   const end = new Date(selectedRows[selectedRows.length - 1].Date);
//                   setStartDate(start);
//                   setEndDate(end);
//                 }
//               }}
//               customStyles={customTableStyles}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const customTableStyles = {
//   header: {
//     style: {
//       fontSize: '22px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   rows: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//       '&:not(:last-of-type)': {
//         borderBottomStyle: 'solid',
//         borderBottomWidth: '1px',
//         borderBottomColor: '#343a40',
//       },
//     },
//   },
//   headCells: {
//     style: {
//       fontSize: '18px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   cells: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//     },
//   },
// };

// export default HighchartsGraph;

// src/components/HighchartsGraph.js

// import React, { useState, useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsAnnotations from 'highcharts/modules/annotations';
// import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// import DataTable from 'react-data-table-component';
// import DatePicker from 'react-datepicker';
// import Select from 'react-select';
// import 'react-datepicker/dist/react-datepicker.css';
// import { generateContinuousData } from '../Utils/dataGenerator';
// import Topbar from './Topbar'; // Import Topbar component
// import '../Styles/HighChartsGraph.css'; // Import the CSS file

// HighchartsExporting(Highcharts);
// HighchartsAnnotations(Highcharts);
// HighchartsMore(Highcharts); // Initialize highcharts-more

// const HighchartsGraph = () => {
//   const [showSpikeLines, setShowSpikeLines] = useState(false);
//   const [compareWithTarget, setCompareWithTarget] = useState(false);
//   const [selectedCurrencies, setSelectedCurrencies] = useState([{ value: 'AUD', label: 'AUD' }]);
//   const [summary, setSummary] = useState('');
//   const [startDate, setStartDate] = useState(new Date('2023-01-01'));
//   const [endDate, setEndDate] = useState(new Date('2023-01-30'));

//   const mockData = generateContinuousData('2023-01-01', 30); // 30 days of data

//   const latestSummaryRef = useRef('');

//   const data = [
//     {
//       name: 'Target',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
//       color: '#007bff',
//       marker: { enabled: false },
//       zIndex: 1,
//     },
//     {
//       name: 'AUD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.AUD]),
//       color: '#ff6f61',
//       marker: { enabled: false },
//     },
//     {
//       name: 'EUR',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.EUR]),
//       color: '#28a745',
//       marker: { enabled: false },
//     },
//     {
//       name: 'GBP',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.GBP]),
//       color: '#dc3545',
//       marker: { enabled: false },
//     },
//     {
//       name: 'JPY',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.JPY]),
//       color: '#6f42c1',
//       marker: { enabled: false },
//     },
//     {
//       name: 'USD',
//       data: mockData.map(d => [new Date(d.Date).getTime(), d.USD]),
//       color: '#ffc107',
//       marker: { enabled: false },
//     }
//   ];

//   const calculateTotal = (filteredData) => {
//     return filteredData.map(d => {
//       return [new Date(d.Date).getTime(), selectedCurrencies.reduce((acc, curr) => acc + d[curr.value], 0)];
//     });
//   };

//   const getFilteredData = () => {
//     return mockData.filter(d => {
//       const date = new Date(d.Date).getTime();
//       return date >= startDate.getTime() && date <= endDate.getTime();
//     });
//   };

//   const filteredData = getFilteredData();
//   const totalValues = calculateTotal(filteredData);

//   const totalLine = {
//     name: 'Total',
//     data: totalValues,
//     color: '#343a40',
//     marker: { enabled: false },
//     zIndex: 1,
//   };

//   const shadeData = {
//     name: 'Shaded Area',
//     data: totalValues.map((point, index) => ({
//       x: point[0],
//       low: Math.min(point[1], filteredData[index].Target),
//       high: Math.max(point[1], filteredData[index].Target)
//     })),
//     type: 'arearange',
//     lineWidth: 0,
//     linkedTo: ':previous',
//     color: 'rgba(0, 123, 255, 0.2)',
//     fillOpacity: 0.3,
//     zIndex: 0,
//     marker: {
//       enabled: false
//     }
//   };

//   const handleCurrencyChange = (selectedOptions) => {
//     setSelectedCurrencies(selectedOptions);
//   };

//   const getData = () => {
//     const compareData = [
//       totalLine,
//       ...data.filter(d => selectedCurrencies.some(currency => currency.value === d.name)),
//       {
//         name: 'Target',
//         data: filteredData.map(d => [new Date(d.Date).getTime(), d.Target]),
//         color: '#007bff',
//         marker: { enabled: false },
//         zIndex: 1,
//       },
//     ];
//     return compareWithTarget ? [...compareData, shadeData] : compareData;
//   };

//   const columns = [
//     { name: 'Date', selector: row => row.Date, sortable: true },
//     { name: 'Target', selector: row => row.Target, sortable: true },
//     { name: 'AUD', selector: row => row.AUD, sortable: true },
//     { name: 'EUR', selector: row => row.EUR, sortable: true },
//     { name: 'GBP', selector: row => row.GBP, sortable: true },
//     { name: 'JPY', selector: row => row.JPY, sortable: true },
//     { name: 'USD', selector: row => row.USD, sortable: true },
//     { name: 'Total', selector: row => row.Total, sortable: true },
//   ];

//   const tableData = filteredData.map(d => ({
//     Date: d.Date,
//     Target: d.Target,
//     AUD: d.AUD,
//     EUR: d.EUR,
//     GBP: d.GBP,
//     JPY: d.JPY,
//     USD: d.USD,
//     Total: totalValues[filteredData.indexOf(d)][1]
//   }));

//   const handleTooltipFormatter = function () {
//     const points = this.points;
//     let targetValue = null;
//     let totalValue = null;

//     points.forEach(point => {
//       if (point.series.name === 'Target') {
//         targetValue = point.y;
//       }
//       if (point.series.name === 'Total') {
//         totalValue = point.y;
//       }
//     });

//     if (targetValue !== null && totalValue !== null) {
//       const difference = (totalValue - targetValue).toFixed(2);
//       const totalBreakdown = selectedCurrencies.map(currency => {
//         const point = points.find(p => p.series.name === currency.value);
//         return `${currency.value}: ${point.y.toFixed(2)}`;
//       }).join('<br>');

//       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `Difference: ${difference}<br><br>`;
//       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

//       // Update the summary ref instead of state
//       latestSummaryRef.current = summaryHTML;

//       return points.reduce((s, point) => {
//         return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//     }

//     return points.reduce((s, point) => {
//       return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
//     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//   };

//   // Update the summary state in a controlled manner
//   useEffect(() => {
//     const updateSummary = () => {
//       if (summary !== latestSummaryRef.current) {
//         setSummary(latestSummaryRef.current);
//       }
//     };

//     const interval = setInterval(updateSummary, 1000);
//     return () => clearInterval(interval);
//   }, [summary]);

//   const options = {
//     chart: {
//       type: 'line',
//       zoomType: 'x',
//       backgroundColor: '#d3d3d3', // Light gray background for the chart
//       events: {
//         load: function () {
//           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         }
//       }
//     },
//     title: {
//       text: 'Currency Exchange Rates',
//     },
//     xAxis: {
//       type: 'datetime',
//       title: {
//         text: 'Date',
//       },
//       min: startDate.getTime(),
//       max: endDate.getTime(),
//     },
//     yAxis: {
//       title: {
//         text: 'Value',
//       },
//     },
//     tooltip: {
//       shared: true,
//       crosshairs: showSpikeLines,
//       formatter: handleTooltipFormatter,
//     },
//     series: getData(),
//     navigation: {
//       buttonOptions: {
//         enabled: true,
//       },
//     },
//     exporting: {
//       enabled: true,
//     },
//   };

//   useEffect(() => {
//     Highcharts.charts.forEach(chart => {
//       if (chart) {
//         chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         chart.series.forEach(series => {
//           series.setData(getData().find(s => s.name === series.name).data);
//         });
//       }
//     });
//   }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines]);

//   return (
//     <div className="app-container">
//       <Topbar /> {/* Include Topbar component */}
//       <div className="highcharts-container">
//         <div className="side-panel">
//           <div className="side-panel-header">
//             <h2>Dashboard</h2>
//             <img src="/path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
//             <p className="welcome-message">Welcome back, User!</p>
//           </div>
//           <div className="currency-selector">
//             <label>Select Currencies to Include in Total: </label>
//             <Select
//               isMulti
//               name="currencies"
//               options={[
//                 { value: 'AUD', label: 'AUD' },
//                 { value: 'EUR', label: 'EUR' },
//                 { value: 'GBP', label: 'GBP' },
//                 { value: 'JPY', label: 'JPY' },
//                 { value: 'USD', label: 'USD' },
//               ]}
//               className="currency-dropdown"
//               classNamePrefix="select"
//               value={selectedCurrencies}
//               onChange={handleCurrencyChange}
//             />
//           </div>
//           <div className="date-picker">
//             <label>Select Date Range: </label>
//             <DatePicker
//               selected={startDate}
//               onChange={date => setStartDate(date)}
//               selectsStart
//               startDate={startDate}
//               endDate={endDate}
//               className="date-input"
//             />
//             <DatePicker
//               selected={endDate}
//               onChange={date => setEndDate(date)}
//               selectsEnd
//               startDate={startDate}
//               endDate={endDate}
//               minDate={startDate}
//               className="date-input"
//             />
//           </div>
//         </div>
//         <div className="main-panel">
//           <HighchartsReact
//             highcharts={Highcharts}
//             options={options}
//             containerProps={{ className: 'chart-container' }}
//             updateArgs={[true, true, true]}
//           />
//           <div className="chart-controls">
//             <button
//               onClick={() => setShowSpikeLines(!showSpikeLines)}
//               className="toggle-button"
//             >
//               {showSpikeLines ? 'Hide Spike Lines' : 'Show Spike Lines'}
//             </button>
//             <button
//               onClick={() => setCompareWithTarget(!compareWithTarget)}
//               className="toggle-button"
//             >
//               {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
//             </button>
//           </div>
//           {compareWithTarget && (
//             <div className="summary-box">
//               <h3>Summary</h3>
//               <div dangerouslySetInnerHTML={{ __html: summary }} />
//             </div>
//           )}
//           <div className="data-table-section">
//             <DataTable
//               title="LCH Notional | Summary Table"
//               columns={columns}
//               data={tableData}
//               pagination
//               highlightOnHover
//               pointerOnHover
//               selectableRows
//               onSelectedRowsChange={({ selectedRows }) => {
//                 if (selectedRows.length > 0) {
//                   const start = new Date(selectedRows[0].Date);
//                   const end = new Date(selectedRows[selectedRows.length - 1].Date);
//                   setStartDate(start);
//                   setEndDate(end);
//                 }
//               }}
//               customStyles={customTableStyles}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const customTableStyles = {
//   header: {
//     style: {
//       fontSize: '22px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   rows: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//       '&:not(:last-of-type)': {
//         borderBottomStyle: 'solid',
//         borderBottomWidth: '1px',
//         borderBottomColor: '#343a40',
//       },
//     },
//   },
//   headCells: {
//     style: {
//       fontSize: '18px',
//       fontWeight: 'bold',
//       color: '#fff',
//       backgroundColor: '#343a40',
//     },
//   },
//   cells: {
//     style: {
//       fontSize: '16px',
//       color: '#fff',
//       backgroundColor: '#1a1a1a',
//     },
//   },
// };

// export default HighchartsGraph;

// src/components/HighchartsGraph.js

import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsAnnotations from 'highcharts/modules/annotations';
import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
import DataTable from 'react-data-table-component';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import { generateContinuousData } from '../Utils/dataGenerator';
import Topbar from './Topbar'; // Import Topbar component
import '../Styles/HighChartsGraph.css'; // Import the CSS file

HighchartsExporting(Highcharts);
HighchartsAnnotations(Highcharts);
HighchartsMore(Highcharts); // Initialize highcharts-more

const HighchartsGraph = () => {
  const [showSpikeLines, setShowSpikeLines] = useState(false);
  const [compareWithTarget, setCompareWithTarget] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState([{ value: 'AUD', label: 'AUD' }]);
  const [summary, setSummary] = useState('');
  const [startDate, setStartDate] = useState(new Date('2023-01-01'));
  const [endDate, setEndDate] = useState(new Date('2023-01-30'));

  const mockData = generateContinuousData('2023-01-01', 30); // 30 days of data

  const latestSummaryRef = useRef('');

  const data = [
    {
      name: 'Target',
      data: mockData.map(d => [new Date(d.Date).getTime(), d.Target]),
      color: '#007bff',
      marker: { enabled: false },
      zIndex: 1,
    },
    {
      name: 'AUD',
      data: mockData.map(d => [new Date(d.Date).getTime(), d.AUD]),
      color: '#ff6f61',
      marker: { enabled: false },
    },
    {
      name: 'EUR',
      data: mockData.map(d => [new Date(d.Date).getTime(), d.EUR]),
      color: '#28a745',
      marker: { enabled: false },
    },
    {
      name: 'GBP',
      data: mockData.map(d => [new Date(d.Date).getTime(), d.GBP]),
      color: '#dc3545',
      marker: { enabled: false },
    },
    {
      name: 'JPY',
      data: mockData.map(d => [new Date(d.Date).getTime(), d.JPY]),
      color: '#6f42c1',
      marker: { enabled: false },
    },
    {
      name: 'USD',
      data: mockData.map(d => [new Date(d.Date).getTime(), d.USD]),
      color: '#ffc107',
      marker: { enabled: false },
    }
  ];

  const calculateTotal = (filteredData) => {
    return filteredData.map(d => {
      return [new Date(d.Date).getTime(), selectedCurrencies.reduce((acc, curr) => acc + d[curr.value], 0)];
    });
  };

  const getFilteredData = () => {
    return mockData.filter(d => {
      const date = new Date(d.Date).getTime();
      return date >= startDate.getTime() && date <= endDate.getTime();
    });
  };

  const filteredData = getFilteredData();
  const totalValues = calculateTotal(filteredData);

  const totalLine = {
    name: 'Total',
    data: totalValues,
    color: '#343a40',
    marker: { enabled: false },
    zIndex: 1,
  };

  const shadeData = {
    name: 'Shaded Area',
    data: totalValues.map((point, index) => ({
      x: point[0],
      low: Math.min(point[1], filteredData[index].Target),
      high: Math.max(point[1], filteredData[index].Target)
    })),
    type: 'arearange',
    lineWidth: 0,
    linkedTo: ':previous',
    color: 'rgba(0, 123, 255, 0.2)',
    fillOpacity: 0.3,
    zIndex: 0,
    marker: {
      enabled: false
    }
  };

  const handleCurrencyChange = (selectedOptions) => {
    setSelectedCurrencies(selectedOptions);
  };

  const getData = () => {
    const compareData = [
      totalLine,
      ...data.filter(d => selectedCurrencies.some(currency => currency.value === d.name)),
      {
        name: 'Target',
        data: filteredData.map(d => [new Date(d.Date).getTime(), d.Target]),
        color: '#007bff',
        marker: { enabled: false },
        zIndex: 1,
      },
    ];
    return compareWithTarget ? [...compareData, shadeData] : compareData;
  };

  const columns = [
    { name: 'Date', selector: row => row.Date, sortable: true },
    { name: 'Target', selector: row => row.Target, sortable: true },
    { name: 'AUD', selector: row => row.AUD, sortable: true },
    { name: 'EUR', selector: row => row.EUR, sortable: true },
    { name: 'GBP', selector: row => row.GBP, sortable: true },
    { name: 'JPY', selector: row => row.JPY, sortable: true },
    { name: 'USD', selector: row => row.USD, sortable: true },
    { name: 'Total', selector: row => row.Total, sortable: true },
  ];

  const tableData = filteredData.map(d => ({
    Date: d.Date,
    Target: d.Target,
    AUD: d.AUD,
    EUR: d.EUR,
    GBP: d.GBP,
    JPY: d.JPY,
    USD: d.USD,
    Total: totalValues[filteredData.indexOf(d)][1]
  }));

  const handleTooltipFormatter = function () {
    const points = this.points;
    let targetValue = null;
    let totalValue = null;

    points.forEach(point => {
      if (point.series.name === 'Target') {
        targetValue = point.y;
      }
      if (point.series.name === 'Total') {
        totalValue = point.y;
      }
    });

    if (targetValue !== null && totalValue !== null) {
      const difference = (totalValue - targetValue).toFixed(2);
      const totalBreakdown = selectedCurrencies.map(currency => {
        const point = points.find(p => p.series.name === currency.value);
        return `${currency.value}: ${point.y.toFixed(2)}`;
      }).join('<br>');

      let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
      summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
      summaryHTML += `Difference: ${difference}<br><br>`;
      summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

      // Update the summary ref instead of state
      latestSummaryRef.current = summaryHTML;

      return points.reduce((s, point) => {
        return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
      }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
    }

    return points.reduce((s, point) => {
      return s + `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`;
    }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
  };

  // Update the summary state in a controlled manner
  useEffect(() => {
    const updateSummary = () => {
      if (summary !== latestSummaryRef.current) {
        setSummary(latestSummaryRef.current);
      }
    };

    const interval = setInterval(updateSummary, 1000);
    return () => clearInterval(interval);
  }, [summary]);

  const options = {
    chart: {
      type: 'line',
      zoomType: 'x',
      backgroundColor: '#d3d3d3', // Light gray background for the chart
      events: {
        load: function () {
          this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
        }
      }
    },
    title: {
      text: 'Currency Exchange Rates',
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date',
      },
      min: startDate.getTime(),
      max: endDate.getTime(),
    },
    yAxis: {
      title: {
        text: 'Value',
      },
    },
    tooltip: {
      shared: true,
      crosshairs: showSpikeLines,
      formatter: handleTooltipFormatter,
    },
    series: getData(),
    navigation: {
      buttonOptions: {
        enabled: true,
      },
    },
    exporting: {
      enabled: true,
    },
  };

  useEffect(() => {
    Highcharts.charts.forEach(chart => {
      if (chart) {
        chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
        chart.series.forEach(series => {
          series.setData(getData().find(s => s.name === series.name).data);
        });
      }
    });
  }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines]);

  return (
    <div className="app-container">
      <Topbar /> {/* Include Topbar component */}
      <div className="highcharts-container">
        <div className="side-panel">
          <div className="side-panel-header">
            <h2>Dashboard</h2>
            <img src="/path/to/profile-pic.jpg" alt="Profile" className="profile-pic" />
            <p className="welcome-message">Welcome back, User!</p>
          </div>
          <div className="currency-selector">
            <label>Select Currencies to Include in Total: </label>
            <Select
              isMulti
              name="currencies"
              options={[
                { value: 'AUD', label: 'AUD' },
                { value: 'EUR', label: 'EUR' },
                { value: 'GBP', label: 'GBP' },
                { value: 'JPY', label: 'JPY' },
                { value: 'USD', label: 'USD' },
              ]}
              className="currency-dropdown"
              classNamePrefix="select"
              value={selectedCurrencies}
              onChange={handleCurrencyChange}
            />
          </div>
          <div className="date-picker">
            <label>Select Date Range: </label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="date-input"
            />
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="date-input"
            />
          </div>
        </div>
        <div className="main-panel">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={{ className: 'chart-container' }}
            updateArgs={[true, true, true]}
          />
          <div className="chart-controls">
            <button
              onClick={() => setShowSpikeLines(!showSpikeLines)}
              className="toggle-button"
            >
              {showSpikeLines ? 'Hide Spike Lines' : 'Show Spike Lines'}
            </button>
            <button
              onClick={() => setCompareWithTarget(!compareWithTarget)}
              className="toggle-button"
            >
              {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
            </button>
          </div>
          {compareWithTarget && (
            <div className="summary-box">
              <h3>Summary</h3>
              <div dangerouslySetInnerHTML={{ __html: summary }} />
            </div>
          )}
          <div className="data-table-section">
            <DataTable
              title="LCH Notional | Summary Table"
              columns={columns}
              data={tableData}
              pagination
              highlightOnHover
              pointerOnHover
              selectableRows
              onSelectedRowsChange={({ selectedRows }) => {
                if (selectedRows.length > 0) {
                  const start = new Date(selectedRows[0].Date);
                  const end = new Date(selectedRows[selectedRows.length - 1].Date);
                  setStartDate(start);
                  setEndDate(end);
                }
              }}
              customStyles={customTableStyles}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const customTableStyles = {
  header: {
    style: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#343a40',
    },
  },
  rows: {
    style: {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#1a1a1a',
      '&:not(:last-of-type)': {
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderBottomColor: '#343a40',
      },
    },
  },
  headCells: {
    style: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#343a40',
    },
  },
  cells: {
    style: {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#1a1a1a',
    },
  },
};

export default HighchartsGraph;

