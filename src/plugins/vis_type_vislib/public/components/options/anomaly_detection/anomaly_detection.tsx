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
            // additionally, we close the details info so user can re-open to see updated detector info.
            // this is kind of a hack since theres no mechanism for auto-updating the editor state based
            // on expression output, by design. but by making user re-open, we can then pull the latest info
            setValue('adStateChanged', true);
            setValue('showAdDetails', false);
          }}
        />
        {stateParams.enableAnomalyDetection && <DetectorPanel {...props} />}
      </EuiPanel>
    </>
  );
}

export { AnomalyDetectionOptions };
