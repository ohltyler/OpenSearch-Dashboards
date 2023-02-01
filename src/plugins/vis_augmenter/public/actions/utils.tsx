/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// TODO: this entire fn below can be removed. Repurpose it for adding util fns
// for partitioning the vis layers and constructing it to be passed to downstream components

// export const getSpecFromVisLayers = (
//   visLayers: Array<any>,
//   timeRangeBounds: TimeRangeBounds
// ): string => {
//   let globaldata = [] as any[];

//   console.log('timerangebounds: ', timeRangeBounds);

//   const jsonSpec = {
//     $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
//     datasets: {
//       globaldata: globaldata,
//     },
//     config: {
//       circle: { color: 'blue' },
//       rule: { color: 'red' },
//       concat: { spacing: 0 },
//       view: { stroke: null },
//     },
//     mark: 'circle',
//     data: { name: 'globaldata' },
//     encoding: {
//       x: {
//         axis: {
//           domain: false,
//           grid: false,
//           ticks: false,
//           labels: false,
//           title: null,
//         },
//         field: 'x',
//         type: 'quantitative',
//         scale: { domain: [0, 10] },
//       },
//       size: {
//         value: 75,
//       },
//       tooltip: [
//         { field: 'anomaly-events', type: 'quantitative', title: 'Anomalies' },
//         { field: 'alert-events', type: 'quantitative', title: 'Alerts' },
//       ],
//     },
//   };

//   return JSON.stringify(jsonSpec);
// };
