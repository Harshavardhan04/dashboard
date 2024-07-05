

// // import React, { useState, useEffect, useRef } from 'react';
// // import Highcharts from 'highcharts';
// // import HighchartsReact from 'highcharts-react-official';
// // import HighchartsBoost from 'highcharts/modules/boost';
// // import HighchartsExporting from 'highcharts/modules/exporting';
// // import HighchartsAnnotations from 'highcharts/modules/annotations';
// // import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// // import DataTable from 'react-data-table-component';
// // import DatePicker from 'react-datepicker';
// // import Select from 'react-select';
// // import 'react-datepicker/dist/react-datepicker.css';
// // import Topbar from './Topbar'; // Import Topbar component
// // import '../Styles/HighChartsGraph.css'; // Import the CSS file

// // HighchartsBoost(Highcharts);
// // HighchartsExporting(Highcharts);
// // HighchartsAnnotations(Highcharts);
// // HighchartsMore(Highcharts); // Initialize highcharts-more

// // const HighchartsGraph = () => {
// //   const [showSpikeLines, setShowSpikeLines] = useState(false);
// //   const [compareWithTarget, setCompareWithTarget] = useState(false);
// //   const [selectedCurrencies, setSelectedCurrencies] = useState([{ value: 'AUD', label: 'AUD' }]);
// //   const [summary, setSummary] = useState('');
// //   const [startDate, setStartDate] = useState(new Date('2024-06-01'));
// //   const [endDate, setEndDate] = useState(new Date('2024-06-25'));
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const latestSummaryRef = useRef('');

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await fetch(`/xva`);
// //         const result = await response.json();
// //         setData(result);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //         setLoading(false);
// //       }
// //     };
// //     fetchData();
// //   }, []);

// //   const getFilteredData = () => {
// //     return data.filter(d => {
// //       const date = new Date(d.Date).getTime();
// //       return date >= startDate.getTime() && date <= endDate.getTime();
// //     });
// //   };

// //   useEffect(() => {
// //     if (!loading && data.length > 0) {
// //       const updateSummary = () => {
// //         if (summary !== latestSummaryRef.current) {
// //           setSummary(latestSummaryRef.current);
// //         }
// //       };

// //       const interval = setInterval(updateSummary, 1000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [loading, data, summary]);

// //   const filteredData = getFilteredData();

// //   const totalLine = {
// //     name: 'Total',
// //     data: filteredData.map(d => [new Date(d.Date).getTime(), d.Total]),
// //     color: '#343a40',
// //     marker: { enabled: false },
// //     zIndex: 1,
// //     boostThreshold: 1,
// //   };

// //   const shadeData = {
// //     name: 'Shaded Area',
// //     data: filteredData.map(d => ({
// //       x: new Date(d.Date).getTime(),
// //       low: Math.min(d.Total, d.Target),
// //       high: Math.max(d.Total, d.Target),
// //     })),
// //     type: 'arearange',
// //     lineWidth: 0,
// //     linkedTo: 'Total',
// //     color: 'rgba(0, 123, 255, 0.2)',
// //     fillOpacity: 0.3,
// //     zIndex: 0,
// //     marker: {
// //       enabled: false,
// //     },
// //     boostThreshold: 1, // Disable boost for arearange
// //     boost: false,
// //   };

// //   const handleCurrencyChange = (selectedOptions) => {
// //     setSelectedCurrencies(selectedOptions);
// //   };

// //   const getData = () => {
// //     const compareData = [
// //       ...selectedCurrencies.map((currency) => ({
// //         name: currency.value,
// //         data: filteredData.map((d) => [new Date(d.Date).getTime(), d[currency.value]]),
// //         color: getCurrencyColor(currency.value),
// //         marker: { enabled: false },
// //         boostThreshold: 1,
// //       })),
// //       totalLine,
// //       {
// //         name: 'Target',
// //         data: filteredData.map((d) => [new Date(d.Date).getTime(), d.Target]),
// //         color: '#007bff',
// //         marker: { enabled: false },
// //         zIndex: 1,
// //         boostThreshold: 1,
// //       },
// //       shadeData,
// //     ];
// //     return compareWithTarget ? compareData : compareData.slice(0, -1);
// //   };

