// import React from 'react';
// import ErrorBoundary from '../ErrorBoundary/index';

// const baseURL = process.env.ENDPOINT;

// const forecastMaxResultsDay = 8;

// const getForecastFromApiByCoords = async (coords, maxResults) => {
//   try {
//     const params = new URLSearchParams(Object.assign(maxResults ? { maxResults } : {}, coords));
//     const response = await fetch(`${baseURL}/forecast?${params}`);
//     return response.json();
//   } catch (error) {
//     ErrorBoundary.getDerivedStateFromError(error);
//   }

//   return {};
// };

// class Forecast extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       forecastData: [],
//       locationCoords: {},
//     };
//   }

//   async componentDidMount() {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         this.setState({
//           locationCoords: {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           },
//         }, this.setWeatherDataAsyncByCoords);
//       },
//       () => {
//         // to get data for defaultCity from env
//         this.setWeatherDataAsyncByCoords();
//       });
//     } else {
//       // TODO handle geolocation not supported
//     }
//   }

//   async setWeatherDataAsyncByCoords() {
//     const { locationCoords } = this.state;
//     const forecast = await getForecastFromApiByCoords(locationCoords, forecastMaxResultsDay);

//     this.setState({
//       forecastData: forecast,
//     });
//   }

//   renderForecastCol() {
//     const { forecastData } = this.state;
//     return forecastData.map((data) => (
//       <td key={data.dt_txt}>
//         <table>
//           <tbody>
//             <tr>
//               <td>
//                 <Moment format="DD/MM">{data.dt_txt}</Moment>
//               </td>
//             </tr>
//             <tr>
//               <td>
//                 <Moment format="HH:mm">{data.dt_txt}</Moment>
//               </td>
//             </tr>
//             <tr>
//               <td className="forecast-icon-cell">
//                 <img src={`/img/${data.weather[0].icon.slice(0, -1)}.svg`} alt={`Forecast icon at ${data.dt_txt}`} />
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </td>
//     ));
//   }

//   render() {
//     return (
//       <div className="forecast">
//         <table className="forecast-table">
//           <tbody>
//             <tr>
//               { this.renderForecastCol() }
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     );
//   }
// }

// export default Forecast;
