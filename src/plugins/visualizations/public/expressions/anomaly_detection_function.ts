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
} from 'src/plugins/expressions/public';
// import { PersistedState } from '../../public';
// import { Adapters } from '../../../inspector';

// import {
//   calculateBounds,
//   OpenSearchaggsExpressionFunctionDefinition,
//   Filter,
//   getTime,
//   IIndexPattern,
//   isRangeFilter,
//   Query,
//   TimeRange,
//   getRequestInspectorStats,
//   getResponseInspectorStats,
//   IAggConfigs,
//   ISearchSource,
//   tabifyAggResponse,
// } from '../../../data/common';
// import { FilterManager } from '../../../data/public/query';

import { Detector } from '../anomaly_detection';
import {
  constructDetectorNameFromVis,
  constructDetectorDescriptionFromVis,
  constructDetectorTimeFieldFromVis,
} from '../anomaly_detection/utils';

import {
  getTypes,
  getIndexPatterns,
  getFilterManager,
  getSearch,
  getAnomalyDetectionService,
} from '../services';

interface Arguments {
  title: string;
  index: string;
  aggConfigs: string;
  visConfig: string;
  timeFields?: string[];
}

type Input = OpenSearchDashboardsDatatable;
type Output = Promise<OpenSearchDashboardsDatatable>;

const name = 'anomaly_detection';

const handleAnomalyDetectorRequest = async (args: Arguments) => {
  console.log('in handleAnomalyDetectorRequest');
  const testGetDetectorResponse = await getAnomalyDetectionService().getDetector(
    'ZpjY-38BAw1nCA43DbP4'
  );
  console.log('TEST - get detector response: ', testGetDetectorResponse);

  const visConfig = JSON.parse(args.visConfig);
  const indexPatterns = getIndexPatterns();
  //const { filterManager } = getQueryService();
  const searchService = getSearch();
  const aggConfigsState = JSON.parse(args.aggConfigs);
  const indexPattern = await indexPatterns.get(args.index);
  const aggs = searchService.aggs.createAggConfigs(indexPattern, aggConfigsState);

  console.log('visConfig: ', visConfig);
  console.log('indexPattern: ', indexPattern);
  console.log('aggs: ', aggs);

  // TODO: add logic to parse the vis config and the aggs to build an AD creation request
  let detector = {} as Detector;
  detector.name = constructDetectorNameFromVis(args.title);
  detector.description = constructDetectorDescriptionFromVis(args.title);
  detector.timeField = constructDetectorTimeFieldFromVis(args.timeFields, indexPattern);

  console.log('detector to create (so far): ', detector);

  // Make the request
};

export type ExpressionFunctionVisualizationAnomalyDetection = ExpressionFunctionDefinition<
  'anomaly_detection',
  Input,
  Arguments,
  Output
>;

export const visualizationAnomalyDetectionFunction = (): ExpressionFunctionVisualizationAnomalyDetection => ({
  name,
  type: 'opensearch_dashboards_datatable',
  inputTypes: ['opensearch_dashboards_datatable'],
  help: i18n.translate('visTypeVislib.functions.anomaly_detection.help', {
    defaultMessage: 'Create an anomaly detector from a visualization',
  }),
  args: {
    title: {
      types: ['string'],
      help: '',
    },
    index: {
      types: ['string'],
      help: '',
    },
    aggConfigs: {
      types: ['string'],
      default: '""',
      help: '',
    },
    visConfig: {
      types: ['string'],
      default: '"{}"',
      help: '',
    },
    timeFields: {
      types: ['string'],
      help: '',
      multi: true,
    },
  },
  async fn(table, args, { inspectorAdapters, abortSignal }) {
    console.log('running AD expression fn');
    const visConfigParams = JSON.parse(args.visConfig);

    // if AD enabled and no detector ID: create a new detector via detector creation expression fn
    if (visConfigParams.enableAnomalyDetection && !visConfigParams.detectorId) {
      console.log('ad enabled - creating new detector via expression');

      //   // Set basic search source info here
      //   const indexPatterns = getIndexPatterns();
      //   const searchService = getSearchService();
      //   const indexPattern = await indexPatterns.get(args.index);
      //   const searchSource = await searchService.searchSource.create();

      //   searchSource.setField('index', indexPattern);
      //   searchSource.setField('size', 0);

      const response = await handleAnomalyDetectorRequest(args);
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

    // For now, just return the table, such that this fn performs no actions other than pass the arg
    // through to the next one.
    return table;
  },
});
