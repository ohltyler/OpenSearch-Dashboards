/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { get, isEmpty } from 'lodash';
import { EuiFlyoutBody, EuiFlyoutHeader, EuiText, EuiFlyout, EuiSpacer } from '@elastic/eui';
import { getEmbeddable, getQueryService, getVisualizations } from '../services';
import {
  EmbeddableInput,
  EmbeddableOutput,
  ErrorEmbeddable,
  IEmbeddable,
} from '../../../embeddable/public';
import './styles.scss';

interface Props {
  onClose: () => void;
  savedObjectId: string;
}

export function ViewEventsFlyout(props: Props) {
  const [embeddableObj, setEmbeddableObj] = useState<
    IEmbeddable<EmbeddableInput, EmbeddableOutput> | ErrorEmbeddable
  >();
  const [eventEmbeddableObjs, setEventEmbeddableObjs] = useState<
    IEmbeddable<EmbeddableInput, EmbeddableOutput>[] | ErrorEmbeddable[]
  >([]);

  const PanelComponent = getEmbeddable().getEmbeddablePanel();

  useEffect(() => {
    async function createEmbeddables() {
      try {
        const getFactory = getEmbeddable().getEmbeddableFactory('visualization');

        // fetching the current context from the data plugin
        const contextInput = {
          filters: getQueryService().filterManager.getFilters(),
          query: getQueryService().queryString.getQuery(),
          timeRange: getQueryService().timefilter.timefilter.getTime(),
        };

        const embeddable = (await getFactory?.createFromSavedObject(
          props.savedObjectId,
          contextInput
        )) as IEmbeddable<EmbeddableInput, EmbeddableOutput> | ErrorEmbeddable;

        // updating the input so we don't auto-refresh
        embeddable.updateInput({
          // @ts-ignore
          refreshConfig: {
            value: 0,
            pause: true,
          },
        });

        // Generating new embeddables on-the-fly for the event annotations.
        const curSpec = get(embeddable, 'vis.params.spec', '');

        // @ts-ignore
        const eventVis = await getVisualizations().createVis('vega', {
          params: {
            spec: curSpec,
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

        setEmbeddableObj(embeddable);

        // TODO: uncomment this to trigger the destroying that happens, due to the reason
        // stated in comment below.
        // setEventEmbeddableObjs([eventEmbeddable]);
      } catch (err) {
        console.log(err);
      }
    }
    if (embeddableObj === undefined || isEmpty(eventEmbeddableObjs)) {
      createEmbeddables();
    }
    // TODO: figure out the right way to update state here. Currently the embeddable is getting destroyed
    // because the component is getting unmounted on re-render of this page when the second
    // state update is happening on the event embeddable list. We may need to split
    // up these 2 objs (embeddableObj and eventEmbeddableObjs) into multiple useEffects to update
    // in a cleaner way.
  }, [props.savedObjectId]);

  return (
    <EuiFlyout className="view-events-flyout" onClose={props.onClose}>
      <EuiFlyoutHeader hasBorder></EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiText>view events flyout</EuiText>
        {embeddableObj ? (
          <>
            <div className="view-events-flyout__vis">
              <PanelComponent embeddable={embeddableObj} hideHeader={true} />
            </div>
            {/* {!isEmpty(eventEmbeddableObjs) ? (
              <>
                <EuiSpacer size="l" />
                <div className="view-events-flyout__vis">
                  <PanelComponent embeddable={eventEmbeddableObjs[0]} hideHeader={true} />
                </div>
              </>
            ) : null} */}
          </>
        ) : null}
      </EuiFlyoutBody>
    </EuiFlyout>
  );
}
