/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// TODO: right now using dummy spec, not using any vislayers
export const getSpecFromVisLayers = (visLayers: Array<any>): string => {
  const jsonSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    datasets: {
      globaldata: [
        { x: 1, y: 2, 'anomaly-events': 0, 'alert-events': 0 },
        { x: 2, y: 3, 'anomaly-events': 0, 'alert-events': 0 },
        { x: 3, y: 10, 'anomaly-events': 3, 'alert-events': 2 },
        { x: 4, y: 3, 'anomaly-events': 0, 'alert-events': 0 },
        { x: 5, y: 4, 'anomaly-events': 0, 'alert-events': 0 },
        { x: 6, y: 4, 'anomaly-events': 0, 'alert-events': 1 },
        { x: 7, y: 8, 'anomaly-events': 1, 'alert-events': 0 },
        { x: 8, y: 4, 'anomaly-events': 0, 'alert-events': 0 },
        { x: 9, y: 5, 'anomaly-events': 0, 'alert-events': 0 },
        { x: 10, y: 4, 'anomaly-events': 0, 'alert-events': 0 },
      ],
    },
    config: {
      circle: { color: 'blue' },
      rule: { color: 'red' },
      concat: { spacing: 0 },
      view: { stroke: null },
    },
    mark: 'circle',
    data: { name: 'globaldata' },
    encoding: {
      x: {
        axis: {
          domain: false,
          grid: false,
          ticks: false,
          labels: false,
          title: null,
        },
        field: 'x',
        type: 'quantitative',
        scale: { domain: [0, 10] },
      },
      size: {
        value: 75,
      },
      tooltip: [
        { field: 'anomaly-events', type: 'quantitative', title: 'Anomalies' },
        { field: 'alert-events', type: 'quantitative', title: 'Alerts' },
      ],
    },
  };

  return JSON.stringify(jsonSpec);
};
