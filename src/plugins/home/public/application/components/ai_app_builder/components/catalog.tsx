/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiAccordion,
  EuiText,
  EuiSpacer,
  EuiTitle,
  EuiPanel,
} from '@elastic/eui';
import React from 'react';
import './dnd-styles.scss';
import { EMBEDDINGS_COLOR, MODEL_COLOR, PROMPT_COLOR } from '../constants';

export function Catalog() {
  const onDragStart = (event, nodeType, nodeLabel) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', nodeLabel);
    event.dataTransfer.effectAllowed = 'move';
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
            id="modelsAccordion"
            paddingSize="l"
            buttonContent="LLMs"
            style={{
              paddingTop: '25px',
              paddingLeft: '20px',
            }}
          >
            <div onDragStart={(event) => onDragStart(event, 'model', 'GPT-4')} draggable>
              <EuiPanel
                hasShadow={true}
                hasBorder={true}
                paddingSize="s"
                style={{ backgroundColor: MODEL_COLOR }}
              >
                <EuiText>GPT-4 (drag me!)</EuiText>
              </EuiPanel>
            </div>
            <EuiSpacer size="m" />
            <div onDragStart={(event) => onDragStart(event, 'model', 'Llama')} draggable>
              <EuiPanel
                hasShadow={true}
                hasBorder={true}
                paddingSize="s"
                style={{ backgroundColor: MODEL_COLOR }}
              >
                <EuiText>Llama</EuiText>
              </EuiPanel>
            </div>
            <EuiSpacer size="m" />
            <div onDragStart={(event) => onDragStart(event, 'model', 'BERT')} draggable>
              <EuiPanel
                hasShadow={true}
                hasBorder={true}
                paddingSize="s"
                style={{ backgroundColor: MODEL_COLOR }}
              >
                <EuiText>BERT</EuiText>
              </EuiPanel>
            </div>
          </EuiAccordion>
          <EuiSpacer size="m" />
          <EuiAccordion
            id="embeddingsAccordion"
            paddingSize="l"
            buttonContent="Embedding Models"
            style={{ paddingLeft: 20 }}
          >
            <div
              onDragStart={(event) => onDragStart(event, 'embeddings', 'OpenAI Embedding Model')}
              draggable
            >
              <EuiPanel
                hasShadow={true}
                hasBorder={true}
                paddingSize="s"
                style={{ backgroundColor: EMBEDDINGS_COLOR }}
              >
                <EuiText>OpenAI Embedding Model</EuiText>
              </EuiPanel>
            </div>
            <EuiSpacer size="m" />
            <div
              onDragStart={(event) => onDragStart(event, 'embeddings', 'BERT Embedding Model')}
              draggable
            >
              <EuiPanel
                hasShadow={true}
                hasBorder={true}
                paddingSize="s"
                style={{ backgroundColor: EMBEDDINGS_COLOR }}
              >
                <EuiText>BERT Embedding Model</EuiText>
              </EuiPanel>
            </div>
            <EuiSpacer size="m" />
            <div
              onDragStart={(event) => onDragStart(event, 'embeddings', 'Word2Vec Embedding Model')}
              draggable
            >
              <EuiPanel
                hasShadow={true}
                hasBorder={true}
                paddingSize="s"
                style={{ backgroundColor: EMBEDDINGS_COLOR }}
              >
                <EuiText>Word2Vec Embedding Model</EuiText>
              </EuiPanel>
            </div>
          </EuiAccordion>
          <EuiSpacer size="m" />
          <EuiAccordion
            id="promptsAccordion"
            paddingSize="l"
            buttonContent="Prompt Templates"
            style={{ paddingLeft: 20 }}
          >
            <div onDragStart={(event) => onDragStart(event, 'prompt', 'Chat')} draggable>
              <EuiPanel
                hasShadow={true}
                hasBorder={true}
                paddingSize="s"
                style={{ backgroundColor: PROMPT_COLOR }}
              >
                <EuiText>Chat</EuiText>
              </EuiPanel>
            </div>
            <EuiSpacer size="m" />
            <div onDragStart={(event) => onDragStart(event, 'prompt', 'Few-shot')} draggable>
              <EuiPanel
                hasShadow={true}
                hasBorder={true}
                paddingSize="s"
                style={{ backgroundColor: PROMPT_COLOR }}
              >
                <EuiText>Few-shot</EuiText>
              </EuiPanel>
            </div>
            <EuiSpacer size="m" />
            <div onDragStart={(event) => onDragStart(event, 'prompt', 'Summarization')} draggable>
              <EuiPanel
                hasShadow={true}
                hasBorder={true}
                paddingSize="s"
                style={{ backgroundColor: PROMPT_COLOR }}
              >
                <EuiText>Summarization</EuiText>
              </EuiPanel>
            </div>
          </EuiAccordion>
          <EuiSpacer size="m" />
          <EuiAccordion
            id="agentsAccordion"
            paddingSize="l"
            buttonContent="Agents"
            style={{ paddingLeft: 20 }}
          >
            <EuiSpacer size="m" />
            <div onDragStart={(event) => onDragStart(event, 'agent', 'Agent 1')} draggable>
              <EuiPanel hasShadow={true} hasBorder={true} paddingSize="s">
                <EuiText>Agent 1</EuiText>
              </EuiPanel>
            </div>
          </EuiAccordion>
          <EuiSpacer size="m" />
          <EuiAccordion
            id="toolsAccordion"
            paddingSize="l"
            buttonContent="Tools"
            style={{ paddingLeft: 20 }}
          >
            <EuiSpacer size="m" />
            <div onDragStart={(event) => onDragStart(event, 'tool', 'Tool 1')} draggable>
              <EuiPanel hasShadow={true} hasBorder={true} paddingSize="s">
                <EuiText>Tool 1</EuiText>
              </EuiPanel>
            </div>
          </EuiAccordion>
          <EuiSpacer size="m" />
          <EuiAccordion
            id="queryAccordion"
            paddingSize="l"
            buttonContent="Query pipelines"
            style={{ paddingLeft: 20 }}
          >
            <EuiSpacer size="m" />
            <div
              onDragStart={(event) => onDragStart(event, 'query-pipeline', 'Query Pipeline 1')}
              draggable
            >
              <EuiPanel hasShadow={true} hasBorder={true} paddingSize="s">
                <EuiText>Query Pipeline 1</EuiText>
              </EuiPanel>
            </div>
          </EuiAccordion>
          <EuiSpacer size="m" />
          <EuiAccordion
            id="ingestAccordion"
            paddingSize="l"
            buttonContent="Ingest pipelines"
            style={{ paddingLeft: 20 }}
          >
            <EuiSpacer size="m" />
            <div
              onDragStart={(event) => onDragStart(event, 'ingest-pipeline', 'Ingest Pipeline 1')}
              draggable
            >
              <EuiPanel hasShadow={true} hasBorder={true} paddingSize="s">
                <EuiText>Ingest Pipeline 1</EuiText>
              </EuiPanel>
            </div>
          </EuiAccordion>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  );
}
