/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EuiFlyoutBody, EuiFlyoutHeader, EuiText, EuiFlyout, EuiSpacer } from '@elastic/eui';
import { getEmbeddable, getQueryService, getVisualizations } from '../services';
import {
  EmbeddableInput,
  EmbeddableOutput,
  ErrorEmbeddable,
  IEmbeddable,
} from '../../../embeddable/public';
import './styles.scss';
import { DisabledLabEmbeddable, VisualizeEmbeddable } from '../../../visualizations/public';
import { getSpecFromVisLayers } from '../actions/utils';
import { BaseVisItem } from './base_vis_item';
import { PluginEventsPanel } from './plugin_events_panel';

interface Props {
  onClose: () => void;
  savedObjectId: string;
}

export function ViewEventsFlyout(props: Props) {
  const [embeddableObj, setEmbeddableObj] = useState<
    IEmbeddable<EmbeddableInput, EmbeddableOutput> | ErrorEmbeddable | undefined
  >(undefined);
  const [eventEmbeddableObjs, setEventEmbeddableObjs] = useState<
    IEmbeddable<EmbeddableInput, EmbeddableOutput>[] | ErrorEmbeddable[] | undefined
  >(undefined);

  async function fetchVisEmbeddable() {
    try {
      const getFactory = getEmbeddable().getEmbeddableFactory('visualization');

      const contextInput = {
        filters: getQueryService().filterManager.getFilters(),
        query: getQueryService().queryString.getQuery(),
        timeRange: getQueryService().timefilter.timefilter.getTime(),
      };
      const embeddable = (await getFactory?.createFromSavedObject(
        props.savedObjectId,
        contextInput
      )) as IEmbeddable<EmbeddableInput, EmbeddableOutput> | ErrorEmbeddable;
      embeddable.updateInput({
        // @ts-ignore
        refreshConfig: {
          value: 0,
          pause: true,
        },
      });

      setEmbeddableObj(embeddable);
    } catch (err) {
      console.log(err);
    }
  }

  async function createEventEmbeddables() {
    try {
      const contextInput = {
        filters: getQueryService().filterManager.getFilters(),
        query: getQueryService().queryString.getQuery(),
        timeRange: getQueryService().timefilter.timefilter.getTime(),
      };

      // Generating new embeddables on-the-fly for the event annotations.
      const eventEmbeddables = [] as Array<
        VisualizeEmbeddable | ErrorEmbeddable | DisabledLabEmbeddable
      >;

      // @ts-ignore
      const eventVis = await getVisualizations().createVis('vega', {
        params: {
          spec: getSpecFromVisLayers([]),
        },
        title: 'test-annotation-event-vis',
        data: {
          aggs: [],
          searchSource: {},
        },
      });
      const eventEmbeddable = await getVisualizations()['__LEGACY'].createVisEmbeddableFromObject(
        eventVis,
        {
          id: 'test-annotation-event-embeddable',
          ...contextInput,
        }
      );
      eventEmbeddable.updateInput({
        // @ts-ignore
        refreshConfig: {
          value: 0,
          pause: true,
        },
      });

      // TODO: remove the double push. just testing so i can get test
      // rendering multiple visualizations
      eventEmbeddables.push(eventEmbeddable);
      eventEmbeddables.push(eventEmbeddable);
      setEventEmbeddableObjs(eventEmbeddables);
    } catch (err) {
      console.log(err);
    }
  }

  // TODO: remove dummy values
  const dummyPluginResourceIds = ['some-plugin-resource-id', 'another-plugin-resource-id'];
  const dummyPluginTitle = 'some-plugin';

  useEffect(() => {
    fetchVisEmbeddable();
    createEventEmbeddables();
  }, [props.savedObjectId]);

  return (
    <EuiFlyout className="view-events-flyout" onClose={props.onClose}>
      <EuiFlyoutHeader hasBorder></EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiText>view events flyout</EuiText>
        {embeddableObj !== undefined && eventEmbeddableObjs !== undefined ? (
          <>
            <BaseVisItem embeddable={embeddableObj} />
            <PluginEventsPanel
              pluginTitle={dummyPluginTitle}
              embeddables={eventEmbeddableObjs}
              pluginResourceIds={dummyPluginResourceIds}
            />
          </>
        ) : null}
      </EuiFlyoutBody>
    </EuiFlyout>
  );
}
