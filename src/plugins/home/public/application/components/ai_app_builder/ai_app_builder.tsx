/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Catalog, Workspace, TestApp } from './components';
import { EuiFlexGroup, EuiFlexItem, EuiPage } from '@elastic/eui';
import { ReactFlowProvider } from 'reactflow';

import './components/dnd-styles.scss';

export function AiAppBuilder() {
  return (
    <EuiPage>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper">
            <EuiFlexItem grow={true} style={{ maxHeight: '80vh' }}>
              <EuiFlexGroup direction="row" gutterSize="l" style={{ height: 5000, padding: 50 }}>
                <EuiFlexItem grow={3}>
                  <Catalog />
                </EuiFlexItem>
                <EuiFlexItem grow={5}>
                  <Workspace />
                </EuiFlexItem>
                <EuiFlexItem grow={2}>
                  <TestApp />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </div>
        </ReactFlowProvider>
      </div>
    </EuiPage>
  );
}
