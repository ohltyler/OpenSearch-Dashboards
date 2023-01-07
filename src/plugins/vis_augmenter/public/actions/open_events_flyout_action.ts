/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import { CoreStart } from 'opensearch-dashboards/public';
import {
  Action,
  ActionExecutionContext,
  IncompatibleActionError,
} from '../../../ui_actions/public';
import { AugmentVisContext } from '../triggers';
import { openViewEventsFlyout } from './open_events_flyout';

export const OPEN_EVENTS_FLYOUT_ACTION = 'OPEN_EVENTS_FLYOUT_ACTION';

export class OpenEventsFlyoutAction implements Action<AugmentVisContext> {
  public readonly type = OPEN_EVENTS_FLYOUT_ACTION;
  public readonly id = OPEN_EVENTS_FLYOUT_ACTION;
  public order = 1;

  constructor(private core: CoreStart) {}

  public getIconType(context: ActionExecutionContext<AugmentVisContext>) {
    return undefined;
  }

  public getDisplayName() {
    return i18n.translate('visAugmenter.displayName', {
      defaultMessage: 'Open View Events flyout',
    });
  }

  public async isCompatible({ savedObjectId }: AugmentVisContext) {
    return true;
  }

  public async execute({ savedObjectId }: AugmentVisContext) {
    if (!(await this.isCompatible({ savedObjectId }))) {
      throw new IncompatibleActionError();
    }
    openViewEventsFlyout({
      core: this.core,
      savedObjectId,
    });
  }
}
