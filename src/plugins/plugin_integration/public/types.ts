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

import { ExpressionFunctionDefinition } from 'src/plugins/expressions';
import { SavedObject } from '../../saved_objects/public';

/**
 * Vis layering data models
 */
export interface VisLayer {
  // will be used as the column ID
  id: string;
  // will be used as the name when hovering over the tooltip
  name: string;
}

export type VisLayers = VisLayer[];

export interface PointInTimeEventMetadata {
  resourceId: string;
  resourceName: string;
  tooltip?: string;
}

export interface PointInTimeEvent {
  timestamp: number;
  metadata: PointInTimeEventMetadata;
}

export interface PointInTimeEventsVisLayer extends VisLayer {
  events: PointInTimeEvent[];
}

// used to determine what vis layer's interface is being implemented.
// currently PointInTimeEventsLayer is the only interface extending VisLayer
export const isPointInTimeEventsVisLayer = (obj: any) => {
  return 'events' in obj;
};

/**
 * Saved object data models
 */
export interface ISavedVisIntegration {
  id?: string;
  description?: string;
  pluginResourceId: string;
  savedObjectName?: string;
  savedObjectType?: string;
  savedObjectId?: string;
  visLayerExpressionFn: VisLayerExpressionFn;
  version?: number;
}

// TODO: possibly rename to VisLayerExpressionFn?
export interface VisLayerExpressionFn {
  // string may be ok - need to confirm
  // type: VisLayer;
  type: string;
  name: string;
  // plugin expression fns can freely set custom arguments
  args: { [key: string]: any };
}

export interface VisIntegrationSavedObject extends SavedObject, ISavedVisIntegration {}

export interface SerializedVisIntegration {
  id?: string;
  description?: string;
  pluginResourceId: string;
  savedObjectName?: string;
  savedObjectType?: string;
  savedObjectId?: string;
  visLayerExpressionFn: string;
  version?: number;
}

/**
 * Expression fn data models
 */
// the I/O of the expression fns (used in below fn definition)
export interface VisIntegrationResponseValue {
  visLayers: object;
}

export type VisIntegrationFunctionDefinition = ExpressionFunctionDefinition<
  string,
  VisIntegrationResponseValue,
  any,
  Promise<VisIntegrationResponseValue>
>;
