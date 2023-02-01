/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { get, isEmpty } from 'lodash';
import { VisualizeEmbeddable } from '../../../visualizations/public';
import { EventVisEmbeddablesMap, EventVisEmbeddableItem } from '.';

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
    const plugins = [
      ...new Set(visEmbeddable.visLayers.map((visLayer) => visLayer.plugin)),
    ] as string[];
    plugins.forEach((plugin) => {
      map.set(plugin, [] as EventVisEmbeddableItem[]);
    });
    eventVisEmbeddables.forEach((eventVisEmbeddable) => {
      const resourceIds = get(eventVisEmbeddable.getInput(), 'visLayerResourceIds', [] as string[]);
      const plugins = get(eventVisEmbeddable.getInput(), 'visLayerPlugins', [] as string[]);
      if (!isEmpty(resourceIds) && !isEmpty(plugins)) {
        // TODO: clean up how these are getting fetched. currently hacky to fetch first index
        // @ts-ignore
        map
          .get(plugins[0])
          .push({
            pluginResourceId: resourceIds[0],
            embeddable: eventVisEmbeddable,
          } as EventVisEmbeddableItem);
      }
    });
  }
};

// TODO: make typesafe after rebasing
export const getVisualizeInputFromVisLayer = (
  visLayer: any
): { visLayerResourceIds: string[]; visLayerPlugins: string[] } => {
  return {
    visLayerResourceIds: [visLayer.events[0].metadata.resourceId as string],
    visLayerPlugins: [visLayer.plugin as string],
  };
};
