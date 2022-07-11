/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */
import { EuiFlyout, EuiFlyoutBody, EuiText } from '@elastic/eui';
import React from 'react';
import { get } from 'lodash';
import { IEmbeddable, EmbeddableInput, EmbeddableOutput } from '../../../embeddable_plugin';
//import { TimeRange, Query, Filter } from 'src/plugins/data/public';
import { DashboardContainer, DashboardContainerInput } from '../dashboard_container';
import {
  IIndexPattern,
  IAggConfigs,
  Filter,
  Query,
  buildOpenSearchQuery,
  IAggConfig,
  TimeRange,
} from '../../../../../data/common';

import { constructDetectorFromVis } from '../../../../../anomaly_detection/utils/helpers';
import { Vis } from '../../../../../visualizations/public';
import {
  IExpressionLoaderParams,
  ExpressionsStart,
  ExpressionRenderError,
} from '../../../../../expressions/public';
import { getExpressions, getUiActions } from '../../../services';
import { Context, AnomalyDetectorCreationExpressionInput } from './types';
import { buildCreateDetectorPipeline } from './build_pipeline';

// import { Subscription } from 'rxjs';
// import { buildContextMenuForActions, UiActionsService, Action } from '../ui_actions';
// import { CoreStart, OverlayStart } from '../../../../../core/public';
// import { toMountPoint } from '../../../../opensearch_dashboards_react/public';

// import { Start as InspectorStartContract } from '../inspector';
// import {
//   CONTEXT_MENU_TRIGGER,
//   PANEL_BADGE_TRIGGER,
//   PANEL_NOTIFICATION_TRIGGER,
//   EmbeddableContext,
//   contextMenuTrigger,
// } from '../triggers';
// import {
//   IEmbeddable,
//   EmbeddableOutput,
//   EmbeddableError,
//   EmbeddableInput,
// } from '../embeddables/i_embeddable';
// import { ViewMode } from '../types';

// import { RemovePanelAction } from './panel_header/panel_actions';
// import { AddPanelAction } from './panel_header/panel_actions/add_panel/add_panel_action';
// import { CustomizePanelTitleAction } from './panel_header/panel_actions/customize_title/customize_panel_action';
// import { PanelHeader } from './panel_header/panel_header';
// import { InspectPanelAction } from './panel_header/panel_actions/inspect_panel_action';
// import { EditPanelAction } from '../actions';
// import { CustomizePanelModal } from './panel_header/panel_actions/customize_title/customize_panel_modal';
// import { EmbeddableStart } from '../../plugin';
// import { EmbeddableErrorLabel } from './embeddable_error_label';
// import { EmbeddableStateTransfer, ErrorEmbeddable } from '..';

interface Props {
  container: DashboardContainer;
  containerInput: DashboardContainerInput;
  // embeddable?: IEmbeddable<EmbeddableInput, EmbeddableOutput>;
  // filters: Filter[];
  // query: Query;
  // timeRange: TimeRange;
  //   getActions: UiActionsService['getTriggerCompatibleActions'];
  //   getEmbeddableFactory: EmbeddableStart['getEmbeddableFactory'];
  //   getAllEmbeddableFactories: EmbeddableStart['getEmbeddableFactories'];
  //   overlays: CoreStart['overlays'];
  //   notifications: CoreStart['notifications'];
  //   application: CoreStart['application'];
  //   inspector: InspectorStartContract;
  //   SavedObjectFinder: React.ComponentType<any>;
  //   stateTransfer?: EmbeddableStateTransfer;
  //   hideHeader?: boolean;
}

interface State {
  // TODO: probably don't store this as state. Only doing for now to
  // show that we can pull some embeddable fields to set some default fields (like detector title)
  // in the flyout. Although it is stored in state in dashboard_grid
  // embeddable?: IEmbeddable<EmbeddableInput, EmbeddableOutput>;
  container: DashboardContainer;
  containerInput: DashboardContainerInput;
  //   panels: EuiContextMenuPanelDescriptor[];
  //   focusedPanelIndex?: string;
  //   viewMode: ViewMode;
  //   hidePanelTitle: boolean;
  //   closeContextMenu: boolean;
  //   badges: Array<Action<EmbeddableContext>>;
  //   notifications: Array<Action<EmbeddableContext>>;
  //   loading?: boolean;
  //   error?: EmbeddableError;
  //   errorEmbeddable?: ErrorEmbeddable;
}

type ExpressionLoader = InstanceType<ExpressionsStart['ExpressionLoader']>;

export class AnomalyDetectionFlyout extends React.Component<Props, State> {
  //   private embeddableRoot: React.RefObject<HTMLDivElement>;
  //   private parentSubscription?: Subscription;
  //   private subscription: Subscription = new Subscription();
  //   private mounted: boolean = false;
  //   private generateId = htmlIdGenerator();
  private handler?: ExpressionLoader;
  private expressionString: string = '';