// //   const getCurrencyColor = (currency) => {
// //     const colors = {
// //       AUD: '#ff6f61',
// //       EUR: '#28a745',
// //       GBP: '#dc3545',
// //       JPY: '#6f42c1',
// //       USD: '#ffc107',
// //     };
// //     return colors[currency] || '#000000';
// //   };

// //   const columns = [
// //     { name: 'Date', selector: (row) => row.Date, sortable: true },
// //     { name: 'Target', selector: (row) => row.Target, sortable: true },
// //     { name: 'AUD', selector: (row) => row.AUD, sortable: true },
// //     { name: 'EUR', selector: (row) => row.EUR, sortable: true },
// //     { name: 'GBP', selector: (row) => row.GBP, sortable: true },
// //     { name: 'JPY', selector: (row) => row.JPY, sortable: true },
// //     { name: 'USD', selector: (row) => row.USD, sortable: true },
// //     { name: 'Total', selector: (row) => row.Total, sortable: true },
// //   ];

// //   const tableData = filteredData.map((d) => ({
// //     Date: d.Date,
// //     Target: d.Target,
// //     AUD: d.AUD,
// //     EUR: d.EUR,
// //     GBP: d.GBP,
// //     JPY: d.JPY,
// //     USD: d.USD,
// //     Total: d.Total,
// //   }));

// //   const handleTooltipFormatter = function () {
// //     const points = this.points;
// //     let targetValue = null;
// //     let totalValue = null;

// //     points.forEach((point) => {
// //       if (point.series.name === 'Target') {
// //         targetValue = point.y;
// //       }
// //       if (point.series.name === 'Total') {
// //         totalValue = point.y;
// //       }
// //     });

// //     if (targetValue !== null && totalValue !== null) {
// //       const difference = (totalValue - targetValue).toFixed(2);
// //       const totalBreakdown = selectedCurrencies
// //         .map((currency) => {
// //           const point = points.find((p) => p.series.name === currency.value);
// //           return point ? `${currency.value}: ${point.y.toFixed(2)}` : `${currency.value}: N/A`;
// //         })
// //         .join('<br>');

// //       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
// //       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
// //       summaryHTML += `Difference: ${difference}<br><br>`;
// //       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

// //       // Update the summary ref instead of state
// //       latestSummaryRef.current = summaryHTML;

// //       return points.reduce((s, point) => {
// //         return (
// //           s +
// //           `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`
// //         );
// //       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
// //     }

// //     return points.reduce((s, point) => {
// //       return (
// //         s +
// //         `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`
// //       );
// //     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
// //   };

// //   const options = {
// //     chart: {
// //       type: 'line',
// //       zoomType: 'x',
// //       backgroundColor: '#d3d3d3', // Light gray background for the chart
// //       events: {
// //         load: function () {
// //           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
// //         },
// //       },
// //       boost: {
// //         useGPUTranslations: true,
// //         usePreAllocated: true,
// //       },
// //     },
// //     title: {
// //       text: 'Currency Exchange Rates',
// //     },
// //     xAxis: {
// //       type: 'datetime',
// //       title: {
// //         text: 'Date',
// //       },
// //       min: startDate.getTime(),
// //       max: endDate.getTime(),
// //     },
// //     yAxis: {
// //       title: {
// //         text: 'Value',
// //       },
// //     },
// //     legend: {
// //       layout: 'horizontal',
// //       align: 'center',
// //       verticalAlign: 'bottom',
// //       itemStyle: {
// //         color: '#000000',
// //       },
// //     },
// //     tooltip: {
// //       shared: true,
// //       crosshairs: showSpikeLines,
// //       formatter: handleTooltipFormatter,
// //     },
// //     series: getData(),
// //     navigation: {
// //       buttonOptions: {
// //         enabled: true,
// //       },
// //     },
// //     exporting: {
// //       enabled: true,
// //     },
// //   };

// //   useEffect(() => {
// //     if (!loading && data.length > 0) {
// //       Highcharts.charts.forEach((chart) => {
// //         if (chart) {
// //           chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
// //           chart.series.forEach((series) => {
// //             series.setData(getData().find((s) => s.name === series.name).data);
// //           });
// //         }
// //       });
// //     }
// //   }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines, loading, data]);

