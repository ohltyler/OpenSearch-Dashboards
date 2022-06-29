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

import { get } from 'lodash';
import moment from 'moment';
import { formatExpression, SerializedFieldFormat } from '../../../../../expressions/public';
import { IAggConfig, search, TimefilterContract } from '../../../../../data/public';
import { Vis, VisParams } from '../types';
import { AnomalyDetectorCreationExpressionInput } from './types';

const { isDateHistogramBucketAggConfig } = search.aggs;

export interface BuildPipelineParams {
  timefilter: TimefilterContract;
  timeRange?: any;
  abortSignal?: AbortSignal;
}

export const prepareJson = (variable: string, data?: object): string => {
  if (data === undefined) {
    return '';
  }
  return `${variable}='${JSON.stringify(data).replace(/\\/g, `\\\\`).replace(/'/g, `\\'`)}' `;
};

export const escapeString = (data: string): string => {
  return data.replace(/\\/g, `\\\\`).replace(/'/g, `\\'`);
};

export const prepareString = (variable: string, data?: string): string => {
  if (data === undefined) {
    return '';
  }
  return `${variable}='${escapeString(data)}' `;
};

export const buildCreateDetectorPipeline = async (
  input: AnomalyDetectorCreationExpressionInput
) => {
  const { visContext, dashboardContext, savedSearchId, vis, indexPattern, aggConfigs } = input;

  // context
  let pipeline = `opensearchDashboards | opensearch_dashboards_context | create_anomaly_detector `;
  pipeline += prepareJson('visContext', visContext);
  pipeline += prepareJson('dashboardContext', dashboardContext);
  if (savedSearchId) {
    pipeline += prepareString('savedSearchId', savedSearchId);
  }
  pipeline += `${prepareJson('vis', {
    title: vis.title,
    params: { ...vis.params },
    data: { savedSearchId: vis.data.savedSearchId },
  })} `;
  pipeline += prepareJson('indexPattern', indexPattern);
  pipeline += prepareJson('aggConfigs', aggConfigs);

  //console.log('pipeline: ', pipeline);
  return pipeline;
};
