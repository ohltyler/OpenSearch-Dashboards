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

import { IAnomalyDetectionApiClient, Detector } from './types';

interface AnomalyDetectionServiceDeps {
  apiClient: IAnomalyDetectionApiClient;
}

export class AnomalyDetectionService {
  private apiClient: IAnomalyDetectionApiClient;

  constructor({ apiClient }: AnomalyDetectionServiceDeps) {
    this.apiClient = apiClient;
  }

  /**
   * Get detector based on detector ID
   */
  getDetector = async (detectorId: string) => {
    return this.apiClient.getDetector(detectorId);
  };

  /**
   * Create detector
   */
  createDetector = async (detector: Detector) => {
    return this.apiClient.createDetector(detector);
  };

  /**
   * Start real-time anomaly detection job
   */
  startRealTimeDetectorJob = async (detectorId: string) => {
    return this.apiClient.startRealTimeDetectorJob(detectorId);
  };

  /**
   * Start historical anomaly detection job
   */
  startHistoricalDetectorJob = async (
    detectorId: string,
    startTimeMillis: number,
    endTimeMillis: number
  ) => {
    return this.apiClient.startHistoricalDetectorJob(detectorId, startTimeMillis, endTimeMillis);
  };

  /**
   * Stop real-time or historical anomaly detection job
   */
  stopDetector = async (detectorId: string, isHistorical: boolean = false) => {
    return this.apiClient.stopDetector(detectorId, isHistorical);
  };

  /**
   * Delete detector based on detector ID
   */
  deleteDetector = async (detectorId: string) => {
    return this.apiClient.deleteDetector(detectorId);
  };

  /**
   * Search anomaly results with a generic query (e.g., get result start and end times)
   */
  searchResults = async (requestBody: {}) => {
    return this.apiClient.searchResults(requestBody);
  };

  /**
   * Get anomaly results
   */
  getAnomalyResults = async (id: string, queryParams: any, isHistorical: boolean) => {
    return this.apiClient.getAnomalyResults(id, queryParams, isHistorical);
  };
}

export type AnomalyDetectionContract = PublicMethodsOf<AnomalyDetectionService>;