// //   return (
// //     <div className="app-container">
// //       <Topbar />
// //       <div className="floating-box-container">
// //         <div className="translucent-box">
// //           <div className="opaque-box">
// //             <div className="control-group">
// //               <label>Select Currencies to Include in Total: </label>
// //               <Select
// //                 isMulti
// //                 name="currencies"
// //                 options={[
// //                   { value: 'AUD', label: 'AUD' },
// //                   { value: 'EUR', label: 'EUR' },
// //                   { value: 'GBP', label: 'GBP' },
// //                   { value: 'JPY', label: 'JPY' },
// //                   { value: 'USD', label: 'USD' },
// //                 ]}
// //                 className="currency-dropdown"
// //                 classNamePrefix="select"
// //                 value={selectedCurrencies}
// //                 onChange={handleCurrencyChange}
// //               />
// //             </div>
// //             <div className="control-group">
// //               <label>Select Date Range: </label>
// //               <div style={{ display: 'flex' }}>
// //                 <DatePicker
// //                   selected={startDate}
// //                   onChange={(date) => setStartDate(date)}
// //                   selectsStart
// //                   startDate={startDate}
// //                   endDate={endDate}
// //                   className="date-input"
// //                 />
// //                 <DatePicker
// //                   selected={endDate}
// //                   onChange={(date) => setEndDate(date)}
// //                   selectsEnd
// //                   startDate={startDate}
// //                   endDate={endDate}
// //                   minDate={startDate}
// //                   className="date-input"
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //           <div className="opaque-box">
// //             <button onClick={() => setCompareWithTarget(!compareWithTarget)} className="toggle-button">
// //               {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
// //             </button>
// //             <div className="download-section">
// //               <button className="toggle-button">Download</button>
// //               <div className="download-options">
// //                 <button className="download-option">PNG</button>
// //                 <button className="download-option">JPEG</button>
// //                 <button className="download-option">PDF</button>
// //                 <button className="download-option">SVG</button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //       <div className="main-panel">
// //         <HighchartsReact
// //           highcharts={Highcharts}
// //           options={options}
// //           containerProps={{ className: 'chart-container' }}
// //           updateArgs={[true, true, true]}
// //         />
// //         {compareWithTarget && (
// //           <div className="summary-box">
// //             <h3>Summary</h3>
// //             <div dangerouslySetInnerHTML={{ __html: summary }} />
// //           </div>
// //         )}
// //         <div className="data-table-section">
// //           <DataTable
// //             title="LCH Notional | Summary Table"
// //             columns={columns}
// //             data={tableData}
// //             pagination
// //             highlightOnHover
// //             pointerOnHover
// //             customStyles={customTableStyles}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const customTableStyles = {
// //   header: {
// //     style: {
// //       fontSize: '22px',
// //       fontWeight: 'bold',
// //       color: '#fff',
// //       backgroundColor: '#343a40',
// //     },
// //   },
// //   rows: {
// //     style: {
// //       fontSize: '16px',
// //       color: '#fff',
// //       backgroundColor: '#1a1a1a',
// //       '&:not(:last-of-type)': {
// //         borderBottomStyle: 'solid',
// //         borderBottomWidth: '1px',
// //         borderBottomColor: '#343a40',
// //       },
// //     },
// //   },
// //   headCells: {
// //     style: {
// //       fontSize: '18px',
// //       fontWeight: 'bold',
// //       color: '#fff',
// //       backgroundColor: '#343a40',
// //     },
// //   },
// //   cells: {
// //     style: {
// //       fontSize: '16px',
// //       color: '#fff',
// //       backgroundColor: '#1a1a1a',
// //     },
// //   },
// // };

// // export default HighchartsGraph;


// import React, { useState, useEffect, useRef } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsBoost from 'highcharts/modules/boost';
// import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsAnnotations from 'highcharts/modules/annotations';
// import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
// import DataTable from 'react-data-table-component';
// import DatePicker from 'react-datepicker';
// import Select from 'react-select';
// import 'react-datepicker/dist/react-datepicker.css';
// import Topbar from './Topbar'; // Import Topbar component
// import '../Styles/HighChartsGraph.css'; // Import the CSS file

