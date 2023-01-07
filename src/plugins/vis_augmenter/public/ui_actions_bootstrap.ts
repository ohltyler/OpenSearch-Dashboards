/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoreStart } from 'opensearch-dashboards/public';
import { OpenEventsFlyoutAction, OPEN_EVENTS_FLYOUT_ACTION } from './actions';
import { AugmentVisContext, openEventsFlyoutTrigger } from './triggers';
import { OPEN_EVENTS_FLYOUT_TRIGGER } from '../../ui_actions/public';
import { getUiActions } from './services';

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

export const registerTriggersAndActions = (core: CoreStart) => {
  const openEventsFlyoutAction = new OpenEventsFlyoutAction(core);
  getUiActions().registerAction(openEventsFlyoutAction);
  getUiActions().registerTrigger(openEventsFlyoutTrigger);
  getUiActions().addTriggerAction(OPEN_EVENTS_FLYOUT_TRIGGER, openEventsFlyoutAction);
};
