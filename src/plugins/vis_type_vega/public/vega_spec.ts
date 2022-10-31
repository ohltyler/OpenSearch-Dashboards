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

import { get, isEmpty } from 'lodash';
import { i18n } from '@osd/i18n';
import {
  ExecutionContext,
  ExpressionFunctionDefinition,
  OpenSearchDashboardsDatatable,
  Render,
} from '../../expressions/public';
import { VegaVisualizationDependencies } from './plugin';
import { AugmentVisFields } from '../../visualizations/public';
import { VegaSpec } from './data_model/types';
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

/**
 * TODO: this fn is using the raw datatable and not taking into account other
 * vis-related config (like a disabled metric/row, setting explicit timerange, etc).
 * In the old vislib workflow, this was handled by (1) creating dimensions in build_pipeline, and
 * (2) converting the tabular data using vis params + dimensions in vis_type_vislib_vis_fn.
 * We will need to do similar transformations either within here, or somewhere else in
 * the render workflow.
 */
const createSpecFromDatatable = (datatable: OpenSearchDashboardsDatatable): object => {
  // TODO: we can try to use VegaSpec type but it is currently very outdated, where many
  // of the fields and sub-fields don't have other optional params that we want for customizing.
  // For now, we make this more loosely-typed by just specifying it as a generic object.
  let spec = {} as any;
  //let spec = {} as VegaSpec;

  // hardcoding logic for now to get it to render
  const timeField = get(datatable, 'columns[0].id', null);
  const valueField = get(datatable, 'columns[1].id', null);
  const timeFieldName = get(datatable, 'columns[0].name', null);
  const valueFieldName = get(datatable, 'columns[1].name', null);

  // TODO: update this to v5 when available
  spec.$schema = 'https://vega.github.io/schema/vega-lite/v4.json';
  spec.data = {
    values: datatable.rows,
  };
  spec.config = {
    view: {
      stroke: null,
    },
  };
  spec.mark = 'line';
  spec.encoding = {
    x: {
      axis: {
        title: timeFieldName,
        grid: false,
      },
      field: timeField,
      type: 'temporal',
    },
    y: {
      axis: {
        title: valueFieldName,
        grid: false,
      },
      field: valueField,
      type: 'quantitative',
    },
  };

  return spec;
};

const augmentSpec = (spec: object): object => {
  let newSpec = spec;

  /**
   * TODO: add logic for adding augment vis fields (alerts/anomalies)
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
    console.log('datatable: ', input);

    // creating initial spec
    let spec = createSpecFromDatatable(input);

    // adding any augment vis fields (e.g., anomalies, alerts) to the spec string
    const augmentVisFields = args.augmentVisFields
      ? (JSON.parse(args.augmentVisFields) as AugmentVisFields)
      : {};
    if (!isEmpty(augmentVisFields)) {
      console.log('augment vis fields found - adding to spec...');
      spec = augmentSpec(spec);
    }

    //console.log('spec as string: ', JSON.stringify(spec));

    return JSON.stringify(spec);
  },
});
