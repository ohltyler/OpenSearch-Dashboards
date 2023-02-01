/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';
import './styles.scss';
import { EventVisItem } from './event_vis_item';
import { VisualizeEmbeddable } from '../../../visualizations/public';

interface Props {
  pluginTitle: string;
  embeddables: Array<{ pluginResourceId: string; embeddable: VisualizeEmbeddable }>;
}

export function PluginEventsPanel(props: Props) {
  return (
    <>
      <EuiSpacer size="l" />
      <EuiFlexGroup direction="row">
        <EuiFlexItem grow={false}>
          <EuiText size="m" style={{ fontWeight: 'bold' }}>
            {props.pluginTitle}
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
      {props.embeddables.map((embeddable, index) => (
        <EventVisItem
          key={index}
          pluginResourceId={embeddable.pluginResourceId}
          embeddable={embeddable.embeddable}
        />
      ))}
    </>
  );
}
