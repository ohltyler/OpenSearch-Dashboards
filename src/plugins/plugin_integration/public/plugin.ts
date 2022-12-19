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

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  ApplicationStart,
  SavedObjectsClientContract,
} from '../../../core/public';
import { setSavedVisIntegrationLoader } from './services';
import {
  createSavedVisIntegrationLoader,
  SavedVisIntegrationLoader,
} from './saved_vis_integration';
import { DataPublicPluginSetup, DataPublicPluginStart } from '../../data/public';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PluginIntegrationSetup {}

export interface PluginIntegrationStart {
  savedVisIntegrationLoader: SavedVisIntegrationLoader;
}

export interface PluginIntegrationSetupDeps {
  data: DataPublicPluginSetup;
}

export interface PluginIntegrationStartDeps {
  data: DataPublicPluginStart;
}

export class PluginIntegrationPlugin
  implements
    Plugin<
      PluginIntegrationSetup,
      PluginIntegrationStart,
      PluginIntegrationSetupDeps,
      PluginIntegrationStartDeps
    > {
  constructor(initializerContext: PluginInitializerContext) {}

  public setup(
    core: CoreSetup<PluginIntegrationStartDeps, PluginIntegrationStart>,
    { data }: PluginIntegrationSetupDeps
  ): PluginIntegrationSetup {
    return {};
  }

  public start(core: CoreStart, { data }: PluginIntegrationStartDeps): PluginIntegrationStart {
    const savedVisIntegrationLoader = createSavedVisIntegrationLoader({
      savedObjectsClient: core.savedObjects.client,
      indexPatterns: data.indexPatterns,
      search: data.search,
      chrome: core.chrome,
      overlays: core.overlays,
    });
    setSavedVisIntegrationLoader(savedVisIntegrationLoader);
    return { savedVisIntegrationLoader };
  }

  public stop() {}
}
