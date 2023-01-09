/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoreStart } from 'opensearch-dashboards/public';
import { UiActionsStart } from '../../ui_actions/public';
import { OpenEventsFlyoutAction, OPEN_EVENTS_FLYOUT_ACTION } from './actions';
import { AugmentVisContext, openEventsFlyoutTrigger, OPEN_EVENTS_FLYOUT_TRIGGER } from './triggers';

// Overridding the mappings defined in UIActions plugin so that
// the new trigger and action definitions resolve
declare module '../../ui_actions/public' {
  export interface TriggerContextMapping {
    [OPEN_EVENTS_FLYOUT_TRIGGER]: AugmentVisContext;
  }

  export interface ActionContextMapping {
    [OPEN_EVENTS_FLYOUT_ACTION]: AugmentVisContext;
  }
}

/**
 * These fns initialize VisAugmenter plugin with initial set of
 * triggers and actions, and mapping any triggers -> actions
 */

export const registerTriggersAndActions = (uiActions: UiActionsStart, core: CoreStart) => {
  const openEventsFlyoutAction = new OpenEventsFlyoutAction(core);
  uiActions.registerAction(openEventsFlyoutAction);
  uiActions.registerTrigger(openEventsFlyoutTrigger);
  uiActions.addTriggerAction(OPEN_EVENTS_FLYOUT_TRIGGER, openEventsFlyoutAction);
};
