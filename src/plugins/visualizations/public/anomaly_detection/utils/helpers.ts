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

import { IIndexPattern, IAggConfigs, Filter, Query } from '../../../../data/common';
import { FeatureAttributes } from '../types';
import { getSearch } from '../../services';

export const constructDetectorNameFromVis = (visTitle: string) => {
  return visTitle.toLowerCase().replace(/\s/g, '-') + '-detector';
};

export const constructDetectorDescriptionFromVis = (visTitle: string) => {
  return `Anomaly detector based off of the visualization: '${visTitle}'`;
};

// TODO: figure out proper error handling in here. Right now just printing log lines
export const constructDetectorTimeFieldFromVis = (
  timeFields: string[] | undefined,
  indexPattern: IIndexPattern
): string => {
  let timeField = undefined as string | undefined;
  if (timeFields && timeFields.length > 0) {
    if (timeFields.length > 1) {
      console.log('too many timefields - only one can be specified');
    } else {
      timeField = timeFields[0];
    }
  } else {
    timeField = indexPattern !== undefined ? indexPattern.getTimeField?.()?.name : '';
  }

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
export const constructDetectorIndexFromIndexPattern = (indexPattern: IIndexPattern): string[] => {
  return [indexPattern.title];
};

// TODO: make output (which is feature array) typesafe. Need to figure out how to import or re-defined feature data model
export const constructDetectorFeatureAttributesFromVis = (
  aggs: IAggConfigs
): FeatureAttributes[] => {
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

// TODO: find better way to get the raw query. Currently constructing it via search source creation to use its buildOpenSearchQuery
// helper fn. Note that that's an external fn that could possibly be added here. But still using search source for now since
// there's some extra context and config used as part of query construction; prefer to not duplicate that logic if possible.
export const constructDetectorFilterQueryFromVis = async (
  filters: Filter[],
  query: Query
): Promise<any> => {
  const searchService = getSearch();
  const searchSource = await searchService.searchSource.create();
  searchSource.setField('filter', filters);
  searchSource.setField('query', query);
  const requestBody = await searchSource.getSearchRequestBody();
  console.log('request body: ', requestBody);
  return requestBody;
};
