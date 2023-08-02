/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiDragDropContext,
  EuiDraggable,
  EuiDroppable,
  EuiPanel,
  euiDragDropReorder,
  htmlIdGenerator,
  EuiFlexGroup,
  EuiFlexItem,
  EuiAccordion,
  EuiText,
  EuiSpacer,
  EuiIcon,
  EuiButtonIcon,
  EuiTitle,
} from '@elastic/eui';
import React, { useState } from 'react';
import './styles.scss';

const makeId = htmlIdGenerator();

const makeList = (number, start = 1) =>
  Array.from({ length: number }, (v, k) => k + start).map((el) => {
    const content = el === 1 ? 'Semantic Search' : 'Retrieval Augmented Generation';
    return {
      content,
      id: makeId(),
    };
  });
export function Catalog() {
  const [isItemRemovable, setIsItemRemovable] = useState(false);
  const [list1, setList1] = useState(makeList(2));
  const [list2, setList2] = useState([]);
  const lists = { DROPPABLE_AREA_COPY_1: list1, DROPPABLE_AREA_COPY_2: list2 };
  const actions = {
    DROPPABLE_AREA_COPY_1: setList1,
    DROPPABLE_AREA_COPY_2: setList2,
  };
  const remove = (droppableId, index) => {
    const list = Array.from(lists[droppableId]);
    list.splice(index, 1);

    actions[droppableId](list);
  };
  const onDragUpdate = ({ source, destination }) => {
    const shouldRemove = !destination && source.droppableId === 'DROPPABLE_AREA_COPY_2';
    setIsItemRemovable(shouldRemove);
  };
  const onDragEnd = ({ source, destination }) => {
    if (source && destination) {
      if (source.droppableId === destination.droppableId) {
        const items = euiDragDropReorder(
          lists[destination.droppableId],
          source.index,
          destination.index
        );

        actions[destination.droppableId](items);
      } else {
        const sourceId = source.droppableId;
        const destinationId = destination.droppableId;
        const result = euiDragDropCopy(lists[sourceId], lists[destinationId], source, destination, {
          property: 'id',
          modifier: makeId,
        });

        actions[sourceId](result[sourceId]);
        actions[destinationId](result[destinationId]);
      }
    } else if (!destination && source.droppableId === 'DROPPABLE_AREA_COPY_2') {
      remove(source.droppableId, source.index);
    }
  };

  return (
    <EuiFlexItem grow={true} style={{ maxWidth: 700 }}>
      <EuiFlexGroup direction="column" gutterSize="m">
        <EuiFlexItem grow={true} style={{ maxHeight: 50 }}>
          <EuiTitle size="m">
            <h3>Component catalog</h3>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem style={{ borderStyle: 'groove', borderColor: 'gray', borderWidth: '1px' }}>
          <EuiAccordion
            id="useCasesAccordion"
            paddingSize="l"
            buttonContent="Use Cases"
            className="eui-accordion-custom"
            // style={{
            //   paddingTop: 200,
            // }}
          >
            <EuiDragDropContext
              onDragEnd={onDragEnd}
              onDragUpdate={onDragUpdate}
              className="eui-accordion-custom"
            >
              <EuiFlexGroup>
                <EuiFlexItem style={{ width: '50%' }}>
                  <EuiDroppable
                    droppableId="DROPPABLE_AREA_COPY_1"
                    cloneDraggables={true}
                    spacing="l"
                    grow
                  >
                    {list1.map(({ content, id }, idx) => (
                      <EuiDraggable key={id} index={idx} draggableId={id} spacing="l">
                        <EuiPanel>{content}</EuiPanel>
                      </EuiDraggable>
                    ))}
                  </EuiDroppable>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiDragDropContext>
          </EuiAccordion>
          <EuiSpacer size="m" />
          <EuiAccordion
            id="modelsAccordion"
            paddingSize="l"
            buttonContent="Models"
            style={{ paddingLeft: 20 }}
          >
            <EuiText>test</EuiText>
          </EuiAccordion>
          <EuiSpacer size="m" />
          <EuiAccordion
            id="promptsAccordion"
            paddingSize="l"
            buttonContent="Prompts"
            style={{ paddingLeft: 20 }}
          >
            <EuiText>test</EuiText>
          </EuiAccordion>
          <EuiSpacer size="m" />
          <EuiAccordion
            id="queryAccordion"
            paddingSize="l"
            buttonContent="Query"
            style={{ paddingLeft: 20 }}
          >
            <EuiText>test</EuiText>
          </EuiAccordion>
          <EuiSpacer size="m" />
          <EuiAccordion
            id="ingestAccordion"
            paddingSize="l"
            buttonContent="Ingest"
            style={{ paddingLeft: 20 }}
          >
            <EuiText>test</EuiText>
          </EuiAccordion>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  );
}
