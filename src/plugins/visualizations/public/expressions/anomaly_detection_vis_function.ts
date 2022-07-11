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

import { Filter, Query } from '../../../data/common';
// import { FilterManager } from '../../../data/public/query';

import { Detector } from '../../../anomaly_detection';
import { constructDetectorFromVis } from '../../../anomaly_detection/utils';
import { getParsedValue, ExecutionContext } from '../../../expressions/common';
import {
  getTypes,
  getIndexPatterns,
  getFilterManager,
  getSearch,
  getAnomalyDetectionService,
} from '../services';
import { Dimension } from '../../../vis_type_vislib/public/vislib/helpers/point_series';
import {
  getAnomalyDataRangeQuery,
  buildParamsForGetAnomalyResultsWithDateRange,
} from '../../../../../plugins/anomaly-detection-dashboards-plugin-1/public/';

interface Arguments {
  vis: string;
  aggConfigs: string;
  indexPattern: string;
  visQuery?: string | null;
  visFilters?: string | null;
}

type Input = OpenSearchDashboardsDatatable;
type Output = Promise<VisData>;

const name = 'anomaly_detection';

// TODO: the logic for stopping the RT/historical jobs can be separated out. Will need to handle more cases where user
// may just toggle the RT/historical switches w/o necessarily deleting, in which case we want to
// just stop the jobs
const handleDeleteAnomalyDetectorRequest = async (visConfig: any) => {
  const anomalyDetectionService = getAnomalyDetectionService();

  // stop any real-time or historical jobs running before deleting
  if (visConfig.realTimeAnomalyDetection) {
    const stopRealTimeJobResponse = await anomalyDetectionService.stopDetector(
      visConfig.detectorId
    );
    //console.log('stop realtime job response: ', stopRealTimeJobResponse);
  }

  // NOTE: this may fail if there is no running historical job. It is much more likely that any
  // historical job has finished running and there is nothing to stop. Figure out how to cleanly
  // handle the differences, such that we still catch legitimate failures if it fails to stop
  // an actual running historical job.
  if (visConfig.historicalAnomalyDetection) {
    const stopHistoricalJobResponse = await anomalyDetectionService.stopDetector(
      visConfig.detectorId,
      true
    );
    //console.log('stop historical job response: ', stopHistoricalJobResponse);
  }

  const deleteDetectorResponse = await anomalyDetectionService.deleteDetector(visConfig.detectorId);

  return deleteDetectorResponse;
};

