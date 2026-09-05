
type TaskHandler = (...args: unknown[]) => unknown | Promise<unknown>;

const registry = new Map<string, TaskHandler>();

export function task(name: string, handler: TaskHandler): void {
  if (registry.has(name)) {
    throw new Error(`Task already registered: ${name}`);
  }

  registry.set(name, handler);
}

export async function execute(
  taskName: string,
  args: unknown[] = [],
): Promise<unknown> {
  const handler = registry.get(taskName);

  if (!handler) {
    throw new Error(`Unknown task: ${taskName}`);
  }

  return handler(...args);
}