/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';
import {
  EmbeddableInput,
  EmbeddableOutput,
  ErrorEmbeddable,
  IEmbeddable,
} from '../../../embeddable/public';
import './styles.scss';
import { EventVisItem } from './event_vis_item';

interface Props {
  pluginTitle: string;
  embeddables: Array<IEmbeddable<EmbeddableInput, EmbeddableOutput> | ErrorEmbeddable>;
  pluginResourceIds: Array<string>;
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
          embeddable={embeddable}
          pluginResourceId={props.pluginResourceIds[index]}
        />
      ))}
    </>
  );
}
