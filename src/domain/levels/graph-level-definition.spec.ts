import { GraphLevelDefinitionValidator } from './graph-level-definition';

describe('GraphLevelDefinitionValidator', () => {
  const validator = new GraphLevelDefinitionValidator();

  it('should_accept_level_definition_when_required_shape_is_present', () => {
    // Arrange
    const definition = {
      nodes: [],
      edges: [],
      arrows: [],
      blockedEdges: [],
      metadata: {},
    };

    // Act
    const result = validator.validate(definition);

    // Assert
    expect(result).toBe(definition);
  });

  it('should_reject_level_definition_when_required_key_is_missing', () => {
    // Arrange
    const definition = {
      nodes: [],
      edges: [],
      arrows: [],
      metadata: {},
    };

    // Act & Assert
    expect(() => validator.validate(definition)).toThrow(
      'Level definition is missing required key: blockedEdges.',
    );
  });
});
