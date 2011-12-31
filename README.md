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

Changes in this Fork
--------------------

Significant structural changes have been made to the code.

  - Created a dependency on [bigdecimal](https://github.com/iriscouch/bigdecimal.js) for better large number support.
  - Added socket connection support, both TCP and UNIX sockets.
  - Added 2 values to config.js: sockFile and tcpSockets. The type of server created is based on the following:
      - if sockFile has a value, a unix socket server will be created
      - if sockFile has no value or isn't in the file, the system looks at the value of tcpSockets, if it is 1, a tcp socket server will be created at the specified port. If tcpSockets is 0, an http server will be created at the specified ports
  - Added functional unit tests, using [vows](http://vowsjs.org)
  - Fixed an issue with the system generating duplicate ids.
  - Reworked the code to increase decoupling and make it more event-driven rather than object oriented.
  - Changed the response for unix sockets to be a digit instead of a json packet.
 
 
Outstanding Issues
------------------
At the moment the individual unit tests pass when run individually; however, an error occurs when run simply with the "vows" command. I need to investigate why this is happening. As this is my first use of vows, I'm sure I'm missing something that is basic.
