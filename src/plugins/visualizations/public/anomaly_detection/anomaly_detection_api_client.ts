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

import { HttpSetup } from 'src/core/public';
import { IAnomalyDetectionApiClient } from './types';

const API_BASE_URL: string = `/api/anomaly_detectors`;

export class AnomalyDetectionApiClient implements IAnomalyDetectionApiClient {
  private http: HttpSetup;

  constructor(http: HttpSetup) {
    this.http = http;
  }

  // TODO: make this generic to handle more than just GET
  private makeRequest = (path: string, request: any) => {
    return this.http.get(path);
  };

  getDetector = (detectorId: string): Promise<any> => {
    const path = `${API_BASE_URL}/detectors/${detectorId}`;
    return this.makeRequest(path, undefined);
  };
}
