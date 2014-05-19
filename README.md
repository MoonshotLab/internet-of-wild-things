# The Internet of Wild Things

This project is in support of [Moonshot's](http://moonshot.barkleyus.com/) **The Internet of Wild Thing's** class. The goal of the class is is to teach students with no electronics or programming experience how to begin combining the internet with the real world. Through the use of a [Spark Core](http://spark.io) and [Zapier](http://zapier.com/), students can combine electronics components, configure a web interface, and make the real world and web events work together.

![App Flow](http://i.imgur.com/jvJq5b5.jpg)
![Home Screen](http://i.imgur.com/tykNxQV.png)

## Firmware Generation
Firmware is generated via the user interface based on pin selection. Pressing *Save and Bootload* will generate a new file, upload it to the correct spark core, and trigger a core reset. My current method of code generation is a bit sloppy and could probably be improved upon. Check out `duino/template.ino` to see the prototype file.

![Firmware Generation](http://i.imgur.com/cV2nqXK.png)

### Setting a pin's state
The generated code has one API end point, `setState`, which can be accessed via [Spark's provided rest service](http://docs.spark.io/#/), and is available for every pin explicitly set as an input.

```bash
curl https://api.spark.io/v1/devices/{deviceId}/setState \
  -d access_token={accessToken} -d params=D0,1
```

![Setting a Pin's State](http://i.imgur.com/XVMgxCf.png)

### Listening for change
The generated code will broadcast events for each pin explicitly set as an output within the namespace `iot-update`.

Digital pin events are broadcast immediately upon change. After the event is emitted, a one second delay is enforced to prevent emissions which trigger rate limiting from Spark's API

Analog pin events are broadcast when a sufficient change is detected. The default threshold is set at `15` (an incredibly arbitrary number) and is configurable via the interface.

These events can be listened to via [Spark's Command Line Interface](https://github.com/spark/spark-cli) `spark subscribe iot-update`.

![Pin Listening](http://i.imgur.com/YIAsuAj.png)

## Webhook Integration and REST API Endpoints
Each spark core defined within this application has it's own API REST points which mimic those of the Spark API. The reason being is that users should be able to create "if this, then that" scenarios using popular web services like [IFTTT](https://ifttt.com/) and [Zapier](https://zapier.com/). By hosting our own variety of the API, we're able to log, debug, and show immediate feedback to the end user even if their wiring schemes are incorrect.

To make things especially easy, all of this app's REST routes are `GET`.

Set a pin's state:
```
/core/{coreId}/setPin?pinId={pinId}&pinVal={pinVal}
/core/13456789/setPin?pinId=D0&pinVal=1
```

Forwards a `GET` to a `POST` for a webhook matching the specified core's pinId. One webhook is allowed per pinId.
```
/core/{coreId}/callHook?pinId={pinId}&pinVal={pinVal}
/core/13456789/callHook?pinId=D0&pinVal=1
```

## Class Materials
### Worksheets and Presentation are publicly available via google docs:
* [Slides](https://docs.google.com/presentation/d/12QPfs99aJnxXwtKe0scYcNoUmi8t3_ACDv7x8QgXx2k/edit?usp=sharing)
* [Essentials](https://docs.google.com/document/d/1rtvIpxw_VBBPk4kuN3pqxlyxZDnfJMqKLS4J3WeVfQ0/edit?usp=sharing)
* [Switches and Controls](https://docs.google.com/document/d/1SO6Q5rlsIMHSP5gGgDt0duH2wln8jjoJAgtfH303Y9s/edit?usp=sharing)
* [Weight and Touch](https://docs.google.com/document/d/1Lw6EdYqnHf8duMMRAUMgkTeEKRPHWlA3ojJL1Aht8Ec/edit?usp=sharing)
* [Detecting and Creating Movement](https://docs.google.com/document/d/18axQn_0DZHCxeeXUvFbedITiu49fLXiST5Zi_AW9EDA/edit?usp=sharing)
* [Gas, Light, and Temperature](https://docs.google.com/document/d/1x_c-cZCMOsWPZRIEOcMl3W1colC7D9-NmNlXgSusq60/edit?usp=sharing)

### Other Tips
* If a student gets rate limited because of excessive event emission, it's possible that their core will not load new code. To resolve the issue, plug the pin directly into the power source. You should now be able to load new code on the device.
* Occasionally, someone will send power into an output, drop the core in a toilet, or do something else which will force the core to be factory reset. Hold the mode button, tap reset, and wait 10 seconds until the LED fashes white.
* The easiest way to connect the core to the internet is via [CoolTerm](http://freeware.the-meiers.org/). Connect your device, tap `w`, to configure the wifi credentials.

![Breadboard and Circuit](http://i.imgur.com/iCDqQ00.jpg)
![Tool Table](http://i.imgur.com/ZZO8H67.jpg)
