describe("jsonSqlLib", function() {
  var exampleJSON = { "country": [
                    { "name" : "India", 
                      "capital" : "New Delhi",
                      "dignitaries" : {
                        "president" : "Pranab Mukherjee",
                        "primeMinister" : "Narendra Modi"
                      } 
                    },
                    { "name" : "USA", 
                      "capital" : "Washington DC",
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


  it("should be able to query when table is an array", function() {
      var queryResult = jsonDB.query('name', 'country');
      expect(queryResult).toEqual([{'name':'India'},{'name':'USA'}]);
  });

  // describe("when song has been paused", function() {
  //   beforeEach(function() {
  //     player.play(song);
  //     player.pause();
  //   });

  //   it("should indicate that the song is currently paused", function() {
  //     expect(player.isPlaying).toBeFalsy();

  //     // demonstrates use of 'not' with a custom matcher
  //     expect(player).not.toBePlaying(song);
  //   });

  //   it("should be possible to resume", function() {
  //     player.resume();
  //     expect(player.isPlaying).toBeTruthy();
  //     expect(player.currentlyPlayingSong).toEqual(song);
  //   });
  // });

  // // demonstrates use of spies to intercept and test method calls
  // it("tells the current song if the user has made it a favorite", function() {
  //   spyOn(song, 'persistFavoriteStatus');

  //   player.play(song);
  //   player.makeFavorite();

  //   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  // });

  // //demonstrates use of expected exceptions
  // describe("#resume", function() {
  //   it("should throw an exception if song is already playing", function() {
  //     player.play(song);

  //     expect(function() {
  //       player.resume();
  //     }).toThrowError("song is already playing");
  //   });
  // });

});
