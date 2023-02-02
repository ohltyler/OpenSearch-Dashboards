/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

import './styles.scss';
import { VisualizeEmbeddable } from '../../../visualizations/public';

interface Props {
  embeddable: VisualizeEmbeddable;
}

export function DateRangeItem(props: Props) {
  return (
    <EuiFlexGroup direction="row" gutterSize="s">
      <EuiFlexItem grow={false}>
        <EuiText>Placeholder date range</EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
