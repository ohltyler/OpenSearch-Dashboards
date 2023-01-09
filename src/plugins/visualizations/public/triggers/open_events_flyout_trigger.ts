/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import { Trigger } from '../../../ui_actions/public';
import { ExprVis } from '../expressions/vis';

export const OPEN_EVENTS_FLYOUT_TRIGGER = 'OPEN_EVENTS_FLYOUT_TRIGGER';
export interface AugmentVisContext {
  vis: ExprVis;
}

export const openEventsFlyoutTrigger: Trigger<'OPEN_EVENTS_FLYOUT_TRIGGER'> = {
  id: OPEN_EVENTS_FLYOUT_TRIGGER,
  title: i18n.translate('uiActions.triggers.openEventsFlyoutTrigger', {
    defaultMessage: 'Open the View Events flyout',
  }),
  description: i18n.translate('uiActions.triggers.openEventsFlyoutDescription', {
    defaultMessage: `Opening the 'View Events' flyout`,
  }),
};
