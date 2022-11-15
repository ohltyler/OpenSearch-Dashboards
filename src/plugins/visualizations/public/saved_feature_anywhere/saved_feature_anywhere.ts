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
  SavedObjectLoader,
  SavedObjectOpenSearchDashboardsServices,
} from '../../../saved_objects/public';
import { createSavedFeatureAnywhereClass } from './_saved_feature_anywhere';

// currently visualizations have a 'vis_types' plugin that maintains all of the
// different vis types. in the saved vis loader, those types are then imported here,
// such that if a type returned by the client isn't in the list, the request is
// rejected. essentially just post-processing of the returned obj. We may do something
// same for the feature anywhere augment fn types, since we will have a set list
// of eligible augment fn types for plugins to choose from, when creating their saved objs.
//
// for now, and until it's determined where this code will live (separate plugin, within
// dashboards, etc.), we will not enforce the fn types.
export interface SavedObjectOpenSearchDashboardsServicesWithFeatureAnywhere
  extends SavedObjectOpenSearchDashboardsServices {
  //featureAnywhereTypes: TypesStart;
}
export type SavedFeatureAnywhereLoader = ReturnType<typeof createSavedFeatureAnywhereLoader>;
export function createSavedFeatureAnywhereLoader(
  services: SavedObjectOpenSearchDashboardsServicesWithFeatureAnywhere
) {
  const { savedObjectsClient } = services;

  class SavedObjectLoaderFeatureAnywhere extends SavedObjectLoader {
    // this is where we can do post-processing on the source results and add
    // it to the feature anywhere saved obj. currently just adding ID
    // and saved object type. we may add filtering to validate
    // the augment fn type later - see details listed above
    mapHitSource = (source: Record<string, any>, id: string) => {
      source.id = id;
      source.savedObjectType = 'feature-anywhere';
      return source;
    };
  }
  const SavedFeatureAnywhere = createSavedFeatureAnywhereClass(services);
  return new SavedObjectLoaderFeatureAnywhere(
    SavedFeatureAnywhere,
    savedObjectsClient
  ) as SavedObjectLoader;
}
