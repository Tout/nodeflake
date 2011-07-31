NodeFlake
=========

Like twitters [SnowFlake](https://github.com/twitter/snowflake), but made with NodeJS. 



Why?
----

Because it was there. 



Goals
-----

  - Generate unique ids without need for a stored seed.
  - Ids should be mostly sortable by time/order
  - 2k ids per second (one fifth of SnowFlake!)
  - Fast response and high availability (numbers laters)


State Right Now
---------------

As of now, you can ping the service (http) and get an ID back via json response. (Maybe jsonp support would be nice) It will generate an ID. This works with varying success based on the time of day (there is the clue). It really isn't ready for any prime time use. You may look at the code and ask yourself "How is he doing bitwise operators on 64-bit longs when JavaScript only supports 32-bit bitwise operations?" You would then, no doubt, realize the terrible hack that was made to accomodate this. Don't judge. 

Also, I need to make it more "node-like" with an actual event model.

Try this example

    curl -i http://nodeflake.herokuapp.com/


Whats Next
----------

Introduce socket connection for cross-service ID delivery. Fix issues. Finish the port from what twitter is doing.




