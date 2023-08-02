/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { EuiFlexGroup, EuiFlexItem, EuiTitle } from '@elastic/eui';

const reactFlowStyle = {
  background: '',
};

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export function Workspace() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <EuiFlexItem grow={true}>
      <EuiFlexGroup direction="column" gutterSize="m">
        <EuiFlexItem grow={true} style={{ maxHeight: 50 }}>
          <EuiTitle size="m">
            <h3>Workspace</h3>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem style={{ borderStyle: 'groove', borderColor: 'gray', borderWidth: '1px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          >
            <Controls />
            <Background />
          </ReactFlow>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  );
}
