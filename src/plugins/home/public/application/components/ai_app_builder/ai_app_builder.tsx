/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Catalog, Workspace } from './components';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { ReactFlowProvider } from 'reactflow';

import './components/dnd-styles.scss';

export function AiAppBuilder() {
  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper">
          <EuiFlexGroup direction="row" gutterSize="l" style={{ height: 1000, padding: 50 }}>
            <EuiFlexItem grow={3}>
              <Catalog />
            </EuiFlexItem>
            <EuiFlexItem grow={7}>
              <Workspace />
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </ReactFlowProvider>
    </div>
  );
}
