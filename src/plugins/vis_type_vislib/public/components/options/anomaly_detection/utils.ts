/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

// TODO: clean up this import similar to how other places are pulling in AD imports
import { PLUGIN_NAME } from '../../../../../../../plugins/anomaly-detection-dashboards-plugin-1/public/';

export function getAnomalyDetectorUrl(detectorId: string): string {
  return `${PLUGIN_NAME}#/detectors/${detectorId}`;
}
