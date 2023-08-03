/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, { Controls, Background, useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import './dnd-styles.scss';
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiTitle } from '@elastic/eui';
import { DEFAULT_COLOR, EMBEDDINGS_COLOR, MODEL_COLOR, PROMPT_COLOR } from '../constants';

const initialNodes = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { label: '"What is the best DB for vector search?" (input)' },
    type: 'default',
    style: {
      background: DEFAULT_COLOR,
    },
  },
  {
    id: '2',
    position: { x: 100, y: 200 },
    data: { label: 'OpenAI Embedding Model (encode input to vector)' },
    type: 'embeddings',
    style: {
      background: EMBEDDINGS_COLOR,
    },
  },
  {
    id: '3',
    position: { x: 200, y: 300 },
    data: { label: 'kNN plugin (similarity search with vector)' },
    type: 'default',
    style: {
      background: DEFAULT_COLOR,
    },
  },
  {
    id: '4',
    position: { x: 300, y: 400 },
    data: { label: 'GPT-4 (generate output from ranked results)' },
    type: 'model',
    style: {
      background: MODEL_COLOR,
    },
  },
  {
    id: '5',
    position: { x: 300, y: 500 },
    data: { label: '"OpenSearch, of course!" (output)' },
    type: 'default',
    style: {
      background: DEFAULT_COLOR,
    },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
];

export function Workspace() {
  const workspaceRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // Fetch bounds based on the ref'd component in below jsx
      const reactFlowBounds = workspaceRef.current.getBoundingClientRect();

      // Get type/label from the event metadata
      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const color =
        type === 'model'
          ? MODEL_COLOR
          : type === 'prompt'
          ? PROMPT_COLOR
          : type === 'embeddings'
          ? EMBEDDINGS_COLOR
          : DEFAULT_COLOR;

      // adjust bounds position hardcoded for now
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left - 80,
        y: event.clientY - reactFlowBounds.top - 90,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label },
        style: {
          background: color,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <EuiFlexItem grow={true}>
      <EuiFlexGroup
        direction="column"
        gutterSize="m"
        justifyContent="spaceBetween"
        ref={workspaceRef}
      >
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
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Controls />
            <Background />
          </ReactFlow>
        </EuiFlexItem>
        <EuiFlexItem style={{ height: 50, marginBottom: 0 }} grow={false}>
          <EuiButton fill={true}>Test it! &#128640;</EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  );
}
