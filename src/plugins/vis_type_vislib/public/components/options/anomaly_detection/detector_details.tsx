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
import { EuiSpacer, EuiText } from '@elastic/eui';

import { ValidationVisOptionsProps } from '../../common';
import { BasicVislibParams } from '../../../types';
import { EmptyDetectorDetails } from './empty_detector_details';
import { isEmpty } from 'lodash';

function DetectorDetails(props: ValidationVisOptionsProps<BasicVislibParams>) {
  const { stateParams, setValue, vis } = props;
  const isDetectorCreated = !isEmpty(stateParams.detectorId);

  return (
    <>
      <EuiSpacer size="m" />
      {isDetectorCreated ? (
        <EuiText size="s">
          <b>Detector ID:</b> {stateParams.detectorId}
        </EuiText>
      ) : (
        <EmptyDetectorDetails />
      )}
    </>
  );
}

export { DetectorDetails };
