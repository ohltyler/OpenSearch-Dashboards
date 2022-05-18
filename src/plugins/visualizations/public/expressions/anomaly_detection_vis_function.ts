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

import { get, hasIn } from 'lodash';
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

import { Detector } from '../anomaly_detection';
import { constructDetectorFromVis } from '../anomaly_detection/utils';
import { getParsedValue, ExecutionContext } from '../../../expressions/common';
import {
  getTypes,
  getIndexPatterns,
  getFilterManager,
  getSearch,
  getAnomalyDetectionService,
} from '../services';

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

const handleAnomalyDetectorRequest = async (
  args: Arguments,
  getSavedObject: ExecutionContext['getSavedObject']
) => {
  console.log('in handleAnomalyDetectorRequest');
  const testGetDetectorResponse = await getAnomalyDetectionService().getDetector(
    'ZpjY-38BAw1nCA43DbP4'
  );
  //console.log('TEST - get detector response: ', testGetDetectorResponse);

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
  console.log('create detector response: ', createDetectorResponse);
  const detectorId = get(createDetectorResponse, 'response.id', '');

  if (visConfig.realTimeAnomalyDetection) {
    console.log('kicking off RT AD job');
    const startRealTimeDetectorJobResponse = await anomalyDetectionService.startRealTimeDetectorJob(
      detectorId
    );
    console.log('start real-time response: ', startRealTimeDetectorJobResponse);
  }

  if (visConfig.historicalAnomalyDetection) {
    console.log('kicking off historical AD job');

    // right now we pull the time range from the vis config. the range as stored in different agg configs (e.g., x-axis date-histogram)
    // may be stored in string-form and require some more conversion (e.g., 'now-7d', 'now').
    const timeRange = get(vis, 'params.dimensions.x.params.bounds', {});
    const startTimeMillis = Date.parse(get(timeRange, 'min', ''));
    const endTimeMillis = Date.parse(get(timeRange, 'max', ''));
    const startHistoricalDetectorJobResponse = await anomalyDetectionService.startHistoricalDetectorJob(
      detectorId,
      startTimeMillis,
      endTimeMillis
    );
    console.log('start historical response: ', startHistoricalDetectorJobResponse);
  }

  return createDetectorResponse;
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

    // if AD enabled and no detector ID: create a new detector via detector creation expression fn.
    // for detection jobs:
    // kick off real-time job
    // run historical job based on range in vis
    if (visConfig.enableAnomalyDetection && !visConfig.detectorId) {
      console.log('ad enabled - creating new detector via expression');

      //   // Set basic search source info here
      //   const indexPatterns = getIndexPatterns();
      //   const searchService = getSearchService();
      //   const indexPattern = await indexPatterns.get(args.index);
      //   const searchSource = await searchService.searchSource.create();

      //   searchSource.setField('index', indexPattern);
      //   searchSource.setField('size', 0);
      const response = await handleAnomalyDetectorRequest(args, getSavedObject);
      const detectorId = get(response, 'response.id', null);
      if (detectorId) {
        //console.log('setting detector id in vis config: ', detectorId);
        visConfig = { ...visConfig, detectorId: detectorId };
      } else {
        //console.log('detector already created or some other error happened when trying to create');
      }

      //console.log('vis config now: ', visConfig);
    } else {
      console.log('ad disabled');
    }
    // const indexPatterns = getIndexPatterns();
    // const { filterManager } = getQueryService();
    // const searchService = getSearchService();

    // const aggConfigsState = JSON.parse(args.aggConfigs);
    // const indexPattern = await indexPatterns.get(args.index);
    // const aggs = searchService.aggs.createAggConfigs(indexPattern, aggConfigsState);

    // // we should move searchSource creation inside courier request handler
    // const searchSource = await searchService.searchSource.create();

    // searchSource.setField('index', indexPattern);
    // searchSource.setField('size', 0);

    // const response = await handleCourierRequest({
    //   searchSource,
    //   aggs,
    //   indexPattern,
    //   timeRange: get(input, 'timeRange', undefined),
    //   query: get(input, 'query', undefined) as any,
    //   filters: get(input, 'filters', undefined),
    //   timeFields: args.timeFields,
    //   //   metricsAtAllLevels: args.metricsAtAllLevels,
    //   //   partialRows: args.partialRows,
    //   inspectorAdapters: inspectorAdapters as Adapters,
    //   filterManager,
    //   abortSignal: (abortSignal as unknown) as AbortSignal,
    // });

    // const table: OpenSearchDashboardsDatatable = {
    //   type: 'opensearch_dashboards_datatable',
    //   rows: response.rows,
    //   columns: response.columns.map((column: any) => {
    //     const cleanedColumn: OpenSearchDashboardsDatatableColumn = {
    //       id: column.id,
    //       name: column.name,
    //       //meta: serializeAggConfig(column.aggConfig),
    //     };
    //     // if (args.includeFormatHints) {
    //     //   cleanedColumn.formatHint = column.aggConfig.toSerializedFieldFormat();
    //     // }
    //     return cleanedColumn;
    //   }),
    // };

    // For now, just return the table and vis config, such that this fn performs no actions other than pass the args
    // through to the next one.
    return {
      type: 'vis_data',
      dataTable: input,
      visConfig: JSON.stringify(visConfig),
    };
  },
});
