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
  SavedObjectAttribute,
  SavedObjectAttributes,
  SavedObjectReference,
} from '../../../../core/public';
import { FeatureAnywhereSavedObject } from '../types';

/**
 * These helper fns are used for constructing and deconstructing references for the feature anywhere
 * saved objs. They references are used when making saved obj API calls, or viewing in the
 * saved objs management page.
 */

/**
 * Given an obj with the saved obj type & ID fields specified, build a reference,
 * and delete those unneeded fields. Add a refname to know which reference it is referring to.
 */
export function extractReferences({
  attributes,
  references = [],
}: {
  attributes: SavedObjectAttributes;
  references: SavedObjectReference[];
}) {
  const updatedAttributes = { ...attributes };
  const updatedReferences = [...references];

  // Extract saved object
  if (updatedAttributes.savedObjectType && updatedAttributes.savedObjectId) {
    updatedReferences.push({
      name: 'saved_object_0',
      type: String(updatedAttributes.savedObjectType),
      id: String(updatedAttributes.savedObjectId),
    });
    delete updatedAttributes.savedObjectId;
    delete updatedAttributes.savedObjectType;
    updatedAttributes.savedObjectName = 'saved_object_0';
  }
  return {
    references: updatedReferences,
    attributes: updatedAttributes,
  };
}

/**
 * Given a returned saved obj from the indexed results, use the stored refname (which is
 * set in extractReferences()) and pull out the other reference info, such as ID
 * Note we may not need to populate the type field here, since the ID is all that's needed
 * due to how we are fetching these saved objs strictly via the visualization itself.
 * But, we will leave for now in case further use cases need the type information. For example,
 * to fetch the full saved obj reference, will need both type & ID for constructing API calls
 * to perform any CRUD operations on such saved objects.
 */
export function injectReferences(
  savedObject: FeatureAnywhereSavedObject,
  references: SavedObjectReference[]
) {
  if (savedObject.savedObjectName) {
    const savedObjectReference = references.find(
      (reference) => reference.name === savedObject.savedObjectName
    );
    if (!savedObjectReference) {
      throw new Error(`Could not find saved object reference "${savedObject.savedObjectName}"`);
    }

    savedObject.savedObjectId = savedObjectReference.id;
    savedObject.savedObjectType = savedObjectReference.type;
    delete savedObject.savedObjectName;
  }
}
