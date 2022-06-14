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

import { i18n } from '@osd/i18n';
import { IEmbeddable } from '../../embeddable_plugin';
import { ActionByType, IncompatibleActionError } from '../../ui_actions_plugin';
import { DASHBOARD_CONTAINER_TYPE, DashboardContainer } from '../embeddable';

export const ACTION_ANOMALY_DETECTION = 'anomalyDetection';

function isDashboard(embeddable: IEmbeddable): embeddable is DashboardContainer {
  return embeddable.type === DASHBOARD_CONTAINER_TYPE;
}

// function isExpanded(embeddable: IEmbeddable) {
//   if (!embeddable.parent || !isDashboard(embeddable.parent)) {
//     throw new IncompatibleActionError();
//   }

//   return embeddable.id === embeddable.parent.getInput().expandedPanelId;
// }

export interface AnomalyDetectionActionContext {
  embeddable: IEmbeddable;
}

export class AnomalyDetectionAction implements ActionByType<typeof ACTION_ANOMALY_DETECTION> {
  public readonly type = ACTION_ANOMALY_DETECTION;
  public readonly id = ACTION_ANOMALY_DETECTION;
  public order = 8;

  constructor() {}

  public getDisplayName({ embeddable }: AnomalyDetectionActionContext) {
    if (!embeddable.parent || !isDashboard(embeddable.parent)) {
      throw new IncompatibleActionError();
    }
    return i18n.translate('dashboard.actions.anomalyDetectionMenuItem.displayName', {
      defaultMessage: 'Detect anomalies',
    });
  }

  public getIconType({ embeddable }: AnomalyDetectionActionContext) {
    if (!embeddable.parent || !isDashboard(embeddable.parent)) {
      throw new IncompatibleActionError();
    }
    return 'outlierDetectionJob';
  }

  public async isCompatible({ embeddable }: AnomalyDetectionActionContext) {
    return Boolean(embeddable.parent && isDashboard(embeddable.parent));
  }

  public async execute({ embeddable }: AnomalyDetectionActionContext) {
    if (!embeddable.parent || !isDashboard(embeddable.parent)) {
      console.log('AD action is incompatible');
      throw new IncompatibleActionError();
    }

    // TODO: here is where the logic for handling the action being clicked should be handled - e.g., open some side panel
    // to construct and run an anomaly detector.
    console.log('executing AD action');
    console.log('embeddable: ', embeddable);

    // See below example of the expand panel action. It calls back to the parent embeddable and updates the expanded panel ID,
    // such that the subscription on the input reads this new field, updates state, and will render the specific panel
    // in an expanded fashion.

    //   const newValue = isExpanded(embeddable) ? undefined : embeddable.id;
    //   embeddable.parent.updateInput({
    //     expandedPanelId: newValue,
    //   });
  }
}
