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

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export function AiAppBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  console.log('testing');
  console.log('nodes: ', nodes);
  return <div>hello world</div>;
  // return (
  //   <ReactFlow
  //     nodes={nodes}
  //     edges={edges}
  //     onNodesChange={onNodesChange}
  //     onEdgesChange={onEdgesChange}
  //     onConnect={onConnect}
  //   >
  //     <MiniMap />
  //     <Controls />
  //     <Background />
  //   </ReactFlow>
  // );
}

//export default Flow;

// export default AiAppBuilder;
