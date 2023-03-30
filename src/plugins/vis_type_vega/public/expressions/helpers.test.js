/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  buildLayerMark,
  buildXAxis,
  buildYAxis,
  cleanString,
  createSpecFromDatatable,
  formatDatatable,
  setupConfig,
} from './helpers';
import {
  complexDatatable,
  complexVisParams,
  complexDimensions,
  simpleDatatable,
  simpleVisParams,
  simpleDimensions,
  noXAxisDimensions,
} from './__mocks__';

describe('helpers', function () {
  describe('cleanString()', function () {
    it('string should not contain "', function () {
      const dirtyString = '"someString"';
      expect(cleanString(dirtyString)).toBe('someString');
    });
  });

  describe('setupConfig()', function () {
    it('check all legend positions', function () {
      const baseConfig = {
        view: {
          stroke: null,
        },
        concat: {
          spacing: 0,
        },
        legend: {
          orient: null,
        },
        kibana: {
          hideWarnings: true,
        },
      };
      const positions = ['top', 'right', 'left', 'bottom'];
      positions.forEach((position) => {
        const visParams = { legendPosition: position };
        baseConfig.legend.orient = position;
        expect(setupConfig(visParams)).toStrictEqual(baseConfig);
      });
    });
  });

  describe('buildLayerMark()', function () {
    const types = ['line', 'area', 'histogram'];
    const interpolates = ['linear', 'cardinal', 'step-after'];
    const strokeWidths = [-1, 0, 1, 2, 3, 4];
    const showCircles = [false, true];

    it('check each mark possible value', function () {
      const mark = {
        type: null,
        interpolate: null,
        strokeWidth: null,
        point: null,
      };
      types.forEach((type) => {
        mark.type = type;
        interpolates.forEach((interpolate) => {
          mark.interpolate = interpolate;
          strokeWidths.forEach((strokeWidth) => {
            mark.strokeWidth = strokeWidth;
            showCircles.forEach((showCircle) => {
              mark.point = showCircle;
              const param = {
                type: type,
                interpolate: interpolate,
                lineWidth: strokeWidth,
                showCircles: showCircle,
              };
              expect(buildLayerMark(param)).toStrictEqual(mark);
            });
          });
        });
      });
    });
  });

  describe('buildXAxis()', function () {
    it('build different XAxis', function () {
      const xAxisTitle = 'someTitle';
      const xAxisId = 'someId';
      [true, false].forEach((enableGrid) => {
        const visParams = { grid: { categoryLines: enableGrid } };
        const vegaXAxis = {
          axis: {
            title: xAxisTitle,
            grid: enableGrid,
          },
          field: xAxisId,
          type: 'temporal',
        };
        expect(buildXAxis(xAxisTitle, xAxisId, visParams)).toStrictEqual(vegaXAxis);
      });
    });
  });

  describe('buildYAxis()', function () {
    it('build different YAxis', function () {
      const valueAxis = {
        id: 'someId',
        labels: {
          rotate: 75,
          show: false,
        },
        position: 'left',
        title: {
          text: 'someText',
        },
      };
      const column = { name: 'columnName', id: 'columnId' };
      const visParams = { grid: { valueAxis: true } };
      const vegaYAxis = {
        axis: {
          title: 'someText',
          grid: true,
          orient: 'left',
          labels: false,
          labelAngle: 75,
        },
        field: 'columnId',
        type: 'quantitative',
      };
      expect(buildYAxis(column, valueAxis, visParams)).toStrictEqual(vegaYAxis);

      valueAxis.title.text = '""';
      vegaYAxis.axis.title = 'columnName';
      expect(buildYAxis(column, valueAxis, visParams)).toStrictEqual(vegaYAxis);
    });
  });

  describe('createSpecFromDatatable()', function () {
    it('build simple line chart"', function () {
      expect(
        JSON.stringify(
          createSpecFromDatatable(
            formatDatatable(JSON.parse(simpleDatatable)),
            JSON.parse(simpleVisParams),
            JSON.parse(simpleDimensions)
          )
        )
      ).toMatchSnapshot();
    });

    it('build empty chart if no x-axis is defined"', function () {
      expect(
        JSON.stringify(
          createSpecFromDatatable(
            formatDatatable(JSON.parse(simpleDatatable)),
            JSON.parse(simpleVisParams),
            JSON.parse(noXAxisDimensions)
          )
        )
      ).toMatchSnapshot();
    });

    it('build complicated line chart"', function () {
      expect(
        JSON.stringify(
          createSpecFromDatatable(
            formatDatatable(JSON.parse(complexDatatable)),
            JSON.parse(complexVisParams),
            JSON.parse(complexDimensions)
          )
        )
      ).toMatchSnapshot();
    });
  });
});
