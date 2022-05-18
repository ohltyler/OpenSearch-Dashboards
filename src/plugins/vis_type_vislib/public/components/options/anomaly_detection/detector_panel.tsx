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
import { EuiSpacer } from '@elastic/eui';
import { i18n } from '@osd/i18n';

import { ValidationVisOptionsProps } from '../../common';
import { SwitchOption } from '../../../../../charts/public';
import { BasicVislibParams } from '../../../types';
import { DetectorDetails } from './detector_details';

function DetectorPanel(props: ValidationVisOptionsProps<BasicVislibParams>) {
  const { stateParams, setValue, vis } = props;

  console.log('state params ID: ', stateParams.detectorId);
  console.log('vis ID: ', vis.params.detectorId);

  if (stateParams.detectorId !== vis.params.detectorId) {
    console.log('setting detector id to ' + vis.params.detectorId);
    setValue('detectorId', vis.params.detectorId);
  }

  return (
    <>
      <EuiSpacer size="m" />
      <SwitchOption
        data-test-subj="showAnomalies"
        label={i18n.translate('visTypeVislib.editors.anomalyDetection.showAnomalies', {
          defaultMessage: 'Show anomalies in chart',
        })}
        paramName="showAnomalies"
        value={stateParams.showAnomalies}
        setValue={(paramName, value) => setValue(paramName, value)}
      />
      <EuiSpacer size="m" />
      <SwitchOption
        data-test-subj="showAdDetails"
        label={i18n.translate('visTypeVislib.editors.anomalyDetection.showAdDetails', {
          defaultMessage: 'Show anomaly detector details',
        })}
        paramName="showAdDetails"
        value={stateParams.showAdDetails}
        setValue={(paramName, value) => setValue(paramName, value)}
      />
      {stateParams.showAdDetails && <DetectorDetails {...props} />}
    </>
  );
}

export { DetectorPanel };
