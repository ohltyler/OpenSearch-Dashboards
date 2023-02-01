/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';
import './styles.scss';
import { EventVisItem } from './event_vis_item';
import { VisualizeEmbeddable } from '../../../visualizations/public';
import { EventVisEmbeddableItem } from './';

interface Props {
  pluginTitle: string;
  items: Array<EventVisEmbeddableItem>;
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
      {props.items.map((item, index) => (
        <EventVisItem key={index} item={item} />
      ))}
    </>
  );
}
