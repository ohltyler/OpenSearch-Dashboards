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
import { EuiPanel, EuiTitle, EuiSpacer, EuiButton } from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { FormattedMessage } from '@osd/i18n/react';

import { ValidationVisOptionsProps } from '../../common';
import { SwitchOption } from '../../../../../charts/public';
import { BasicVislibParams } from '../../../types';
import { DetectorPanel } from './detector_panel';

function AnomalyDetectionOptions(props: ValidationVisOptionsProps<BasicVislibParams>) {
  const { stateParams, setValue, vis } = props;

  //setValue('adStateChanged', false);
  return (
    <>
      <EuiPanel paddingSize="s">
        <EuiTitle size="xs">
          <h3>
            <FormattedMessage
              id="visTypeVislib.editors.anomalyDetection.detectorTitle"
              defaultMessage="Settings"
            />
          </h3>
        </EuiTitle>
        <EuiSpacer size="m" />
        <SwitchOption
          data-test-subj="enableAnomalyDetection"
          label={i18n.translate('visTypeVislib.editors.anomalyDetection.enable', {
            defaultMessage: 'Enable anomaly detection',
          })}
          paramName="enableAnomalyDetection"
          value={stateParams.enableAnomalyDetection}
          setValue={(paramName, value) => {
            setValue(paramName, value);
            // this will make sure that after the expression fn is ran, we reload the editor to pull
            // latest changes (showing/removing detector ID if creating/deleting detector, respectively)
            console.log('setting value back to true');
            setValue('adStateChanged', true);
          }}
        />
        {stateParams.enableAnomalyDetection && <DetectorPanel {...props} />}
      </EuiPanel>
    </>
  );
}

export { AnomalyDetectionOptions };
