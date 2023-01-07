/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EuiFlyoutBody, EuiFlyoutHeader, EuiText, EuiFlyout } from '@elastic/eui';
import { getEmbeddable, getQueryService } from '../services';
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

  const PanelComponent = getEmbeddable().getEmbeddablePanel();

  useEffect(() => {
    async function createVisEmbeddable() {
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

        setEmbeddableObj(embeddable);
      } catch (err) {
        console.log(err);
      }
    }
    createVisEmbeddable();
    // TODO: add more if needed
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
          </>
        ) : null}
      </EuiFlyoutBody>
    </EuiFlyout>
  );
}