const handleCreateAnomalyDetectorRequest = async (
  args: Arguments,
  getSavedObject: ExecutionContext['getSavedObject']
) => {
  const vis = JSON.parse(args.vis);
  const visConfig = get(vis, 'params', {});
  const aggConfigs = JSON.parse(args.aggConfigs);
  const indexPatternService = getIndexPatterns();
  const indexPattern = await indexPatternService.get(JSON.parse(args.indexPattern)!.id);
  //const { filterManager } = getQueryService();
  const searchService = getSearch();
  const anomalyDetectionService = getAnomalyDetectionService();

  const aggs = searchService.aggs.createAggConfigs(indexPattern, aggConfigs);
  const parsedVisQuery = getParsedValue(args.visQuery, {}) as Query;
  const parsedVisFilters = getParsedValue(args.visFilters, []);

  const detector = await constructDetectorFromVis(
    vis,
    indexPattern,
    aggs,
    getSavedObject,
    parsedVisQuery,
    parsedVisFilters
  );

  const createDetectorResponse = await anomalyDetectionService.createDetector(detector);
  //console.log('create detector response: ', createDetectorResponse);
  return get(createDetectorResponse, 'response.id', null);
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

const appendAnomaliesToTable = (dataTable: OpenSearchDashboardsDatatable, anomalies: any[]) => {
  const AD_COLUMN_ID = 'ad';
  const newDataTable = cloneDeep(dataTable);
  console.log('newDataTable (before): ', newDataTable);
  console.log('anomalies: ', anomalies);

  // append a new column
  newDataTable.columns = [
    ...newDataTable.columns,
    {
      id: AD_COLUMN_ID,
      name: 'Anomaly',
    } as OpenSearchDashboardsDatatableColumn,
  ];

  // for each anomaly, find the correct time bucket it goes in and add the anomaly value there in the AD column
  // reverse it since the initial results are returned in reverse sequential order
  let rowIndex = 0;
  anomalies.reverse().forEach((anomaly: any) => {
    let found = false;
    while (rowIndex < newDataTable.rows.length - 1 && !found) {
      // assuming the first column in the rows data is the x-axis / timestamp values.
      // probably need to find a better way to guarantee this
      const startTs = newDataTable.rows[rowIndex][
        Object.keys(newDataTable.rows[rowIndex])[0]
      ] as number;
      const endTs = newDataTable.rows[rowIndex + 1][
        Object.keys(newDataTable.rows[rowIndex + 1])[0]
      ] as number;

      if (startTs <= anomaly.plotTime && endTs > anomaly.plotTime) {
        // adding hacky soln of choosing the first y-series data to overlay anomaly spike
        // this is strictly for making it easier to show correlation of the data w/ the anomaly
        const firstYVal = newDataTable.rows[rowIndex][
          Object.keys(newDataTable.rows[rowIndex])[1]
        ] as number;
        newDataTable.rows[rowIndex] = {
          ...newDataTable.rows[rowIndex],
          [AD_COLUMN_ID]: firstYVal,
        };
        found = true;
      } else {
        rowIndex++;
      }
    }
  });

  console.log('newDataTable (after): ', newDataTable);
  return newDataTable;
};

const appendAdDimensionToConfig = (visConfig: any, dataTable: OpenSearchDashboardsDatatable) => {
  // the AD column is appended last. All previous dimensions are incremented sequentially starting from 0.
  // So given 1 x-axis column (accessor=0), 1 y-axis metric column (accessor=1), and 1 y-axis AD column,
  // the accessor should be 2 (column length -1).
  const adAccessor = dataTable.columns.length - 1;
  visConfig.dimensions.y.push({
    accessor: adAccessor,
    //aggType: 'avg',
    format: {},
    label: 'Anomaly',
    params: {},
  } as Dimension);
};

export type ExpressionFunctionVisualizationAnomalyDetection = ExpressionFunctionDefinition<
  'anomaly_detection',
  Input,
  Arguments,
  Output
>;

export const visualizationAnomalyDetectionFunction = (): ExpressionFunctionVisualizationAnomalyDetection => ({
  name,
  type: 'vis_data',
  inputTypes: ['opensearch_dashboards_datatable'],
  help: i18n.translate('visTypeVislib.functions.anomaly_detection.help', {
    defaultMessage: 'Create an anomaly detector from a visualization',
  }),
  args: {
    vis: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
    aggConfigs: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
    indexPattern: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
    visQuery: {
      types: ['string', 'null'],
      default: null,
      help: '',
    },
    visFilters: {
      types: ['string', 'null'],
      default: '"[]"',
      help: '',
    },
  },
  async fn(input, args, { getSavedObject }) {
    const vis = JSON.parse(args.vis);
    let visConfig = get(vis, 'params', {});
    console.log('visconfig: ', visConfig);

    let dataTable = input;

    // if AD enabled and no detector ID: create a new detector via detector creation expression fn.
    // for detection jobs:
    // kick off real-time job
    // run historical job based on range in vis
    if (visConfig.enableAnomalyDetection && !visConfig.detectorId) {
      console.log('ad enabled - creating new detector via expression');
      const detectorId = await handleCreateAnomalyDetectorRequest(args, getSavedObject);
      if (detectorId) {
        visConfig = { ...visConfig, detectorId: detectorId };
        if (visConfig.realTimeAnomalyDetection) {
          await handleStartRealTimeAnomalyDetection(detectorId);
        }
        if (visConfig.historicalAnomalyDetection) {
          const anomalies = await handleStartHistoricalAnomalyDetection(args, detectorId);

          // append any found anomalies to the existing data table and vis dimension
          if (!isEmpty(anomalies)) {
            dataTable = appendAnomaliesToTable(dataTable, anomalies);
            appendAdDimensionToConfig(visConfig, dataTable);
            console.log('visconfig: ', visConfig);
          }
        }
      } else {
        console.log('detector already created or some other error happened when trying to create');
      }
      // if there's an existing detector ID but the user has disabled AD, then stop
      // and delete the detector, disassociate detector ID
    } else if (!visConfig.enableAnomalyDetection && visConfig.detectorId) {
      console.log('ad disabled - deleting created detector');
      const response = await handleDeleteAnomalyDetectorRequest(visConfig);
      //console.log('delete detector response: ', response);
      visConfig.detectorId = null;
    } else {
      console.log('no need to create or delete anything');
    }

    // Return updated visConfig with any new AD fields (detector ID, maybe detector state, etc.)
    // TODO: update the dataTable with AD results / anomalies
    return {
      type: 'vis_data',
      dataTable: dataTable,
      visConfig: JSON.stringify(visConfig),
    };
  },
});
