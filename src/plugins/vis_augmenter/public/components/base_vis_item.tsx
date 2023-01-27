/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
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
}

export function BaseVisItem(props: Props) {
  const PanelComponent = getEmbeddable().getEmbeddablePanel();

  return (
    <EuiFlexGroup direction="row">
      <EuiFlexItem className="view-events-flyout__visDescription" grow={false} />
      <EuiFlexItem grow={true} className="view-events-flyout__baseVis">
        <PanelComponent embeddable={props.embeddable} hideHeader={true} />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
