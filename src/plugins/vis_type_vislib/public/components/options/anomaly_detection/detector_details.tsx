/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import React from 'react';
import { EuiSpacer, EuiText, EuiLink } from '@elastic/eui';

import { ValidationVisOptionsProps } from '../../common';
import { BasicVislibParams } from '../../../types';
import { EmptyDetectorDetails } from './empty_detector_details';
import { isEmpty } from 'lodash';
import { getAnomalyDetectorUrl } from './utils';

function DetectorDetails(props: ValidationVisOptionsProps<BasicVislibParams>) {
  const { stateParams, setValue, vis } = props;
  const isDetectorCreated = !isEmpty(stateParams.detectorId);

  return (
    <>
      <EuiSpacer size="m" />
      {isDetectorCreated ? (
        <>
          <EuiText size="s">
            <b>Detector ID:</b> {stateParams.detectorId}
          </EuiText>
          <EuiSpacer size="m" />
          <EuiLink
            data-test-subj="viewSampleDetectorLink"
            href={getAnomalyDetectorUrl(stateParams.detectorId)}
          >
            <EuiText size="s">View in the Anomaly Detection Plugin</EuiText>
          </EuiLink>
        </>
      ) : (
        <EmptyDetectorDetails />
      )}
    </>
  );
}

export { DetectorDetails };
