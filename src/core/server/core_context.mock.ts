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

import { REPO_ROOT } from '@osd/dev-utils';
import { CoreContext } from './core_context';
import { Env, IConfigService } from './config';
import { configServiceMock, getEnvOptions } from './config/mocks';
import { loggingSystemMock } from './logging/logging_system.mock';
import { ILoggingSystem } from './logging';
import { dynamicConfigServiceMock } from './config/dynamic_config_service.mock';
import { IDynamicConfigService } from './config/dynamic_config_service';

function create({
  env = Env.createDefault(REPO_ROOT, getEnvOptions()),
  logger = loggingSystemMock.create(),
  configService = configServiceMock.create(),
  dynamicConfigService = dynamicConfigServiceMock.create(),
}: {
  env?: Env;
  logger?: jest.Mocked<ILoggingSystem>;
  configService?: jest.Mocked<IConfigService>;
  dynamicConfigService?: jest.Mocked<IDynamicConfigService>;
} = {}): DeeplyMockedKeys<CoreContext> {
  return { coreId: Symbol(), env, logger, configService, dynamicConfigService };
}

export const mockCoreContext = {
  create,
};
