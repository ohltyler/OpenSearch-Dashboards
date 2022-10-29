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

import { get } from 'lodash';
import { i18n } from '@osd/i18n';
import {
  ExecutionContext,
  ExpressionFunctionDefinition,
  OpenSearchDashboardsDatatable,
  Render,
} from '../../expressions/public';
import { VegaVisualizationDependencies } from './plugin';
import { AugmentVisFields } from '../../visualizations/public';
// import { createVegaRequestHandler } from './vega_request_handler';
// import { VegaInspectorAdapters } from './vega_inspector/index';
// import { TimeRange, Query } from '../../data/public';
// import { VegaParser } from './data_model/vega_parser';

type Input = OpenSearchDashboardsDatatable;
type Output = Promise<string>;

interface Arguments {
  augmentVisFields: string | null;
}

export type VegaSpecExpressionFunctionDefinition = ExpressionFunctionDefinition<
  'vega_spec',
  Input,
  Arguments,
  Output
  //ExecutionContext<unknown, VegaInspectorAdapters>
>;

const addAugmentVisFields = (spec: string): string => {
  let newSpec = spec;

  /**
   * TODO: add logic for adding augment vis fields (e.g., anomalies)
   * into the spec string
   */

  return newSpec;
};

export const createVegaSpecFn = (
  dependencies: VegaVisualizationDependencies
): VegaSpecExpressionFunctionDefinition => ({
  name: 'vega_spec',
  type: 'string',
  inputTypes: ['opensearch_dashboards_datatable'],
  help: i18n.translate('visTypeVega.function.help', {
    defaultMessage: 'Construct vega spec',
  }),
  args: {
    augmentVisFields: {
      types: ['string', 'null'],
      default: '',
      help: '',
    },
  },
  async fn(input, args, context) {
    let spec = '';

    /**
     * TODO: add conversion from datatable (input) -> string spec (output) here
     * may want to handle this in a separate handler similar to vislib expr fn
     */

    // setting dummy spec for now
    spec = `{
      "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
      "data": {
        "values": [
          {"x": 1, "y": 2},
          {"x": 2, "y": 3},
          {"x": 3, "y": 10},
          {"x": 4, "y": 3},
          {"x": 5, "y": 4},
          {"x": 6, "y": 4},
          {"x": 7, "y": 8},
          {"x": 8, "y": 4},
          {"x": 9, "y": 5},
          {"x": 10, "y": 4}
        ]
      },
      "config": {
        "circle": {"color": "blue", "size": 50},
        "concat": {"spacing": 0},
        "view": {"stroke": null}
      },
      "mark": "line",
      "encoding": {
        "x": {
          "axis": {
            "domain": false,
            "grid": false,
            "ticks": false,
            "labels": false,
            "title": null
          },
          "field": "x",
          "type": "quantitative",
          "scale": {"domain": [0, 10]}
        },
        "y": {"field": "y", "type": "quantitative"}
      }
    }`;

    // adding any augment vis fields (e.g., anomalies, alerts) to the spec string
    const augmentVisFields = args.augmentVisFields
      ? (JSON.parse(args.augmentVisFields) as AugmentVisFields)
      : null;
    if (augmentVisFields) {
      console.log('augment vis fields found - adding to spec...');
      spec = addAugmentVisFields(spec);
    }

    return spec;
  },
});
