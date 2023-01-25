/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmbeddableStart } from '../../embeddable/public';
import { createGetterSetter } from '../../opensearch_dashboards_utils/public';
import { UiActionsStart } from '../../ui_actions/public';
import { DataPublicPluginStart } from '../../../plugins/data/public';

export const [getUiActions, setUiActions] = createGetterSetter<UiActionsStart>('UIActions');

export const [getEmbeddable, setEmbeddable] = createGetterSetter<EmbeddableStart>('embeddable');

export const [getQueryService, setQueryService] = createGetterSetter<
  DataPublicPluginStart['query']
>('Query');
