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
import { i18n } from '@osd/i18n';

import { ValidationVisOptionsProps } from '../../common';
import { SwitchOption } from '../../../../../charts/public';
import { BasicVislibParams } from '../../../types';

function DetectorPanel(props: ValidationVisOptionsProps<BasicVislibParams>) {
  const { stateParams, setValue, vis } = props;

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
      {stateParams.detectorId && <EuiText>`Detector ID: ${stateParams.detectorId}`</EuiText>}
    </>
  );
}

export { DetectorPanel };
