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
import { IAnomalyDetectionApiClient, API_BASE_URL, Detector } from './types';

// NOTE: these are making calls to server-side AD plugin. Check server/routes/ad.ts to see server/node API spec.
export class AnomalyDetectionApiClient implements IAnomalyDetectionApiClient {
  private http: HttpSetup;

  constructor(http: HttpSetup) {
    this.http = http;
  }

  getDetector = (detectorId: string): Promise<any> => {
    const path = `${API_BASE_URL}/detectors/${detectorId}`;
    return this.http.get(path);
  };

  createDetector = (detector: Detector): Promise<any> => {
    const path = `${API_BASE_URL}/detectors`;
    return this.http.post(path, { body: JSON.stringify(detector) });
  };

  startRealTimeDetectorJob = (detectorId: string): Promise<any> => {
    const path = `${API_BASE_URL}/detectors/${detectorId}/start`;
    return this.http.post(path, {});
  };

  startHistoricalDetectorJob = (
    detectorId: string,
    startTimeMillis: number,
    endTimeMillis: number
  ): Promise<any> => {
    const path = `${API_BASE_URL}/detectors/${detectorId}/start`;
    return this.http.post(path, {
      body: JSON.stringify({ startTime: startTimeMillis, endTime: endTimeMillis }),
    });
  };

  stopDetector = (detectorId: string, isHistorical: boolean): Promise<any> => {
    const path = `${API_BASE_URL}/detectors/${detectorId}/stop/${isHistorical}`;
    return this.http.post(path, {});
  };

  deleteDetector = (detectorId: string): Promise<any> => {
    const path = `${API_BASE_URL}/detectors/${detectorId}`;
    return this.http.delete(path, {});
  };

  searchResults = (requestBody: {}): Promise<any> => {
    const path = `${API_BASE_URL}/detectors/results/_search`;
    return this.http.post(path, { body: JSON.stringify(requestBody) });
  };

  getAnomalyResults = (id: string, queryParams: any, isHistorical: boolean) => {
    const path = `${API_BASE_URL}/detectors/${id}/results/${isHistorical}`;
    return this.http.get(path, { query: queryParams });
  };
}
