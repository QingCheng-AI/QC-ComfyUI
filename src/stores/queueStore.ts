// @ts-strict-ignore
import { api } from '@/scripts/api'
import type { ComfyApp } from '@/scripts/app'
import type {
  TaskItem,
  TaskType,
  TaskPrompt,
  TaskStatus,
  StatusWsMessageStatus,
  TaskOutput,
  ResultItem
} from '@/types/apiTypes'
import type { ComfyWorkflowJSON, NodeId } from '@/types/comfyWorkflow'
import _ from 'lodash'
import { defineStore } from 'pinia'
import { toRaw } from 'vue'

// Task type used in the API.
export type APITaskType = 'queue' | 'history'

export enum TaskItemDisplayStatus {
  Running = 'Running',
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled'
}

export class ResultItemImpl {
  filename: string
  subfolder?: string
  type: string

  nodeId: NodeId
  // 'audio' | 'images' | ...
  mediaType: string

  // VHS output specific fields
  format?: string
  frame_rate?: number

  constructor(obj: Record<string, any>) {
    this.filename = obj.filename
    this.subfolder = obj.subfolder
    this.type = obj.type

    this.nodeId = obj.nodeId
    this.mediaType = obj.mediaType

    this.format = obj.format
    this.frame_rate = obj.frame_rate
  }

  private get urlParams(): URLSearchParams {
    const params = new URLSearchParams()
    params.set('filename', this.filename)
    params.set('type', this.type)
    params.set('subfolder', this.subfolder || '')

    if (this.format) {
      params.set('format', this.format)
    }
    if (this.frame_rate) {
      params.set('frame_rate', this.frame_rate.toString())
    }
    return params
  }

  /**
   * VHS advanced preview URL. `/viewvideo` endpoint is provided by VHS node.
   *
   * `/viewvideo` always returns a webm file.
   */
  get vhsAdvancedPreviewUrl(): string {
    return api.apiURL('/viewvideo?' + this.urlParams)
  }

  get url(): string {
    return api.apiURL('/view?' + this.urlParams)
  }

  get urlWithTimestamp(): string {
    return `${this.url}&t=${+new Date()}`
  }

  get isVhsFormat(): boolean {
    return !!this.format && !!this.frame_rate
  }

  get htmlVideoType(): string | undefined {
    const defaultType = undefined

    if (!this.isVhsFormat) {
      return defaultType
    }

    if (this.format.endsWith('webm')) {
      return 'video/webm'
    }
    if (this.format.endsWith('mp4')) {
      return 'video/mp4'
    }
    return defaultType
  }

  get isVideo(): boolean {
    return !this.isImage && this.format && this.format.startsWith('video/')
  }

  get isGif(): boolean {
    return this.filename.endsWith('.gif')
  }

  get isWebp(): boolean {
    return this.filename.endsWith('.webp')
  }

  get isImage(): boolean {
    return this.mediaType === 'images' || this.isGif || this.isWebp
  }

  get supportsPreview(): boolean {
    return this.isImage || this.isVideo
  }
}

export class TaskItemImpl {
  readonly taskType: TaskType
  readonly prompt: TaskPrompt
  readonly status?: TaskStatus
  readonly outputs: TaskOutput
  readonly flatOutputs: ReadonlyArray<ResultItemImpl>

  constructor(
    taskType: TaskType,
    prompt: TaskPrompt,
    status: TaskStatus | undefined,
    outputs: TaskOutput,
    flatOutputs?: ReadonlyArray<ResultItemImpl>
  ) {
    this.taskType = taskType
    this.prompt = prompt
    this.status = status
    this.outputs = outputs
    this.flatOutputs = flatOutputs ?? this.calculateFlatOutputs()
  }

  calculateFlatOutputs(): ReadonlyArray<ResultItemImpl> {
    if (!this.outputs) {
      return []
    }
    return Object.entries(this.outputs).flatMap(([nodeId, nodeOutputs]) =>
      Object.entries(nodeOutputs).flatMap(([mediaType, items]) =>
        (items as ResultItem[]).map(
          (item: ResultItem) =>
            new ResultItemImpl({
              ...item,
              nodeId,
              mediaType
            })
        )
      )
    )
  }

  get previewOutput(): ResultItemImpl | undefined {
    return (
      this.flatOutputs.find(
        // Prefer saved media files over the temp previews
        (output) => output.type === 'output' && output.supportsPreview
      ) ?? this.flatOutputs.find((output) => output.supportsPreview)
    )
  }

  get apiTaskType(): APITaskType {
    switch (this.taskType) {
      case 'Running':
      case 'Pending':
        return 'queue'
      case 'History':
        return 'history'
    }
  }

  get key() {
    return this.promptId + this.displayStatus
  }

  get queueIndex() {
    return this.prompt[0]
  }

  get promptId() {
    return this.prompt[1]
  }

  get promptInputs() {
    return this.prompt[2]
  }

  get extraData() {
    return this.prompt[3]
  }

  get outputsToExecute() {
    return this.prompt[4]
  }

  get extraPngInfo() {
    return this.extraData.extra_pnginfo
  }

  get clientId() {
    return this.extraData.client_id
  }

  get workflow(): ComfyWorkflowJSON | undefined {
    return this.extraPngInfo?.workflow
  }

  get messages() {
    return this.status?.messages || []
  }

  get interrupted() {
    return _.some(
      this.messages,
      (message) => message[0] === 'execution_interrupted'
    )
  }

  get isHistory() {
    return this.taskType === 'History'
  }

