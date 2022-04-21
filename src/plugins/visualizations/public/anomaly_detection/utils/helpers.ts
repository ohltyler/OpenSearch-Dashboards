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

import { IIndexPattern } from '../../../../data/common';

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
