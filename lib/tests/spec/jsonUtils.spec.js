describe('jsonUtils.generateColumnSuggestions', function() {

  it('returns item properties for array table schema', function() {
    var tableSchema = {
      type: 'array',
      items: { properties: { col1: {}, col2: {} } }
    };
    expect(jsonUtils.generateSuggestions(tableSchema).sort()).toEqual(['col1','col2'].sort());
  });

  it('returns item properties and nested object properties of the array', function() {
    var tableSchema = {
      type: 'array',
      items: { 
        properties: { 
            col1: {
                type: 'object',
                properties: {
                    nestedCol1: {
                        type: 'integer'
                    },
                    nestedCol2: {
                        type: 'string'
                    }
                }
            }, 
            col2: {} 
        } 
    }
    };
    expect(jsonUtils.generateSuggestions(tableSchema).sort()).toEqual(['col1', 'col1.nestedCol1', 'col1.nestedCol2', 'col2'].sort());
  });

  it('returns item properties but exludes nested object properties if excludeLeaf is true', function() {
    var tableSchema = {
      type: 'array',
      items: { 
        properties: { 
            col1: {
                type: 'object',
                properties: {
                    col11: {
                        type: 'integer'
                    },
                    col12: {
                        type: 'string'
                    },
                    col13: {
                        type: 'object',
                        properties: {
                            col131: {
                                type: 'integer'
                            }
                        }
                    }
                }
            }, 
            col2: {
                type: 'object',
                properties: {
                    col21: {
                        type: 'integer'
                    },
                    col22: {
                        type: 'string'
                    }
                }
            } 
        } 
    }
    };
    expect(jsonUtils.generateSuggestions(tableSchema, undefined, true).sort()).toEqual(['col1', 'col1.col13', 'col2'].sort());
  });


  it('returns item properties and nested object properties of the array with multiple nesting', function() {
    var tableSchema = {
      type: 'array',
      items: { 
        properties: { 
            col1: {
                type: 'object',
                properties: {
                    nestedCol1: {
                        type: 'object',
                        properties: {
                            deepNestedCol1: {
                                type: 'integer'
                            },
                            deepNestedCol2: {
                                type: 'string'
                            }
                        }
                    },
                    nestedCol2: {
                        type: 'string'
                    }
                }
            }, 
            col2: {} 
        } 
    }
    };
    expect(jsonUtils.generateSuggestions(tableSchema).sort()).toEqual(['col1', 'col2', 'col1.nestedCol1', 'col1.nestedCol2','col1.nestedCol1.deepNestedCol1','col1.nestedCol1.deepNestedCol2'].sort());
  });

  it('returns properties for object table schema', function() {
    var tableSchema = {
      type: 'object',
      properties: { a: {}, b: {} }
    };
    expect(jsonUtils.generateSuggestions(tableSchema).sort()).toEqual(['a','b'].sort());
  });

  it('returns properties for object table schema and nested objects', function() {
    var tableSchema = {
      type: 'object',
      properties: { 
        a: {
            type: 'object',
            properties: {
                nestedA1: {
                    type: 'integer'
                },
                nestedA2: {
                    type: 'string'
                }
            }
        }, 
        b: {

        } 
    }
    };
    expect(jsonUtils.generateSuggestions(tableSchema).sort()).toEqual(['a','b','a.nestedA1','a.nestedA2'].sort());
  });

  it('returns properties for object table schema and nested objects and multiple nesting levels', function() {
    var tableSchema = {
      type: 'object',
      properties: { 
        a: {
            type: 'object',
            properties: {
                nestedA1: {
                    type: 'object',
                    properties: {
                        deepNestedA1: {
                            type: 'integer'
                        },
                        deepNestedA2: {
                            type: 'string'
                        }
                    }
                },
                nestedA2: {
                    type: 'string'
                }
            }
        }, 
        b: {

        } 
    }
    };
    expect(jsonUtils.generateSuggestions(tableSchema).sort()).toEqual(['a','b','a.nestedA1','a.nestedA2','a.nestedA1.deepNestedA1','a.nestedA1.deepNestedA2'].sort());
  });

  it('returns properties for object table schema and nested objects but excludes leaf nodes', function() {
    var tableSchema = {
      type: 'object',
      properties: { 
        a: {
            type: 'object',
            properties: {
                col1: {
                    type: 'object',
                    properties: {
                        col11: {
                            type: 'integer'
                        },
                        col12: {
                            type: 'string'
                        }
                    }
                },
                col2: {
                    type: 'string'
                }
            }
        }, 
        b: {

        } 
    }
    };
    expect(jsonUtils.generateSuggestions(tableSchema, undefined, true).sort()).toEqual(['a','a.col1'].sort());
  });

  it('returns properties for object and array table schema and nested objects and multiple nesting levels', function() {
    var tableSchema = {
      type: 'object',
      properties: { 
        a: {
            type: 'object',
            properties: {
                nestedA1: {
                    type: 'object',
                    properties: {
                        deepNestedA1: {
                            type: 'integer'
                        },
                        deepNestedA2: {
                            type: 'string'
                        }
                    }
                },
                nestedA2: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            deepNestedA3: {
                                type: 'integer'
                            },
                            deepNestedA4: {
                                type: 'string'
                            }
                        }   
                    }
                }
            }
        }, 
        b: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    nestedB1: {
                        type: 'integer'
                    },
                    nestedB2: {
                        type: 'string'
                    }
                }   
            }       
        } 
    }
    };
    expect(jsonUtils.generateSuggestions(tableSchema).sort()).toEqual(['a','b','a.nestedA1','a.nestedA2','a.nestedA1.deepNestedA1','a.nestedA1.deepNestedA2','a.nestedA2.deepNestedA3','a.nestedA2.deepNestedA4', 'b.nestedB1','b.nestedB2'].sort());
  });

  it('returns empty array for undefined or unsupported schema', function() {
    expect(jsonUtils.generateSuggestions(undefined).sort()).toEqual([].sort());
    expect(jsonUtils.generateSuggestions({ type: 'string' }).sort()).toEqual([].sort());
  });

});
