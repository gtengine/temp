import { Edge, MarkerType, Node } from "reactflow";

// nodes 데이터
export const getNodes = (language: string): Node[] => [
  {
    id: "1",
    type: "customNode",
    data: { label: "성능시험<br />프로그램" },
    position: { x: 0, y: 0 },
  },
  ...(language === "C"
    ? [
        {
          id: "2",
          type: "customNode",
          data: { label: "JS Wrapper" },
          position: { x: 150, y: 0 },
        },
      ]
    : []),
  {
    id: "3",
    type: "customNode",
    data: { label: language === "C" ? "C API" : "JS API" },
    position: { x: 300, y: 0 },
  },
  {
    id: "4",
    type: "customNode",
    data: { label: "libUSB" },
    position: { x: 450, y: 0 },
  },
  {
    id: "5",
    type: "customNode",
    data: { label: "Q-SoC" },
    position: { x: 600, y: 0 },
  },
  {
    id: "6",
    data: { label: "성능 측정 구간" },
    type: "customGroup",
    position: { x: 290, y: -50 },
  },
];

// edges 데이터
export const getEdges = (language: string): Edge[] => [
  ...(language === "C"
    ? [
        {
          id: "e1-2",
          source: "1",
          target: "2",
          sourceHandle: "rt",
          targetHandle: "lt",
          animated: true,
          markerEnd: {
            type: MarkerType.Arrow,
            color: "#f268ad",
            width: 24,
            height: 24,
          },
          style: {
            stroke: "#f268ad",
          },
        },
        {
          id: "e2-3",
          source: "2",
          target: "3",
          sourceHandle: "rt",
          targetHandle: "lt",
          animated: true,
          markerEnd: {
            type: MarkerType.Arrow,
            color: "#f268ad",
            width: 24,
            height: 24,
          },
          style: {
            stroke: "#f268ad",
          },
        },
      ]
    : [
        {
          id: "e1-3",
          source: "1",
          target: "3",
          sourceHandle: "rt",
          targetHandle: "lt",
          animated: true,
          markerEnd: {
            type: MarkerType.Arrow,
            color: "#f268ad",
            width: 24,
            height: 24,
          },
          style: {
            stroke: "#f268ad",
          },
        },
      ]),
  {
    id: "e3-4",
    source: "3",
    target: "4",
    sourceHandle: "rt",
    targetHandle: "lt",
    animated: true,
    markerEnd: {
      type: MarkerType.Arrow,
      color: "#f268ad",
      width: 24,
      height: 24,
    },
    style: {
      stroke: "#f268ad",
    },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    sourceHandle: "rt",
    targetHandle: "lt",
    animated: true,
    markerEnd: {
      type: MarkerType.Arrow,
      color: "#f268ad",
      width: 24,
      height: 24,
    },
    style: {
      stroke: "#f268ad",
    },
  },
  {
    id: "e5-4",
    source: "5",
    target: "4",
    sourceHandle: "lb",
    targetHandle: "rb",
    animated: true,
    markerEnd: {
      type: MarkerType.Arrow,
      color: "#599bf7",
      width: 24,
      height: 24,
    },
    style: {
      stroke: "#599bf7",
    },
  },
  {
    id: "e4-3",
    source: "4",
    target: "3",
    sourceHandle: "lb",
    targetHandle: "rb",
    animated: true,
    markerEnd: {
      type: MarkerType.Arrow,
      color: "#599bf7",
      width: 24,
      height: 24,
    },
    style: {
      stroke: "#599bf7",
    },
  },
  ...(language === "C"
    ? [
        {
          id: "e3-2",
          source: "3",
          target: "2",
          sourceHandle: "lb",
          targetHandle: "rb",
          animated: true,
          markerEnd: {
            type: MarkerType.Arrow,
            color: "#599bf7",
            width: 24,
            height: 24,
          },
          style: {
            stroke: "#599bf7",
          },
        },
        {
          id: "e2-1",
          source: "2",
          target: "1",
          sourceHandle: "lb",
          targetHandle: "rb",
          animated: true,
          markerEnd: {
            type: MarkerType.Arrow,
            color: "#599bf7",
            width: 24,
            height: 24,
          },
          style: {
            stroke: "#599bf7",
          },
        },
      ]
    : [
        {
          id: "e3-1",
          source: "3",
          target: "1",
          sourceHandle: "lb",
          targetHandle: "rb",
          animated: true,
          markerEnd: {
            type: MarkerType.Arrow,
            color: "#599bf7",
            width: 24,
            height: 24,
          },
          style: {
            stroke: "#599bf7",
          },
        },
      ]),
];
