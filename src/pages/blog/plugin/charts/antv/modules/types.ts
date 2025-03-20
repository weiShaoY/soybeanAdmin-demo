import type {
  EdgeData,
  GraphData,
  NodeData,
} from '@antv/g6'

export type NodeStatus =
  | 'MILESTONE'
  | 'NOT_STARTED'
  | 'DELAYED'
  | 'PAUSED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'COMPLETED_EARLY'
  | 'COMPLETED_LATE'

export type CustomNodeData = {
  isDelayed?: boolean
  isDeleted?: boolean
  milestone?: boolean
  status?: NodeStatus
} & NodeData

export type CustomEdgeData = {
  isDelayed?: boolean
  isDeleted?: boolean
} & EdgeData

export type CustomGraphData = {
  nodes: CustomNodeData[]
  edges: CustomEdgeData[]
} & GraphData
