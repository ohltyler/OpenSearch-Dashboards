/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';
import { getEmbeddable } from '../services';
import './styles.scss';
import { EventVisEmbeddableItem } from './';

interface Props {
  item: EventVisEmbeddableItem;
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
              {/* TODO: change from originPlugin to plugin resource name.
              Need to update vislayer data model*/}
              <EuiText size="s">{props.item.visLayer.originPlugin}</EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>

        <EuiFlexItem grow={true} className="view-events-flyout__eventVis">
          <PanelComponent
            embeddable={props.item.embeddable}
            hideHeader={true}
            hasBorder={false}
            hasShadow={false}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
}
