export type GraphLevelDefinition = {
  nodes: unknown[];
  edges: unknown[];
  arrows: unknown[];
  blockedEdges: unknown[];
  metadata: Record<string, unknown>;
};

const requiredKeys = ['nodes', 'edges', 'arrows', 'blockedEdges', 'metadata'] as const;

export class GraphLevelDefinitionValidator {
  validate(value: unknown): GraphLevelDefinition {
    if (!this.isObject(value)) {
      throw new Error('Level definition must be an object.');
    }

    for (const key of requiredKeys) {
      if (!(key in value)) {
        throw new Error(`Level definition is missing required key: ${key}.`);
      }
    }

    if (!Array.isArray(value.nodes)) {
      throw new Error('Level definition nodes must be an array.');
    }
    if (!Array.isArray(value.edges)) {
      throw new Error('Level definition edges must be an array.');
    }
    if (!Array.isArray(value.arrows)) {
      throw new Error('Level definition arrows must be an array.');
    }
    if (!Array.isArray(value.blockedEdges)) {
      throw new Error('Level definition blockedEdges must be an array.');
    }
    if (!this.isObject(value.metadata) || Array.isArray(value.metadata)) {
      throw new Error('Level definition metadata must be an object.');
    }

    return value as GraphLevelDefinition;
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
