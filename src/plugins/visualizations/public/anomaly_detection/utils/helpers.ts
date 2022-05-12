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
  IAggConfig,
} from '../../../../data/common';
import { FeatureAttributes } from '../types';
//import { getSearch } from '../../services';
import { Detector, Schedule, UNITS } from '../../anomaly_detection';
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

const constructDetectorFilterQuery = (
  indexPattern: IIndexPattern,
  queries: Query[],
  filters: Filter[]
): any => {
  return buildOpenSearchQuery(indexPattern, queries, filters);
};

const convertAggConfigToFeatureAggregation = (
  featureName: string,
  fieldName: string,
  aggType: string
) => {
  return {
    [featureName]: {
      [aggType]: {
        field: fieldName,
      },
    },
  };
};

// TODO: fetch the valid agg types from AD somewhere, or via some constant stored here
const isValidAggType = (aggType: string): boolean => {
  // TODO: the 'count' agg is valid in AD for a field - but 'count' is only an agg over a doc existing from vis perspective.
  // figure out how to handle that here.
  return aggType === 'avg' || aggType === 'max' || aggType === 'min' || aggType === 'sum';
};

const convertAggConfigToDetectorFeature = (aggConfig: IAggConfig): FeatureAttributes | null => {
  const aggType = aggConfig.type.dslName;
  if (aggConfig.schema === 'metric' && aggConfig.enabled === true && isValidAggType(aggType)) {
    const fieldName = aggConfig.getField().name;
    const featureName = aggConfig.getParam('customLabel')
      ? aggConfig.getParam('customLabel').replace(/\s/g, '-')
      : `${aggType}-${fieldName}`;

    return {
      featureName: featureName,
      featureEnabled: true,
      aggregationQuery: convertAggConfigToFeatureAggregation(featureName, fieldName, aggType),
      importance: 1,
    };
  } else {
    return null;
  }
};

const constructDetectorFeaturesFromVis = (aggs: IAggConfigs): FeatureAttributes[] => {
  const aggConfigs = aggs.aggs;

  const features = [] as FeatureAttributes[];

  aggConfigs.forEach((aggConfig) => {
    const feature = convertAggConfigToDetectorFeature(aggConfig);
    if (feature !== null) {
      features.push(feature);
    }
  });
  return features;
};

// TODO: determine this from interval used in the vis instead of hardcoding value
const constructDetectorInvervalFromVis = (): { period: Schedule } => {
  return {
    period: {
      interval: 10,
      unit: UNITS.MINUTES,
    },
  };
};

// TODO: find a smart way to determine this instead of hardcoding value
const constructDetectorWindowDelayFromVis = (): { period: Schedule } => {
  return {
    period: {
      interval: 1,
      unit: UNITS.MINUTES,
    },
  };
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

  detector.featureAttributes = constructDetectorFeaturesFromVis(aggs);
  detector.detectionInterval = constructDetectorInvervalFromVis();
  // NOTE: window delay is not reqd - currently just defaulting to 1 min like AD UI already does
  detector.windowDelay = constructDetectorWindowDelayFromVis();
  return detector;
};
