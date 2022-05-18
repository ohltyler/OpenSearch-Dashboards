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

import React from 'react';
import { EuiText } from '@elastic/eui';

function EmptyDetectorDetails() {
  return (
    <>
      <EuiText size="s">
        No created anomaly detector found. Enable anomaly detection and apply to run anomaly
        detection.
      </EuiText>
    </>
  );
}

export { EmptyDetectorDetails };
