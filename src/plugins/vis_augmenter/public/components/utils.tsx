/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { PointInTimeEventsVisLayer } from '../../common';

// Note the return values are arrays with a value of one.
// This is because a vis layer will only contain a single resource ID.
export const getVisualizeInputFromPointInTimeEventsVisLayer = (
  visLayer: PointInTimeEventsVisLayer
): { visLayerResourceIds: string[]; visLayerPlugins: string[] } => {
  return {
    visLayerResourceIds: [visLayer.resourceData.id as string],
    visLayerPlugins: [visLayer.originPlugin as string],
  };
};
