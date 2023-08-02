/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Catalog, Workspace } from './components';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

export function AiAppBuilder() {
  return (
    <EuiFlexGroup direction="row" gutterSize="l" style={{ height: 1000, padding: 50 }}>
      <EuiFlexItem grow={3}>
        <Catalog />
      </EuiFlexItem>
      <EuiFlexItem grow={7}>
        <Workspace />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
