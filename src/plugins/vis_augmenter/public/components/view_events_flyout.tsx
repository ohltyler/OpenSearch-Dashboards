/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { EuiFlyoutBody, EuiFlyoutHeader, EuiText, EuiFlyout, EuiTitle } from '@elastic/eui';
import { getEmbeddable, getQueryService } from '../services';
import './styles.scss';
import { VisualizeEmbeddable, VisualizeInput } from '../../../visualizations/public';
import { BaseVisItem } from './base_vis_item';
import { PluginEventsPanel } from './plugin_events_panel';
import { isPointInTimeEventsVisLayer, PointInTimeEventsVisLayer, VisLayer } from '../../common';
import { DateRangeItem } from './date_range_item';
import { LoadingFlyout } from './loading_flyout';

interface Props {
  onClose: () => void;
  savedObjectId: string;
}

export type EventVisEmbeddableItem = {
  visLayer: VisLayer;
  embeddable: VisualizeEmbeddable;
};

export type EventVisEmbeddablesMap = Map<string, EventVisEmbeddableItem[]>;

export function ViewEventsFlyout(props: Props) {
  const [visEmbeddable, setVisEmbeddable] = useState<VisualizeEmbeddable | undefined>(undefined);
  // This map persists a plugin resource type -> a list of vis embeddables
  // for each VisLayer of that type
  const [eventVisEmbeddablesMap, setEventVisEmbeddablesMap] = useState<
    EventVisEmbeddablesMap | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const embeddableVisFactory = getEmbeddable().getEmbeddableFactory('visualization');

  async function fetchVisEmbeddable() {
    try {
      const contextInput = {
        filters: getQueryService().filterManager.getFilters(),
        query: getQueryService().queryString.getQuery(),
        timeRange: getQueryService().timefilter.timefilter.getTime(),
        visLayerResourceIds: ['detector-1-id', 'detector-2-id', 'monitor-1-id'],
      };
      const embeddable = (await embeddableVisFactory?.createFromSavedObject(
        props.savedObjectId,
        contextInput
      )) as VisualizeEmbeddable;
      embeddable.updateInput({
        // @ts-ignore
        refreshConfig: {
          value: 0,
          pause: true,
        },
      });

      // reload is needed so we can fetch the initial VisLayers, and so they're
      // assigned to the vislayers field in the embeddable itself
      embeddable.reload();

      setVisEmbeddable(embeddable);
    } catch (err) {
      console.log(err);
    }
  }

  // For each VisLayer in the base vis embeddable, generate a new filtered vis
  // embeddable to only show datapoints for that particular VisLayer. Partition them by
  // plugin resource type
  async function createEventEmbeddables(visEmbeddable: VisualizeEmbeddable) {
    try {
      let map = new Map<string, EventVisEmbeddableItem[]>() as EventVisEmbeddablesMap;
      // Currently only support PointInTimeEventVisLayers. Different layer types
      // may require different logic in here
      const visLayers = (get(visEmbeddable, 'visLayers', []) as VisLayer[]).filter((visLayer) =>
        isPointInTimeEventsVisLayer(visLayer)
      ) as PointInTimeEventsVisLayer[];
      if (visLayers !== undefined) {
        const contextInput = {
          filters: visEmbeddable.getInput().filters,
          query: visEmbeddable.getInput().query,
          timeRange: visEmbeddable.getInput().timeRange,
        };

        await Promise.all(
          visLayers.map(async (visLayer) => {
            const pluginResourceType = visLayer.pluginResource.type;
            const eventEmbeddable = (await embeddableVisFactory?.createFromSavedObject(
              props.savedObjectId,
              {
                ...contextInput,
                visLayerResourceIds: [visLayer.pluginResource.id as string],
              } as VisualizeInput
            )) as VisualizeEmbeddable;

            eventEmbeddable.updateInput({
              // @ts-ignore
              refreshConfig: {
                value: 0,
                pause: true,
              },
            });

            const curList = (map.get(pluginResourceType) === undefined
              ? []
              : map.get(pluginResourceType)) as EventVisEmbeddableItem[];
            curList.push({
              visLayer,
              embeddable: eventEmbeddable,
            } as EventVisEmbeddableItem);
            map.set(pluginResourceType, curList);
          })
        );
        setEventVisEmbeddablesMap(map);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchVisEmbeddable();
  }, [props.savedObjectId]);

  useEffect(() => {
    if (visEmbeddable?.visLayers) {
      createEventEmbeddables(visEmbeddable);
    }
  }, [visEmbeddable?.visLayers]);

  useEffect(() => {
    if (visEmbeddable !== undefined && eventVisEmbeddablesMap !== undefined) {
      setIsLoading(false);
    }
  }, [visEmbeddable, eventVisEmbeddablesMap]);

  return (
    <EuiFlyout size="l" className="view-events-flyout" onClose={props.onClose}>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="l">
          <h1>{isLoading ? <>&nbsp;</> : `${visEmbeddable.getTitle()}`}</h1>
        </EuiTitle>
      </EuiFlyoutHeader>
      {isLoading ? (
        <LoadingFlyout />
      ) : (
        <EuiFlyoutBody>
          <DateRangeItem embeddable={{ visEmbeddable }} />
          <BaseVisItem embeddable={visEmbeddable} />
          {Array.from(eventVisEmbeddablesMap.keys()).map((key, index) => {
            return (
              <PluginEventsPanel
                key={index}
                pluginTitle={key}
                items={eventVisEmbeddablesMap.get(key) as EventVisEmbeddableItem[]}
              />
            );
          })}
        </EuiFlyoutBody>
      )}
    </EuiFlyout>
  );
}
