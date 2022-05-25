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
import { createAction, ACTION_CREATE_DETECTOR } from '../../../ui_actions/public';
// import {
//   getApplication,
//   getUISettings,
//   getIndexPatterns,
//   getQueryService,
//   getShareService,
// } from '../services';

export const createDetectorAction = createAction<typeof ACTION_CREATE_DETECTOR>({
  type: ACTION_CREATE_DETECTOR,
  id: ACTION_CREATE_DETECTOR,
  //   shouldAutoExecute: async () => true,
  //   getDisplayName: () =>
  //     i18n.translate('visualize.discover.visualizeFieldLabel', {
  //       defaultMessage: 'Visualize field',
  //     }),
  //   isCompatible: async () => !!getApplication().capabilities.visualize.show,

  // TODO: make the context typesafe
  execute: async (context: { vis: { params: any }; detectorId: string }) => {
    console.log('executing create detector action');
    console.log('context: ', context);
    context.vis.params = {
      ...context.vis.params,
      detectorId: context.detectorId,
      adStateChanged: false,
    };
  },
});
