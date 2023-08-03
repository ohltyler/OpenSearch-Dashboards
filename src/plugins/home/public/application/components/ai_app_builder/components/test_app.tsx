/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EuiFieldText, EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText, EuiTitle } from '@elastic/eui';
import { DEFAULT_COLOR } from '../constants';

export function TestApp() {
  const [input, setInput] = useState('');

  const onChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <EuiFlexItem grow={true} style={{ maxWidth: 700 }}>
      <EuiFlexGroup direction="column" gutterSize="m">
        <EuiFlexItem grow={true} style={{ maxHeight: 50 }}>
          <EuiTitle size="m">
            <h3>Test Portal</h3>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem style={{ backgroundColor: DEFAULT_COLOR }}>
          <EuiFlexGroup direction="column" justifyContent="spaceBetween">
            <EuiFlexItem grow={false}>
              <EuiPanel
                grow={false}
                paddingSize="s"
                style={{ marginTop: 20, marginLeft: 20, marginRight: 60 }}
              >
                <EuiText size="s">(AI) Hello, how are you today?</EuiText>
              </EuiPanel>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiPanel
                grow={false}
                paddingSize="s"
                style={{ marginBottom: 20, marginLeft: 60, marginRight: 20 }}
              >
                <EuiFieldText
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => onChange(e)}
                  aria-label="Use aria labels when no actual label is in use"
                />
              </EuiPanel>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  );
}
