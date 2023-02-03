/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import moment from 'moment';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiSuperDatePicker,
  EuiText,
  EuiIcon,
  EuiFieldText,
  prettyDuration,
  EuiButton,
} from '@elastic/eui';
import './styles.scss';
import { TimeRange } from '../../../data/common';
import { DATE_RANGE_FORMAT } from './view_events_flyout';

interface Props {
  timeRange: TimeRange;
  lastUpdatedTime: string;
  refreshFn: (time: string) => void;
}

export function DateRangeItem(props: Props) {
  const durationText = prettyDuration(
    props.timeRange.from,
    props.timeRange.to,
    [],
    DATE_RANGE_FORMAT
  );

  return (
    <EuiFlexGroup
      direction="row"
      gutterSize="m"
      alignItems="center"
      className="view-events-flyout__dateRangeHeader"
    >
      <EuiFlexItem grow={false}>
        <EuiIcon type="calendar" />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiText>{durationText}</EuiText>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton
          isDisabled={false}
          onClick={() => {
            props.refreshFn(moment(Date.now()).format(DATE_RANGE_FORMAT));
          }}
        >
          Refresh
        </EuiButton>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiText size="s" color="subdued" style={{ whiteSpace: 'pre-line' }}>
          {`This view is not updated to load the latest events automatically.
         Last updated: ${props.lastUpdatedTime}`}
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
