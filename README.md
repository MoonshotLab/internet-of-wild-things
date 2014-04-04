## Spark Core API

### [GET] List all available methods
`https://api.spark.io/v1/devices/{deviceID}?access_token={accessToken}`

### [POST] Get the state of a pin
`https://api.spark.io/v1/devices/{deviceId}/getState`
##### Post Data
```
access_token={accessToken}
params={pinType}{PinNumber}
```

### [POST] Set the state of a pin
`https://api.spark.io/v1/devices/{deviceId}/setState`
##### Post Data
```
access_token={accessToken}
params={pinType}{PinNumber},{pinValue}
```



## Todos
* Setup a proof of concept where a button pressed can send a message to twitter
* Create a service where you can subscribe to the change of any pin.
