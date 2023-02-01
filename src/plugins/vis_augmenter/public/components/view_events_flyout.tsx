/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { EuiFlyoutBody, EuiFlyoutHeader, EuiText, EuiFlyout } from '@elastic/eui';
import { getEmbeddable, getQueryService } from '../services';
import './styles.scss';
import { VisualizeEmbeddable } from '../../../visualizations/public';
import { BaseVisItem } from './base_vis_item';
import { PluginEventsPanel } from './plugin_events_panel';
import {
  getVisualizeInputFromPointInTimeEventsVisLayer,
  populateEventVisEmbeddablesMap,
} from './utils';
import { isPointInTimeEventsVisLayer, PointInTimeEventsVisLayer, VisLayer } from '../../common';

interface Props {
  onClose: () => void;
  savedObjectId: string;
}

export type EventVisEmbeddableItem = {
  pluginResourceId: string;
  embeddable: VisualizeEmbeddable;
};

export type EventVisEmbeddablesMap = Map<string, EventVisEmbeddableItem[]>;

export function ViewEventsFlyout(props: Props) {
  const [visEmbeddable, setVisEmbeddable] = useState<VisualizeEmbeddable | undefined>(undefined);
  const [eventVisEmbeddables, setEventVisEmbeddables] = useState<VisualizeEmbeddable[] | undefined>(
    undefined
  );

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
  // embeddable to only show datapoints for that particular VisLayer
  async function createEventEmbeddables(visEmbeddable: VisualizeEmbeddable) {
    try {
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

        let eventEmbeddables = [] as Array<VisualizeEmbeddable>;
        await Promise.all(
          visLayers.map(async (visLayer) => {
            const eventEmbeddable = (await embeddableVisFactory?.createFromSavedObject(
              props.savedObjectId,
              {
                ...contextInput,
                ...getVisualizeInputFromPointInTimeEventsVisLayer(visLayer),
              }
            )) as VisualizeEmbeddable;

            eventEmbeddable.updateInput({
              // @ts-ignore
              refreshConfig: {
                value: 0,
                pause: true,
              },
            });

            eventEmbeddables.push(eventEmbeddable);
          })
        );
        setEventVisEmbeddables(eventEmbeddables);
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

  // partition the event vis embeddables by plugin by populating a map mapping a
  // plugin -> list of associated event vis embeddables
  let eventVisEmbeddablesMap = new Map<
    string,
    EventVisEmbeddableItem[]
  >() as EventVisEmbeddablesMap;
  if (
    eventVisEmbeddables !== undefined &&
    visEmbeddable !== undefined &&
    visEmbeddable.visLayers !== undefined
  ) {
    populateEventVisEmbeddablesMap(eventVisEmbeddablesMap, visEmbeddable, eventVisEmbeddables);
  }

  return (
    <EuiFlyout className="view-events-flyout" onClose={props.onClose}>
      <EuiFlyoutHeader hasBorder></EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiText>view events flyout</EuiText>
        {visEmbeddable !== undefined && eventVisEmbeddables !== undefined ? (
          <>
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
          </>
        ) : null}
      </EuiFlyoutBody>
    </EuiFlyout>
  );
}
