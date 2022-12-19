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

/**
 * @name SavedVisIntegration
 *
 * @extends SavedObject.
 *
 * NOTE: It's a type of SavedObject, but specific to vis integration.
 */
import { get } from 'lodash';
import {
  createSavedObjectClass,
  SavedObject,
  SavedObjectOpenSearchDashboardsServices,
} from '../../../saved_objects/public';
import { IIndexPattern } from '../../../data/public';
import { extractReferences, injectReferences } from './saved_vis_integration_references';

export function createSavedVisIntegrationClass(services: SavedObjectOpenSearchDashboardsServices) {
  const SavedObjectClass = createSavedObjectClass(services);

  class SavedVisIntegration extends SavedObjectClass {
    public static type: string = 'vis-integration';
    public static mapping: Record<string, string> = {
      description: 'text',
      pluginResourceId: 'text',
      savedObjectType: 'keyword',
      savedObjectId: 'keyword',
      visLayerExpressionFn: 'object',
      version: 'integer',
    };

    constructor(opts: Record<string, unknown> | string = {}) {
      if (typeof opts !== 'object') {
        opts = { id: opts };
      }
      super({
        type: SavedVisIntegration.type,
        mapping: SavedVisIntegration.mapping,
        extractReferences,
        injectReferences,
        id: (opts.id as string) || '',
        indexPattern: opts.indexPattern as IIndexPattern,
        defaults: {
          description: get(opts, 'description', ''),
          pluginResourceId: get(opts, 'pluginResourceId', ''),
          savedObjectType: get(opts, 'savedObjectType', ''),
          savedObjectId: get(opts, 'savedObjectId', ''),
          visLayerExpressionFn: get(opts, 'visLayerExpressionFn', {}),
          version: 1,
        },
      });
      // probably set to false since this saved obj should be hidden by default
      this.showInRecentlyAccessed = false;

      // we probably don't need this below field. we aren't going to need a full path
      // since we aren't going to allow editing by default
      //   this.getFullPath = () => {
      //     return `/app/visualize#/edit/${this.id}`;
      //   };
    }
  }

  return SavedVisIntegration as new (opts: Record<string, unknown> | string) => SavedObject;
}
