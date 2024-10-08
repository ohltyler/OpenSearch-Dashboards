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

import supertest from 'supertest';
import { UnwrapPromise } from '@osd/utility-types';
import { registerBulkGetRoute } from '../bulk_get';
import { savedObjectsClientMock } from '../../../../../core/server/mocks';
import { setupServer } from '../test_utils';
import { dynamicConfigServiceMock } from '../../../config/dynamic_config_service.mock';

type SetupServerReturn = UnwrapPromise<ReturnType<typeof setupServer>>;

describe('POST /api/saved_objects/_bulk_get', () => {
  let server: SetupServerReturn['server'];
  let httpSetup: SetupServerReturn['httpSetup'];
  let handlerContext: SetupServerReturn['handlerContext'];
  let savedObjectsClient: ReturnType<typeof savedObjectsClientMock.create>;

  beforeEach(async () => {
    ({ server, httpSetup, handlerContext } = await setupServer());
    savedObjectsClient = handlerContext.savedObjects.client;

    savedObjectsClient.bulkGet.mockResolvedValue({
      saved_objects: [],
    });
    const router = httpSetup.createRouter('/api/saved_objects/');
    registerBulkGetRoute(router);

    const dynamicConfigService = dynamicConfigServiceMock.createInternalStartContract();
    await server.start({ dynamicConfigService });
  });

  afterEach(async () => {
    await server.stop();
  });

  it('formats successful response', async () => {
    const clientResponse = {
      saved_objects: [
        {
          id: 'abc123',
          type: 'index-pattern',
          title: 'logstash-*',
          version: 'foo',
          references: [],
          attributes: {},
        },
      ],
    };
    savedObjectsClient.bulkGet.mockImplementation(() => Promise.resolve(clientResponse));

    const result = await supertest(httpSetup.server.listener)
      .post('/api/saved_objects/_bulk_get')
      .send([
        {
          id: 'abc123',
          type: 'index-pattern',
        },
      ])
      .expect(200);

    expect(result.body).toEqual(clientResponse);
  });

  it('calls upon savedObjectClient.bulkGet', async () => {
    const docs = [
      {
        id: 'abc123',
        type: 'index-pattern',
      },
    ];

    await supertest(httpSetup.server.listener)
      .post('/api/saved_objects/_bulk_get')
      .send(docs)
      .expect(200);

    expect(savedObjectsClient.bulkGet).toHaveBeenCalledTimes(1);
    expect(savedObjectsClient.bulkGet).toHaveBeenCalledWith(docs);
  });
});