  constructor(props: Props) {
    super(props);
    const { container, containerInput } = this.props;

    // TODO: somwhere in here pull any existing detector if possible. Analyze the embeddable / the vis to see if any stored
    // detector ID. Propagate state depending on if any found, or if we will want to fill some default fields and/or let user
    // click something to try to generate default fields

    // const embeddableTitle = embeddable.getTitle();
    // const viewMode = embeddable.getInput().viewMode ?? ViewMode.EDIT;
    // const hidePanelTitle =
    //   Boolean(embeddable.parent?.getInput()?.hidePanelTitles) ||
    //   Boolean(embeddable.getInput()?.hidePanelTitles);

    this.state = {
      container: container,
      containerInput: containerInput,
    };

    // this.embeddableRoot = React.createRef();
  }

  public componentWillUnmount() {
    // this.mounted = false;
    // this.subscription.unsubscribe();
    // if (this.parentSubscription) {
    //   this.parentSubscription.unsubscribe();
    // }
    // if (this.state.errorEmbeddable) {
    //   this.state.errorEmbeddable.destroy();
    // }
    // this.props.embeddable.destroy();
  }

  // will want this to be async since we're just going to send it off to the expression loader handler
  // to run the expressions fns, eventually triggering its own render fn which will handle all of the
  // rendering for us
  // TODO: make this async when switching to calling the handler
  public render() {
    console.log('in anomaly_detection_flyout render');
    console.log('container: ', this.state.container);
    console.log('container input: ', this.state.containerInput);
    const selectedAdEmbeddable = this.state.containerInput.selectedAdEmbeddable;
    const embeddableDomNode = get(selectedAdEmbeddable, 'domNode', undefined) as HTMLElement;
    const expressions = getExpressions();
    this.handler = new expressions.ExpressionLoader(embeddableDomNode, undefined, {
      onRenderError: (element: HTMLElement, error: ExpressionRenderError) => {
        this.onContainerError(error);
      },
    });

    const vis = get(selectedAdEmbeddable, 'vis', {}) as Vis;

    // Collect query and filters from 3 places:
    // 1. the vis itself
    // 2. the dashboard context
    // 3. the vis savedSearchId, if applicable
    // We combine with dashboard context because each detector will map to a vis/dashboard combo.
    // That way, users can create separate detectors for
    // the same visualization that's embedded in separate dashboards/clusters/etc.

    // When any query or filter is saved for a vis, it's saved within the stored searchSource
    const visContext = {
      query: get(selectedAdEmbeddable, 'vis.data.searchSource.fields.query', {}) as Query,
      filters: get(selectedAdEmbeddable, 'vis.data.searchSource.fields.filter', []) as Filter[],
    } as Context;

    const dashboardContext = {
      query: get(this, 'state.containerInput.query', {}) as Query,
      filters: get(this, 'state.containerInput.filters', []) as Filter[],
    } as Context;

    const input = {
      visContext: visContext,
      dashboardContext: dashboardContext,
      savedSearchId: get(vis, 'data.savedSearchId', ''),
      vis: vis,
      indexPattern: get(vis, 'data.indexPattern', {}) as IIndexPattern,
      aggConfigs: get(vis, 'data.aggs', {}) as IAggConfigs,
    } as AnomalyDetectorCreationExpressionInput;

    this.createDetector(input);

    // TODO: move from calling this directly to sending to an expression fn
    // const detectorToCreate = constructDetectorFromVis(
    //   vis,
    //   indexPattern,
    //   aggConfigs
    // )

    // This flyout works. Uncomment the below chunk to return a basic flyout
    return (
      <EuiFlyout
        onClose={() => {
          console.log('trying to close flyout');
          this.props.container.updateInput({
            adFlyoutOpen: false,
          });
        }}
      >
        {' '}
        <EuiFlyoutBody>
          <EuiText>
            Placeholder for now. This will show a detector based on visualization:{' '}
            {this.state.containerInput.selectedAdEmbeddable?.getTitle()}
          </EuiText>
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }

  public componentDidMount() {
    // if (this.embeddableRoot.current) {
    //   this.subscription.add(
    //     this.props.embeddable.getOutput$().subscribe(
    //       (output: EmbeddableOutput) => {
    //         this.setState({
    //           error: output.error,
    //           loading: output.loading,
    //         });
    //       },
    //       (error) => {
    //         if (this.embeddableRoot.current) {
    //           const errorEmbeddable = new ErrorEmbeddable(error, { id: this.props.embeddable.id });
    //           errorEmbeddable.render(this.embeddableRoot.current);
    //           this.setState({ errorEmbeddable });
    //         }
    //       }
    //     )
    //   );
    //   this.props.embeddable.render(this.embeddableRoot.current);
  }

  onContainerError = (error: ExpressionRenderError) => {
    console.log('in onContainerError() - error: ', error);
    // if (this.abortController) {
    //   this.abortController.abort();
    // }
    // this.renderComplete.dispatchError();
    // this.updateOutput({ loading: false, error });
  };

  /**
   * Create detector with expressions handler
   */
  private async createDetector(input: AnomalyDetectorCreationExpressionInput) {
    this.expressionString = await buildCreateDetectorPipeline(input);

    console.log('in AD flyout updateHandler()');

    // TODO: uncomment when the new expression fn is built and ready to be tested
    if (this.handler) {
      this.handler.update(this.expressionString);
    }
  }
}
