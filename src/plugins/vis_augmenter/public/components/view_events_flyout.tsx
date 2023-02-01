/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { get, isEmpty } from 'lodash';
import { EuiFlyoutBody, EuiFlyoutHeader, EuiText, EuiFlyout, EuiSpacer } from '@elastic/eui';
import { getEmbeddable, getQueryService } from '../services';
import './styles.scss';
import { VisualizeEmbeddable, VisualizeInput } from '../../../visualizations/public';
import { BaseVisItem } from './base_vis_item';
import { PluginEventsPanel } from './plugin_events_panel';

interface Props {
  onClose: () => void;
  savedObjectId: string;
}

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

      embeddable.reload();

      setVisEmbeddable(embeddable);
    } catch (err) {
      console.log(err);
    }
  }

  async function createEventEmbeddables(visEmbeddable: VisualizeEmbeddable) {
    try {
      if (visEmbeddable.visLayers !== undefined) {
        const contextInput = {
          filters: visEmbeddable.getInput().filters,
          query: visEmbeddable.getInput().query,
          timeRange: visEmbeddable.getInput().timeRange,
        };

        let eventEmbeddables = [] as Array<VisualizeEmbeddable>;

        await Promise.all(
          visEmbeddable.visLayers.map(async (visLayer) => {
            const input = {
              ...contextInput,
              visLayerResourceIds: [visLayer.events[0].metadata.resourceId as string],
              visLayerPlugins: [visLayer.plugin as string],
            } as VisualizeInput;

            const eventEmbeddable = (await embeddableVisFactory?.createFromSavedObject(
              props.savedObjectId,
              input
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

  // partition the event embeddables by plugin
  // TODO: refactor this
  let eventVisEmbeddablesMap = new Map<
    string,
    { pluginResourceId: string; embeddable: VisualizeEmbeddable }[]
  >();
  if (
    eventVisEmbeddables !== undefined &&
    visEmbeddable !== undefined &&
    visEmbeddable.visLayers !== undefined
  ) {
    const plugins = [
      ...new Set(visEmbeddable.visLayers.map((visLayer) => visLayer.plugin)),
    ] as string[];
    plugins.forEach((plugin) => {
      eventVisEmbeddablesMap.set(
        plugin,
        [] as { pluginResourceId: string; embeddable: VisualizeEmbeddable }[]
      );
    });
    eventVisEmbeddables.forEach((eventVisEmbeddable) => {
      const resourceIds = get(eventVisEmbeddable.getInput(), 'visLayerResourceIds', [] as string[]);
      const plugins = get(eventVisEmbeddable.getInput(), 'visLayerPlugins', [] as string[]);
      if (!isEmpty(resourceIds) && !isEmpty(plugins)) {
        // TODO: clean up how these are getting fetched. currently hacky to fetch first index
        // @ts-ignore
        eventVisEmbeddablesMap
          .get(plugins[0])
          .push({ pluginResourceId: resourceIds[0], embeddable: eventVisEmbeddable });
      }
    });
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
                  // @ts-ignore
                  embeddables={eventVisEmbeddablesMap.get(key)}
                />
              );
            })}
          </>
        ) : null}
      </EuiFlyoutBody>
    </EuiFlyout>
  );
}
