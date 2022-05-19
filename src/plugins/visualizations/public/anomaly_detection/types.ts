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

// TODO: need to figure out the best way to import these data models/interfaces. The path changes depending on
// a dev env or bundled zip env (anomaly-detection-dashboards in dev vs. anomalyDetectionDashboards in bundle)
// May need to redefine some AD data models here (in core). Downside is it requires more maintenance if there is model changes.
// In addition, this import requires 'anomalyDetectionDashboards' to be listed as a required plugin in visualizations plugin
// (see visualizations/opensearch_dashboards.json)
import { Detector } from '../../../../../plugins/anomaly-detection-dashboards-plugin-1/public/';
export * from '../../../../../plugins/anomaly-detection-dashboards-plugin-1/public/';

export const API_BASE_URL: string = `/api/anomaly_detectors`;

export interface IAnomalyDetectionApiClient {
  getDetector: (detectorId: string) => Promise<any>;
  createDetector: (detector: Detector) => Promise<any>;
  startRealTimeDetectorJob: (detectorId: string) => Promise<any>;
  startHistoricalDetectorJob: (
    detectorId: string,
    startTimeMillis: number,
    endTimeMillis: number
  ) => Promise<any>;
  stopDetector: (detectorId: string, isHistorical: boolean) => Promise<any>;
  deleteDetector: (detectorId: string) => Promise<any>;
}
