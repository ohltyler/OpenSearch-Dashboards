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

import {
  IIndexPattern,
  IAggConfigs,
  Filter,
  Query,
  buildOpenSearchQuery,
} from '../../../../data/common';
import { FeatureAttributes } from '../types';
import { getSearch } from '../../services';
import { Detector } from '../../anomaly_detection';
import {
  mergeQueriesAndFiltersWithSavedSearch,
  ExecutionContext,
} from '../../../../expressions/common';

const constructDetectorNameFromVis = (visTitle: string) => {
  return visTitle.toLowerCase().replace(/\s/g, '-') + '-detector';
};

const constructDetectorDescriptionFromVis = (visTitle: string) => {
  return `Anomaly detector based off of the visualization: '${visTitle}'`;
};

// TODO: figure out proper error handling in here. Right now just printing log lines
const constructDetectorTimeFieldFromVis = (indexPattern: IIndexPattern): string => {
  const timeField = indexPattern !== undefined ? indexPattern.getTimeField?.()?.name : '';
  if (timeField === undefined || timeField.length === 0) {
    console.log('no valid time fields found');
    return '';
  }

  return timeField;
};

// TODO: extra cases need to be handled here:
// 1. users can create vis from a search obj instead of index pattern. note search obj includes an index pattern so it
// can still be extracted
// 2. comma-separated list is not supported (e.g., 'index1,index2'). Need to manually split, or add support in backend/frontend AD.
// 3. other filters or banned fields may be applied in index pattern possibly, need to research
const constructDetectorIndexFromIndexPattern = (indexPattern: IIndexPattern): string[] => {
  return [indexPattern.title];
};

// TODO: make output (which is feature array) typesafe. Need to figure out how to import or re-defined feature data model
const constructDetectorFeatureAttributesFromVis = (aggs: IAggConfigs): FeatureAttributes[] => {
  const feature1: FeatureAttributes = {
    featureName: 'test',
    featureEnabled: true,
    aggregationQuery: {
      test: {
        sum: {
          field: 'value',
        },
      },
    },
    importance: 1,
  };
  return [feature1];
};

const constructDetectorFilterQuery = (
  indexPattern: IIndexPattern,
  queries: Query[],
  filters: Filter[]
): any => {
  return buildOpenSearchQuery(indexPattern, queries, filters);
};

export const constructDetectorFromVis = async (
  vis: any,
  indexPattern: IIndexPattern,
  aggs: IAggConfigs,
  getSavedObject: ExecutionContext['getSavedObject'],
  visQuery: Query,
  visFilters: []
): Promise<Detector> => {
  let detector = {} as Detector;
  detector.name = constructDetectorNameFromVis(vis.title);
  detector.description = constructDetectorDescriptionFromVis(vis.title);
  detector.timeField = constructDetectorTimeFieldFromVis(indexPattern);
  detector.indices = constructDetectorIndexFromIndexPattern(indexPattern);

  // Merge any vis queries/filters with those from a saved search, if applicable
  let combinedQueries = [visQuery];
  let combinedFilters = visFilters;
  if (vis.data!.savedSearchId) {
    [combinedQueries, combinedFilters] = await mergeQueriesAndFiltersWithSavedSearch(
      [visQuery],
      visFilters,
      vis.data.savedSearchId,
      getSavedObject
    );
  }
  detector.filterQuery = constructDetectorFilterQuery(
    indexPattern,
    combinedQueries,
    combinedFilters
  );

  // TODO: get detector feature parsing working
  //detector.featureAttributes = constructDetectorFeatureAttributesFromVis(aggs);

  return detector;
};
