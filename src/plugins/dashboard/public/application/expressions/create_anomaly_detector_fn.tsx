/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import { get, cloneDeep, isEmpty } from 'lodash';
import { i18n } from '@osd/i18n';
import {
  OpenSearchDashboardsDatatable,
  OpenSearchDashboardsDatatableColumn,
  ExpressionFunctionDefinition,
  VisData,
} from 'src/plugins/expressions/public';
// import { PersistedState } from '../../public';
// import { Adapters } from '../../../inspector';

import { Filter, Query } from '../../../../data/common';
// import { FilterManager } from '../../../data/public/query';

import { constructDetectorFromVis } from '../../../../visualizations/public/anomaly_detection/utils/helpers';
import { getParsedValue, ExecutionContext } from '../../../../expressions/common';
// import {
//   getTypes,
//   getIndexPatterns,
//   getFilterManager,
//   getSearch,
//   getAnomalyDetectionService,
// } from '../services';
// import { Dimension } from '../../../vis_type_vislib/public/vislib/helpers/point_series';
// import {
//   getAnomalyDataRangeQuery,
//   buildParamsForGetAnomalyResultsWithDateRange,
// } from '../../../../../plugins/anomaly-detection-dashboards-plugin-1/public/';
import { Detector } from '../../../../visualizations/public/anomaly_detection';

interface Arguments {
  visContext: string;
  dashboardContext: string;
  savedSearchId: string | null;
  vis: string;
  indexPattern: string;
  aggConfigs: string;
}

type Input = null;
type Output = Promise<string>;

const name = 'create_anomaly_detector';

const handleCreateAnomalyDetectorRequest = async (
  args: Arguments,
  getSavedObject: ExecutionContext['getSavedObject']
) => {
  console.log('in handleCreateAnomalyDetectorRequest');
  return 'dummy-detector-id';
  //   const vis = JSON.parse(args.vis);
  //   const visConfig = get(vis, 'params', {});
  //   const aggConfigs = JSON.parse(args.aggConfigs);
  //   const indexPatternService = getIndexPatterns();
  //   const indexPattern = await indexPatternService.get(JSON.parse(args.indexPattern)!.id);
  //   //const { filterManager } = getQueryService();
  //   const searchService = getSearch();
  //   const anomalyDetectionService = getAnomalyDetectionService();

  //   const aggs = searchService.aggs.createAggConfigs(indexPattern, aggConfigs);
  //   const parsedVisQuery = getParsedValue(args.visQuery, {}) as Query;
  //   const parsedVisFilters = getParsedValue(args.visFilters, []);

  //   const detector = await constructDetectorFromVis(
  //     vis,
  //     indexPattern,
  //     aggs,
  //     getSavedObject,
  //     parsedVisQuery,
  //     parsedVisFilters
  //   );

  //   const createDetectorResponse = await anomalyDetectionService.createDetector(detector);
  //   //console.log('create detector response: ', createDetectorResponse);
  //   return get(createDetectorResponse, 'response.id', null);
};

const handleStartRealTimeAnomalyDetection = async (detectorId: string) => {
  console.log('kicking off RT AD job');
  const startRealTimeDetectorJobResponse = await getAnomalyDetectionService().startRealTimeDetectorJob(
    detectorId
  );
  //console.log('start real-time response: ', startRealTimeDetectorJobResponse);
};

const handleStartHistoricalAnomalyDetection = async (args: Arguments, detectorId: string) => {
  console.log('kicking off historical AD job');

  const vis = JSON.parse(args.vis);

  // right now we pull the time range from the vis config. the range as stored in different agg configs (e.g., x-axis date-histogram)
  // may be stored in string-form and require some more conversion (e.g., 'now-7d', 'now').
  const timeRange = get(vis, 'params.dimensions.x.params.bounds', {});
  const startTimeMillis = Date.parse(get(timeRange, 'min', ''));
  const endTimeMillis = Date.parse(get(timeRange, 'max', ''));
  const startHistoricalDetectorJobResponse = await getAnomalyDetectionService().startHistoricalDetectorJob(
    detectorId,
    startTimeMillis,
    endTimeMillis
  );
  //console.log('start historical response: ', startHistoricalDetectorJobResponse);

  // TODO: experiment with fetching results here. Just probably do a hard wait for few seconds then query.
  // this is only to prove how to parse the results and add them to the data table / get them to show properly.
  // Ideally this will need to be done some async way where results get auto-refreshed on the vis.

  // get task id first
  const taskId = get(startHistoricalDetectorJobResponse, 'response._id', null);

  // adding manual wait time for now just to let a historical job finish and we can fetch the new results
  console.log('waiting 5 seconds...');
  await new Promise((r) => setTimeout(r, 5000));
  console.log('done');

  // get the narrowed-down date range to search on
  const anomalyDataRangeResponse = await getAnomalyDetectionService().searchResults(
    getAnomalyDataRangeQuery(startTimeMillis, endTimeMillis, taskId)
  );
  const anomalyStartTime = get(anomalyDataRangeResponse, 'response.aggregations.min_end_time');
  const anomalyEndTime = get(anomalyDataRangeResponse, 'response.aggregations.max_end_time');
  const anomalyResultsResponse = await getAnomalyDetectionService().getAnomalyResults(
    taskId,
    buildParamsForGetAnomalyResultsWithDateRange(anomalyStartTime, anomalyEndTime, true),
    true
  );
  const anomalies = get(anomalyResultsResponse, 'response.results', []) as any[];
  return anomalies;
};

export type ExpressionFunctionCreateAnomalyDetector = ExpressionFunctionDefinition<
  'create_anomaly_detector',
  Input,
  Arguments,
  Output
>;

export const createAnomalyDetectorFunction = (): ExpressionFunctionCreateAnomalyDetector => ({
  name,
  type: undefined,
  inputTypes: [],
  help: i18n.translate('visTypeVislib.functions.anomaly_detection.help', {
    defaultMessage: 'Create an anomaly detector from a visualization',
  }),
  args: {
    visContext: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
    dashboardContext: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
    savedSearchId: {
      types: ['string', 'null'],
      default: null,
      help: '',
    },
    vis: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
    indexPattern: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
    aggConfigs: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
  },
  async fn(input, args, { getSavedObject }) {
    const vis = JSON.parse(args.vis);
    let visConfig = get(vis, 'params', {});
    console.log('in AD expressions fn - visconfig: ', visConfig);

    const detectorId = await handleCreateAnomalyDetectorRequest(args, getSavedObject);

    // TODO: probably return something else with more useful info
    return detectorId;
    // return {
    //   type: 'vis_data',
    //   dataTable: dataTable,
    //   visConfig: JSON.stringify(visConfig),
    // };
  },
});
