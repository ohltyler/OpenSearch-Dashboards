/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { get, isEmpty } from 'lodash';
import { VisualizeEmbeddable } from '../../../visualizations/public';
import { EventVisEmbeddablesMap, EventVisEmbeddableItem } from '.';
import { isPointInTimeEventsVisLayer, PointInTimeEventsVisLayer, VisLayer } from '../../common';

export const populateEventVisEmbeddablesMap = (
  map: EventVisEmbeddablesMap,
  visEmbeddable: VisualizeEmbeddable,
  eventVisEmbeddables: VisualizeEmbeddable[]
): void => {
  if (
    eventVisEmbeddables !== undefined &&
    visEmbeddable !== undefined &&
    visEmbeddable.visLayers !== undefined
  ) {
    // Currently only support PointInTimeEventVisLayers. Different layer types
    // may require different logic here
    const visLayers = (visEmbeddable.visLayers as VisLayer[]).filter((visLayer) =>
      isPointInTimeEventsVisLayer(visLayer)
    ) as PointInTimeEventsVisLayer[];
    const originPlugins = [
      ...new Set(visLayers.map((visLayer) => visLayer.originPlugin)),
    ] as string[];
    originPlugins.forEach((originPlugin) => {
      map.set(originPlugin, [] as EventVisEmbeddableItem[]);
    });
    eventVisEmbeddables.forEach((eventVisEmbeddable) => {
      const { originPlugin, pluginResourceId } = getVisLayerInputFromEventVisEmbeddable(
        eventVisEmbeddable
      );
      const curList = map.get(originPlugin);
      if (curList !== undefined) {
        curList.push({
          pluginResourceId,
          embeddable: eventVisEmbeddable,
        } as EventVisEmbeddableItem);
      }
    });
  }
};

export const getVisualizeInputFromPointInTimeEventsVisLayer = (
  visLayer: PointInTimeEventsVisLayer
): { visLayerResourceIds: string[]; visLayerPlugins: string[] } => {
  return {
    visLayerResourceIds: [visLayer.events[0].metadata.resourceId as string],
    visLayerPlugins: [visLayer.originPlugin as string],
  };
};

// Currently the event vis embeddables are always going to be created with a single vis layer / single plugin resource.
// So, we can select the first (and only) item in the input arrays
const getVisLayerInputFromEventVisEmbeddable = (
  eventVisEmbeddable: VisualizeEmbeddable
): { originPlugin: string; pluginResourceId: string } => {
  const resourceIds = get(eventVisEmbeddable.getInput(), 'visLayerResourceIds', [] as string[]);
  const plugins = get(eventVisEmbeddable.getInput(), 'visLayerPlugins', [] as string[]);
  return {
    originPlugin: plugins[0],
    pluginResourceId: resourceIds[0],
  };
};
