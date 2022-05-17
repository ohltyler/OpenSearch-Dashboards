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

  console.log('vis: ', vis);
  console.log('vis.params: ', vis.params);
  console.log('state params ID: ', stateParams.detectorId);
  console.log('vis ID: ', vis.params.detectorId);
  console.log('vis.params now: ', vis.params);
  console.log('vis now: ', vis);

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
      {stateParams.detectorId && (
        <>
          {' '}
          <EuiSpacer size="m" />{' '}
          <EuiText size="s">
            <b>Detector ID:</b> {stateParams.detectorId}
          </EuiText>{' '}
        </>
      )}
    </>
  );
}

export { DetectorPanel };
