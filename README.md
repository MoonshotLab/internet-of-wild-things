# The Internet of Wild Things

This project is in support of [Barkley's](http://barkleyus.com/) **The Internet of Wild Thing's** class. The goal of the class is is to teach students with no electronics or programming experience how to begin combining the internet with the real world. Through the use of a [Spark Core](http://spark.io) and [Zapier](http://zapier.com/), students can combine electronics components, configure a web interface, and make real world and web events work together.


## Spark Core
The firmware on the spark core is configured to accept inputs on odd pin numbers, and outputs on even pin numbers. When an input's value is changed, the event is broadcast.

Setting and retrieving pin values can be accomplished via the REST API listed below.

### Pub Sub API
There is subscription event called `input-update`. By subscribing to this event, your application will be immediately notified of any change to a digital or analog input. Analog inputs are broadcast whenever a threshold is met, the value can be modified within the threshold setting on the firmware.

### REST API
* To list all available methods:
`GET - https://api.spark.io/v1/devices/{deviceID}?access_token={accessToken}`


* To retrieve the current state of a pin:
`POST - https://api.spark.io/v1/devices/{deviceId}/getState`
Note that you must pass two form data params with your post request. `access_token={accessToken} params={pinType}{PinNumber}`

* Set the state of a pin
`https://api.spark.io/v1/devices/{deviceId}/setState`
Note that you must pass three two data params with your post request. access_token={accessToken} params={pinType}{PinNumber},{pinValue}


## Notes
* Flash the spark with updated firmware - `spark cloud flash 51ff6f065067545728250187 duino/firmware.ino`.
* Subscribe to all inputs - `spark subscribe input-update`.

### Todos
* Accept a callback web hook url for each core
* Debug analog input problems