// HighchartsBoost(Highcharts);
// HighchartsExporting(Highcharts);
// HighchartsAnnotations(Highcharts);
// HighchartsMore(Highcharts); // Initialize highcharts-more

// const HighchartsGraph = () => {
//   const [showSpikeLines, setShowSpikeLines] = useState(false);
//   const [compareWithTarget, setCompareWithTarget] = useState(false);
//   const [selectedCurrencies, setSelectedCurrencies] = useState([{ value: 'AUD', label: 'AUD' }]);
//   const [summary, setSummary] = useState('');
//   const [startDate, setStartDate] = useState(new Date('2024-06-01'));
//   const [endDate, setEndDate] = useState(new Date('2024-06-25'));
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const latestSummaryRef = useRef('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/xva`);
//         const result = await response.json();
//         setData(result);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const getFilteredData = () => {
//     return data.filter(d => {
//       const date = new Date(d.Date).getTime();
//       return date >= startDate.getTime() && date <= endDate.getTime();
//     });
//   };

//   useEffect(() => {
//     if (!loading && data.length > 0) {
//       const updateSummary = () => {
//         if (summary !== latestSummaryRef.current) {
//           setSummary(latestSummaryRef.current);
//         }
//       };

//       const interval = setInterval(updateSummary, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [loading, data, summary]);

//   const filteredData = getFilteredData();

//   const totalLine = {
//     name: 'Total',
//     data: filteredData.map(d => [new Date(d.Date).getTime(), d.Total]),
//     color: '#343a40',
//     marker: { enabled: false },
//     zIndex: 1,
//     boostThreshold: 1,
//   };

//   const shadeData = {
//     name: 'Shaded Area',
//     data: filteredData.map(d => ({
//       x: new Date(d.Date).getTime(),
//       low: Math.min(d.Total, d.Target),
//       high: Math.max(d.Total, d.Target),
//     })),
//     type: 'arearange',
//     lineWidth: 0,
//     linkedTo: 'Total',
//     color: 'rgba(0, 123, 255, 0.2)',
//     fillOpacity: 0.3,
//     zIndex: 0,
//     marker: {
//       enabled: false,
//     },
//     boostThreshold: 1, // Disable boost for arearange
//     boost: false
//   };

//   const handleCurrencyChange = (selectedOptions) => {
//     setSelectedCurrencies(selectedOptions);
//   };

//   const getData = () => {
//     const compareData = [
//       ...selectedCurrencies.map((currency) => ({
//         name: currency.value,
//         data: filteredData.map((d) => [new Date(d.Date).getTime(), d[currency.value]]),
//         color: getCurrencyColor(currency.value),
//         marker: { enabled: false },
//         boostThreshold: 1,
//       })),
//       totalLine,
//       {
//         name: 'Target',
//         data: filteredData.map((d) => [new Date(d.Date).getTime(), d.Target]),
//         color: '#007bff',
//         marker: { enabled: false },
//         zIndex: 1,
//         boostThreshold: 1,
//       },
//       shadeData,
//     ];
//     return compareWithTarget ? compareData : compareData.slice(0, -1);
//   };

//   const getCurrencyColor = (currency) => {
//     const colors = {
//       AUD: '#ff6f61',
//       EUR: '#28a745',
//       GBP: '#dc3545',
//       JPY: '#6f42c1',
//       USD: '#ffc107',
//     };
//     return colors[currency] || '#000000';
//   };

//   const columns = [
//     { name: 'Date', selector: (row) => row.Date, sortable: true },
//     { name: 'Target', selector: (row) => row.Target, sortable: true },
//     { name: 'AUD', selector: (row) => row.AUD, sortable: true },
//     { name: 'EUR', selector: (row) => row.EUR, sortable: true },
//     { name: 'GBP', selector: (row) => row.GBP, sortable: true },
//     { name: 'JPY', selector: (row) => row.JPY, sortable: true },
//     { name: 'USD', selector: (row) => row.USD, sortable: true },
//     { name: 'Total', selector: (row) => row.Total, sortable: true },
//   ];

//   const tableData = filteredData.map((d) => ({
//     Date: d.Date,
//     Target: d.Target,
//     AUD: d.AUD,
//     EUR: d.EUR,
//     GBP: d.GBP,
//     JPY: d.JPY,
//     USD: d.USD,
//     Total: d.Total,
//   }));

//   const handleTooltipFormatter = function () {
//     const points = this.points;
//     let targetValue = null;
//     let totalValue = null;

//     points.forEach((point) => {
//       if (point.series.name === 'Target') {
//         targetValue = point.y;
//       }
//       if (point.series.name === 'Total') {
//         totalValue = point.y;
//       }
//     });

//     if (targetValue !== null && totalValue !== null) {
//       const difference = (totalValue - targetValue).toFixed(2);
//       const totalBreakdown = selectedCurrencies
//         .map((currency) => {
//           const point = points.find((p) => p.series.name === currency.value);
//           return point ? `${currency.value}: ${point.y.toFixed(2)}` : `${currency.value}: N/A`;
//         })
//         .join('<br>');

//       let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
//       summaryHTML += `Difference: ${difference}<br><br>`;
//       summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

//       // Update the summary ref instead of state
//       latestSummaryRef.current = summaryHTML;

//       return points.reduce((s, point) => {
//         return (
//           s +
//           `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`
//         );
//       }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//     }

//     return points.reduce((s, point) => {
//       return (
//         s +
//         `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`
//       );
//     }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
//   };

//   const options = {
//     chart: {
//       type: 'line',
//       zoomType: 'x',
//       backgroundColor: '#d3d3d3', // Light gray background for the chart
//       events: {
//         load: function () {
//           this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//         },
//       },
//       boost: {
//         useGPUTranslations: true,
//         usePreAllocated: true,
//       },
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
//     legend: {
//       layout: 'horizontal',
//       align: 'center',
//       verticalAlign: 'bottom',
//       itemStyle: {
//         color: '#000000',
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
//     if (!loading && data.length > 0) {
//       Highcharts.charts.forEach((chart) => {
//         if (chart) {
//           chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
//           chart.series.forEach((series) => {
//             series.setData(getData().find((s) => s.name === series.name).data);
//           });
//         }
//       });
//     }
//   }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines, loading, data]);

//   return (
//     <div className="app-container">
//       <Topbar />
//       <div className="floating-box-container">
//         <div className="translucent-box">
//           <div className="control-group">
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
//           <div className="control-group">
//             <label>Select Date Range: </label>
//             <div style={{ display: 'flex' }}>
//               <DatePicker
//                 selected={startDate}
//                 onChange={(date) => setStartDate(date)}
//                 selectsStart
//                 startDate={startDate}
//                 endDate={endDate}
//                 className="date-input"
//               />
//               <DatePicker
//                 selected={endDate}
//                 onChange={(date) => setEndDate(date)}
//                 selectsEnd
//                 startDate={startDate}
//                 endDate={endDate}
//                 minDate={startDate}
//                 className="date-input"
//               />
//             </div>
//           </div>
//           <div className="download-section">
//             <button onClick={() => setCompareWithTarget(!compareWithTarget)} className="toggle-button">
//               {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
//             </button>
//             <button className="toggle-button" onClick={() => console.log('Download clicked!')}>
//               Download
//             </button>
//           </div>
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







import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsBoost from 'highcharts/modules/boost';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsAnnotations from 'highcharts/modules/annotations';
import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for arearange
import DataTable from 'react-data-table-component';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import Topbar from './Topbar'; // Import Topbar component
import '../Styles/HighChartsGraph.css'; // Import the CSS file

HighchartsBoost(Highcharts);
HighchartsExporting(Highcharts);
HighchartsAnnotations(Highcharts);
HighchartsMore(Highcharts); // Initialize highcharts-more

const HighchartsGraph = () => {
  const [showSpikeLines, setShowSpikeLines] = useState(false);
  const [compareWithTarget, setCompareWithTarget] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState([{ value: 'AUD', label: 'AUD' }]);
  const [summary, setSummary] = useState('');
  const [startDate, setStartDate] = useState(new Date('2024-06-01'));
  const [endDate, setEndDate] = useState(new Date('2024-06-25'));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const latestSummaryRef = useRef('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/xva`);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredData = () => {
    return data.filter(d => {
      const date = new Date(d.Date).getTime();
      return date >= startDate.getTime() && date <= endDate.getTime();
    });
  };

  useEffect(() => {
    if (!loading && data.length > 0) {
      const updateSummary = () => {
        if (summary !== latestSummaryRef.current) {
          setSummary(latestSummaryRef.current);
        }
      };

      const interval = setInterval(updateSummary, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, data, summary]);

  const filteredData = getFilteredData();

  const totalLine = {
    name: 'Total',
    data: filteredData.map(d => [new Date(d.Date).getTime(), d.Total]),
    color: '#343a40',
    marker: { enabled: false },
    zIndex: 1,
    boostThreshold: 1,
  };

  const shadeData = {
    name: 'Shaded Area',
    data: filteredData.map(d => ({
      x: new Date(d.Date).getTime(),
      low: Math.min(d.Total, d.Target),
      high: Math.max(d.Total, d.Target),
    })),
    type: 'arearange',
    lineWidth: 0,
    linkedTo: 'Total',
    color: 'rgba(0, 123, 255, 0.2)',
    fillOpacity: 0.3,
    zIndex: 0,
    marker: {
      enabled: false,
    },
    boostThreshold: 1, // Disable boost for arearange
    boost: false
  };

  const handleCurrencyChange = (selectedOptions) => {
    setSelectedCurrencies(selectedOptions);
  };

  const getData = () => {
    const compareData = [
      ...selectedCurrencies.map((currency) => ({
        name: currency.value,
        data: filteredData.map((d) => [new Date(d.Date).getTime(), d[currency.value]]),
        color: getCurrencyColor(currency.value),
        marker: { enabled: false },
        boostThreshold: 1,
      })),
      totalLine,
      {
        name: 'Target',
        data: filteredData.map((d) => [new Date(d.Date).getTime(), d.Target]),
        color: '#007bff',
        marker: { enabled: false },
        zIndex: 1,
        boostThreshold: 1,
      },
      shadeData,
    ];
    return compareWithTarget ? compareData : compareData.slice(0, -1);
  };

  const getCurrencyColor = (currency) => {
    const colors = {
      AUD: '#ff6f61',
      EUR: '#28a745',
      GBP: '#dc3545',
      JPY: '#6f42c1',
      USD: '#ffc107',
    };
    return colors[currency] || '#000000';
  };

  const columns = [
    { name: 'Date', selector: (row) => row.Date, sortable: true },
    { name: 'Target', selector: (row) => row.Target, sortable: true },
    { name: 'AUD', selector: (row) => row.AUD, sortable: true },
    { name: 'EUR', selector: (row) => row.EUR, sortable: true },
    { name: 'GBP', selector: (row) => row.GBP, sortable: true },
    { name: 'JPY', selector: (row) => row.JPY, sortable: true },
    { name: 'USD', selector: (row) => row.USD, sortable: true },
    { name: 'Total', selector: (row) => row.Total, sortable: true },
  ];

  const tableData = filteredData.map((d) => ({
    Date: d.Date,
    Target: d.Target,
    AUD: d.AUD,
    EUR: d.EUR,
    GBP: d.GBP,
    JPY: d.JPY,
    USD: d.USD,
    Total: d.Total,
  }));

  const handleTooltipFormatter = function () {
    const points = this.points;
    let targetValue = null;
    let totalValue = null;

    points.forEach((point) => {
      if (point.series.name === 'Target') {
        targetValue = point.y;
      }
      if (point.series.name === 'Total') {
        totalValue = point.y;
      }
    });

    if (targetValue !== null && totalValue !== null) {
      const difference = (totalValue - targetValue).toFixed(2);
      const totalBreakdown = selectedCurrencies
        .map((currency) => {
          const point = points.find((p) => p.series.name === currency.value);
          return point ? `${currency.value}: ${point.y.toFixed(2)}` : `${currency.value}: N/A`;
        })
        .join('<br>');

      let summaryHTML = `<strong>Total: ${totalValue.toFixed(2)}</strong><br>`;
      summaryHTML += `<strong>Target: ${targetValue.toFixed(2)}</strong><br>`;
      summaryHTML += `Difference: ${difference}<br><br>`;
      summaryHTML += `<strong>Breakdown of Selected Currencies:</strong><br>${totalBreakdown}`;

      // Update the summary ref instead of state
      latestSummaryRef.current = summaryHTML;

      return points.reduce((s, point) => {
        return (
          s +
          `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`
        );
      }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
    }

    return points.reduce((s, point) => {
      return (
        s +
        `<br/><span style="color:${point.series.color}">${point.series.name}</span>: ${point.y}`
      );
    }, `<b>${Highcharts.dateFormat('%A, %b %e, %Y', this.x)}</b>`);
  };

  const options = {
    chart: {
      type: 'line',
      zoomType: 'x',
      backgroundColor: '#d3d3d3', // Light gray background for the chart
      events: {
        load: function () {
          this.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
        },
      },
      boost: {
        useGPUTranslations: true,
        usePreAllocated: true,
      },
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
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        color: '#000000',
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
    if (!loading && data.length > 0) {
      Highcharts.charts.forEach((chart) => {
        if (chart) {
          chart.xAxis[0].setExtremes(startDate.getTime(), endDate.getTime());
          chart.series.forEach((series) => {
            series.setData(getData().find((s) => s.name === series.name).data);
          });
        }
      });
    }
  }, [startDate, endDate, selectedCurrencies, compareWithTarget, showSpikeLines, loading, data]);

  return (
    <div className="app-container">
      <Topbar />
      <div className="floating-box-container">
        <div className="translucent-box">
          <div className="control-group">
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
          <div className="control-group">
            <label>Select Date Range: </label>
            <div style={{ display: 'flex' }}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="date-input"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="date-input"
              />
            </div>
          </div>
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
          <button onClick={() => setCompareWithTarget(!compareWithTarget)} className="toggle-button">
            {compareWithTarget ? 'Disable Compare with Target' : 'Enable Compare with Target'}
          </button>
          <button className="toggle-button" onClick={() => console.log('Download clicked!')}>
            Download
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
            customStyles={customTableStyles}
          />
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


/* 
.app-container {
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  color: var(--text-color);
}

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--control-bg-color);
  z-index: 1000;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.floating-box-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-top: 50px; 
}

.translucent-box {
  background-color: rgba(52, 58, 64, 0.5);
  padding: 20px;
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.opaque-box {
  background-color: var(--control-bg-color);
  padding: 20px;
  border-radius: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
}

.download-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.download-options {
  display: none;
  flex-direction: column;
}

.download-section:hover .download-options {
  display: flex;
}

.download-option {
  margin: 5px 0;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.download-option:hover {
  background-color: #0056b3;
}

.highcharts-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  background-color: #343a40;
  color: #fff;
  position: sticky;
  top: 50px; 
  z-index: 900; 

.control-group {
  margin-bottom: 10px;
}

.currency-dropdown {
  min-width: 200px;
}

.date-input {
  width: 120px;
  margin-left: 10px;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg-color);
  color: var(--input-text-color);
}

.main-panel {
  flex-grow: 1;
  margin-top: 20px; 
  padding: 20px;
}

.chart-container {
  width: 100%;
  height: 500px;
}

.toggle-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
}

.summary-box {
  border: 1px solid black;
  padding: 10px;
  margin-top: 20px;
  background-color: #f9f9f9;
}

.data-table-section {
  margin-top: 20px;
  width: 100%;
}


:root {
  --background-color: #1e1e1e;
  --text-color: #ffffff;
  --control-bg-color: #343a40;
  --border-color: #ffffff;
  --input-bg-color: #343a40;
  --input-text-color: #ffffff;
}

.light-theme {
  --background-color: #ffffff;
  --text-color: #000000;
  --control-bg-color: #f0f0f0;
  --border-color: #000000;
  --input-bg-color: #ffffff;
  --input-text-color: #000000;
}

.dark-theme {
  --background-color: #ffffff;
  --text-color: #ffffff;
  --control-bg-color: #343a40;
  --border-color: #ffffff;
  --input-bg-color: #343a40;
  --input-text-color: #ffffff;
} */

/* HighChartsGraph.css */

/* body {
  background-color: rgba(169, 169, 169, 0.2); 
}

.app-container {
  display: flex;
  flex-direction: column;
  background-color: black; 
  color: var(--text-color);
}

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--control-bg-color);
  z-index: 1000;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.floating-box-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-top: 70px; 
}

.translucent-box {
  background-color: rgba(52, 58, 64, 0.8); 
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.control-group {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.control-group label {
  margin-right: 10px;
}

.currency-dropdown {
  width: 200px;
}

.date-input {
  width: 120px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg-color);
  color: var(--input-text-color);
}

.download-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.download-options {
  display: none;
  flex-direction: column;
}

.download-section:hover .download-options {
  display: flex;
}

.download-option {
  margin: 5px 0;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.download-option:hover {
  background-color: #0056b3;
}

.main-panel {
  flex-grow: 1;
  margin-top: 50px; 
  padding: 20px;
}

.chart-container {
  width: 100%;
  height: 500px;
}

.toggle-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
}

.summary-box {
  border: 1px solid black;
  padding: 10px;
  margin-top: 20px;
  background-color: #f9f9f9;
}

.data-table-section {
  margin-top: 20px;
  width: 100%;
}


:root {
  --background-color: rgba(169, 169, 169, 0.2); 
  --text-color: #ffffff;
  --control-bg-color: #343a40;
  --border-color: #ffffff;
  --input-bg-color: #343a40;
  --input-text-color: #ffffff;
}

.light-theme {
  --background-color: #ffffff;
  --text-color: #000000;
  --control-bg-color: #f0f0f0;
  --border-color: #000000;
  --input-bg-color: #ffffff;
  --input-text-color: #000000;
}

.dark-theme {
  --background-color: #1e1e1e;
  --text-color: #ffffff;
  --control-bg-color: #343a40;
  --border-color: #ffffff;
  --input-bg-color: #343a40;
  --input-text-color: #ffffff;
} */


/* HighChartsGraph.css */

body {
  background-color: rgba(169, 169, 169, 0.2); /* Faint grey background */
}

.app-container {
  display: flex;
  flex-direction: column;
  background-color: rgb(0, 0, 0); /* Make container transparent to show body background */
  color: var(--text-color);
  opacity: 0.7;
}

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--control-bg-color);
  z-index: 1000;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.floating-box-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-top: 70px; /* Adjust to move the box down */
}

.translucent-box {
  background-color: rgba(52, 58, 64, 0.8); /* More translucent */
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.control-group {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.control-group label {
  margin-right: 10px;
}

.currency-dropdown {
  width: 200px;
}

.date-input {
  width: 120px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg-color);
  color: var(--input-text-color);
}

.main-panel {
  flex-grow: 1;
  margin-top: 50px; /* Adjust based on the height of the top controls */
  padding: 20px;
}

.chart-container {
  width: 100%;
  height: 500px;
}

.chart-controls {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end; /* Align to the right */
  gap: 10px;
}

.toggle-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
}

.summary-box {
  border: 1px solid black;
  padding: 10px;
  margin-top: 20px;
  background-color: #f9f9f9;
}

.data-table-section {
  margin-top: 20px;
  width: 100%;
}

/* Light/Dark Theme CSS Variables */
:root {
  --background-color: rgba(169, 169, 169, 0.2); /* Updated to a light grey */
  --text-color: #ffffff;
  --control-bg-color: #343a40;
  --border-color: #ffffff;
  --input-bg-color: #343a40;
  --input-text-color: #ffffff;
}

.light-theme {
  --background-color: #ffffff;
  --text-color: #000000;
  --control-bg-color: #f0f0f0;
  --border-color: #000000;
  --input-bg-color: #ffffff;
  --input-text-color: #000000;
}

.dark-theme {
  --background-color: #1e1e1e;
  --text-color: #ffffff;
  --control-bg-color: #343a40;
  --border-color: #ffffff;
  --input-bg-color: #343a40;
  --input-text-color: #ffffff;
}
