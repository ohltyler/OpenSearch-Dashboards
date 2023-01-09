/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { CoreStart } from 'src/core/public';
import { toMountPoint } from '../../../../plugins/opensearch_dashboards_react/public';
import { ExprVis } from '../expressions/vis';
import { ViewEventsFlyout } from './view_events_flyout';

interface Props {
  core: CoreStart;
  vis: ExprVis;
}

export async function openViewEventsFlyout(props: Props) {
  const flyoutSession = props.core.overlays.openFlyout(
    toMountPoint(
      <ViewEventsFlyout
        onClose={() => {
          if (flyoutSession) {
            flyoutSession.close();
          }
        }}
        vis={props.vis}
      />
    ),
    {
      'data-test-subj': 'viewEventsFlyout',
      ownFocus: true,
    }
  );
}
