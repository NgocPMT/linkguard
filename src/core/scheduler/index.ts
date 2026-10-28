export interface ScheduledTask {
  name: string
  cronExpression: string
  handler: () => Promise<void>
}

export class TaskScheduler {
  private tasks: Map<string, ScheduledTask> = new Map()

  register(task: ScheduledTask): void {
    this.tasks.set(task.name, task)
  }

  start(): void {
    console.log(`[TaskScheduler] Initialized ${this.tasks.size} scheduled tasks`)
  }

  stop(): void {
    console.log('[TaskScheduler] Stopped tasks')
  }
}
