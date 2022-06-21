describe("jsonSqlLib", function() {
  var exampleJSON = { "country": [
                    { "name" : "India", 
                      "capital" : "New Delhi",
                      "cities": {
                        "metros": ["New Delhi", "Chennai", "Mumbai", "Kolkatta"]
                      },
                      "dignitaries" : {
                        "president" : "Pranab Mukherjee",
                        "primeMinister" : "Narendra Modi"
                      } 
                    },
                    { "name" : "USA", 
                      "capital" : "Washington DC",
                      "cities": {
                        "metros": ["New York", "San Francisco"]
                      },
                      "dignitaries" : {
                        "president" : "Barack Obama"
                      }
                    }
                  ]
            };

  var jsonDB;

  beforeEach(function() {
    jsonDB = new jsonsql(exampleJSON);
  });


  it("should be able to query when table is an array", () => {
      let queryResult = jsonDB.query('name', 'country');
      expect(queryResult).toEqual([{'name':'India'},{'name':'USA'}]);
  });

  it("should be able to query when column name is a json path", () => {
      let queryResult = jsonDB.query('cities.metros', 'country');
      expect(queryResult).toEqual([{'cities->metros':["New Delhi", "Chennai", "Mumbai", "Kolkatta"]},{'cities->metros':["New York", "San Francisco"]}]);
  });

  it("query on columns", () => {
    let columns = jsonDB.getColumnNames('*', exampleJSON.country);
    expect(columns).toEqual(['name', 'capital', 'cities','dignitaries']);
  });

  it('query column names as strings delimited by commas', () => {
    let columns = jsonDB.getColumnNames('name, capital', exampleJSON.country);
    expect(columns).toEqual(['name', 'capital']);
  });

  it('query 1 column', () => {
    let columns = jsonDB.getColumnNames('name', exampleJSON.country);
    expect(columns).toEqual(['name']);
  });

  it('query invalid column', () => {
    let columns = jsonDB.getColumnNames('yo', exampleJSON.country);
    expect(columns).toEqual([]);
  })
  
});
