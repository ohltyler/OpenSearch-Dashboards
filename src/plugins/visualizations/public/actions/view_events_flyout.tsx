/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiFlyoutBody, EuiFlyoutHeader, EuiText, EuiFlyout } from '@elastic/eui';
import { ExprVis } from '../expressions/vis';
// import { createVegaVisualization } from '../../../vis_type_vega/public';

interface Props {
  onClose: () => void;
  vis: ExprVis;
}

export class ViewEventsFlyout extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    console.log('vis in flyout render fn: ', this.props.vis);

    // TODO: create a VegaVisualization component and embed in the flyout.
    // see example of creating one in vega_visualization.test.js
    // Also note this will need to be moved to a separate plugin so there is no cyclical deps. Maybe rebase with feature branch so i can add
    // these things in the visaugmenter plugin.

    // const domNode = document.createElement('div');
    // const VegaVisualization = createVegaVisualization(vegaVisualizationDependencies);

    return (
      <EuiFlyout onClose={this.props.onClose}>
        <EuiFlyoutHeader hasBorder></EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiText>Hello world</EuiText>
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }
}