  get isRunning() {
    return this.taskType === 'Running'
  }

  get displayStatus(): TaskItemDisplayStatus {
    switch (this.taskType) {
      case 'Running':
        return TaskItemDisplayStatus.Running
      case 'Pending':
        return TaskItemDisplayStatus.Pending
      case 'History':
        if (this.interrupted) return TaskItemDisplayStatus.Cancelled

        switch (this.status!.status_str) {
          case 'success':
            return TaskItemDisplayStatus.Completed
          case 'error':
            return TaskItemDisplayStatus.Failed
        }
    }
  }

  get executionStartTimestamp() {
    const message = this.messages.find(
      (message) => message[0] === 'execution_start'
    )
    return message ? message[1].timestamp : undefined
  }

  get executionEndTimestamp() {
    const messages = this.messages.filter((message) =>
      [
        'execution_success',
        'execution_interrupted',
        'execution_error'
      ].includes(message[0])
    )
    if (!messages.length) {
      return undefined
    }
    return _.max(messages.map((message) => message[1].timestamp))
  }

  get executionTime() {
    if (!this.executionStartTimestamp || !this.executionEndTimestamp) {
      return undefined
    }
    return this.executionEndTimestamp - this.executionStartTimestamp
  }

  get executionTimeInSeconds() {
    return this.executionTime !== undefined
      ? this.executionTime / 1000
      : undefined
  }

  public async loadWorkflow(app: ComfyApp) {
    if (!this.workflow) {
      return
    }
    await app.loadGraphData(toRaw(this.workflow))
    if (this.outputs) {
      app.nodeOutputs = toRaw(this.outputs)
    }
  }

  public flatten(): TaskItemImpl[] {
    if (this.displayStatus !== TaskItemDisplayStatus.Completed) {
      return [this]
    }

    return this.flatOutputs.map(
      (output: ResultItemImpl, i: number) =>
        new TaskItemImpl(
          this.taskType,
          [
            this.queueIndex,
            `${this.promptId}-${i}`,
            this.promptInputs,
            this.extraData,
            this.outputsToExecute
          ],
          this.status,
          {
            [output.nodeId]: {
              [output.mediaType]: [output]
            }
          },
          [output]
        )
    )
  }
}

interface State {
  runningTasks: TaskItemImpl[]
  pendingTasks: TaskItemImpl[]
  historyTasks: TaskItemImpl[]
  maxHistoryItems: number
  isLoading: boolean
}

export const useQueueStore = defineStore('queue', {
  state: (): State => ({
    runningTasks: [],
    pendingTasks: [],
    historyTasks: [],
    maxHistoryItems: 64,
    isLoading: false
  }),
  getters: {
    tasks(state) {
      return [
        ...state.pendingTasks,
        ...state.runningTasks,
        ...state.historyTasks
      ]
    },
    flatTasks(): TaskItemImpl[] {
      return this.tasks.flatMap((task: TaskItemImpl) => task.flatten())
    },
    lastHistoryQueueIndex(state) {
      return state.historyTasks.length ? state.historyTasks[0].queueIndex : -1
    },
    hasPendingTasks(state) {
      return state.pendingTasks.length > 0
    }
  },
  actions: {
    // Fetch the queue data from the API
    async update() {
      this.isLoading = true
      try {
        const [queue, history] = await Promise.all([
          api.getQueue(),
          api.getHistory(this.maxHistoryItems)
        ])

        const toClassAll = (tasks: TaskItem[]): TaskItemImpl[] =>
          tasks
            .map(
              (task: TaskItem) =>
                new TaskItemImpl(
                  task.taskType,
                  task.prompt,
                  task['status'],
                  task['outputs'] || {}
                )
            )
            // Desc order to show the latest tasks first
            .sort((a, b) => b.queueIndex - a.queueIndex)

        this.runningTasks = toClassAll(queue.Running)
        this.pendingTasks = toClassAll(queue.Pending)

        // Process history items
        const allIndex = new Set(
          history.History.map((item: TaskItem) => item.prompt[0])
        )
        const newHistoryItems = toClassAll(
          history.History.filter(
            (item) => item.prompt[0] > this.lastHistoryQueueIndex
          )
        )
        const existingHistoryItems = this.historyTasks.filter(
          (item: TaskItemImpl) => allIndex.has(item.queueIndex)
        )
        this.historyTasks = [...newHistoryItems, ...existingHistoryItems]
          .slice(0, this.maxHistoryItems)
          .sort((a, b) => b.queueIndex - a.queueIndex)
      } finally {
        this.isLoading = false
      }
    },
    async clear(targets: ('queue' | 'history')[] = ['queue', 'history']) {
      if (targets.length === 0) {
        return
      }
      await Promise.all(targets.map((type) => api.clearItems(type)))
      await this.update()
    },
    async delete(task: TaskItemImpl) {
      await api.deleteItem(task.apiTaskType, task.promptId)
      await this.update()
    }
  }
})

export const useQueuePendingTaskCountStore = defineStore(
  'queuePendingTaskCount',
  {
    state: () => ({
      count: 0
    }),
    actions: {
      update(e: CustomEvent<StatusWsMessageStatus>) {
        this.count = e.detail?.exec_info?.queue_remaining || 0
      }
    }
  }
)

export type AutoQueueMode = 'disabled' | 'instant' | 'change'

export const useQueueSettingsStore = defineStore('queueSettingsStore', {
  state: () => ({
    mode: 'disabled' as AutoQueueMode,
    batchCount: 1
  })
})