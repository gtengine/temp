import { getEdges, getNodes } from "@/constants/simple-flow-data";
import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Connection,
  Edge,
  Handle,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

interface CustomNodeData {
  label: string;
}

// 커스텀 노드
function CustomNode({ data }: { data: CustomNodeData }) {
  const rightTop = { top: 15, opacity: 0 };
  const rightBottom = { top: 40, opacity: 0 };
  const leftTop = { top: 15, opacity: 0 };
  const leftBottom = { top: 40, opacity: 0 };

  return (
    <div className="border border-gray-900 w-28 h-14 flex items-center justify-center">
      <Handle
        id="rt"
        type="source"
        position={Position.Right}
        style={rightTop}
      />
      <Handle
        id="rb"
        type="target"
        position={Position.Right}
        style={rightBottom}
      />
      <div
        style={{ fontSize: 18 }}
        dangerouslySetInnerHTML={{ __html: data.label }}
      />
      <Handle id="lt" type="target" position={Position.Left} style={leftTop} />
      <Handle
        id="lb"
        type="source"
        position={Position.Left}
        style={leftBottom}
      />
    </div>
  );
}

// 커스텀 그룹 노드
function CustomGroupNode({ data }: { data: CustomNodeData }) {
  return (
    <div className="w-[430px] border border-gray-900 bg-none h-32 flex justify-center font-bold bg-purple-500 bg-opacity-5">
      <div
        style={{ fontSize: 18 }}
        dangerouslySetInnerHTML={{ __html: data.label }}
      />
    </div>
  );
}

export default function FlowChart({ language }: { language: string }) {
  // 차트 타입 맵핑
  const nodeTypes = useMemo(
    () => ({ customNode: CustomNode, customGroup: CustomGroupNode }),
    [language] // language를 의존성 배열에 추가
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(getNodes(language));
  const [edges, setEdges, onEdgesChange] = useEdgesState(getEdges(language));

  useEffect(() => {
    if (language === "C") {
      setNodes(getNodes(language));
      setEdges(getEdges(language));
    } else if (language === "JS") {
      setNodes(getNodes(language));
      setEdges(getEdges(language));
    }
  }, [language]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    ></ReactFlow>
  );
}
