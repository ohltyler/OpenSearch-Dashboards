/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
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

import { I18nStart } from 'opensearch-dashboards/public';
import React from 'react';
import { DataPublicPluginStart } from 'src/plugins/data/public';
import { TopNavControls, TopNavControlsProps } from './top_nav_controls';
import { TopNavMenu, TopNavMenuProps } from './top_nav_menu';
import { RegisteredTopNavMenuData } from './top_nav_menu_data';

export function createTopNav(
  data: DataPublicPluginStart,
  extraConfig: RegisteredTopNavMenuData[],
  i18n: I18nStart,
  groupActions?: boolean
) {
  return (props: TopNavMenuProps) => {
    const relevantConfig = extraConfig.filter(
      (dataItem) => dataItem.appName === undefined || dataItem.appName === props.appName
    );
    const config = (props.config || []).concat(relevantConfig);

    return (
      <i18n.Context>
        <TopNavMenu {...props} data={data} groupActions={groupActions} config={config} />
      </i18n.Context>
    );
  };
}

export function createTopNavControl(i18n: I18nStart) {
  return (props: TopNavControlsProps) => {
    return (
      <i18n.Context>
        <TopNavControls {...props} />
      </i18n.Context>
    );
  };
}
