/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';
import { getEmbeddable } from '../services';
import {
  EmbeddableInput,
  EmbeddableOutput,
  ErrorEmbeddable,
  IEmbeddable,
} from '../../../embeddable/public';
import './styles.scss';

interface Props {
  embeddable: IEmbeddable<EmbeddableInput, EmbeddableOutput> | ErrorEmbeddable;
  pluginResourceId: string;
}

export function EventVisItem(props: Props) {
  const PanelComponent = getEmbeddable().getEmbeddablePanel();

  return (
    <>
      <EuiSpacer size="l" />
      <EuiFlexGroup direction="row">
        <EuiFlexItem grow={false} className="view-events-flyout__visDescription">
          <EuiFlexGroup alignItems="center">
            <EuiFlexItem>
              <EuiText size="s">{props.pluginResourceId}</EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>

        <EuiFlexItem grow={true} className="view-events-flyout__eventVis">
          <PanelComponent
            embeddable={props.embeddable}
            hideHeader={true}
            hasBorder={false}
            hasShadow={false}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
}
