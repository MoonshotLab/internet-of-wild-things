int analogChangeThreshold = ¡¡analogChangeThreshold¡¡;

int digitalInputs[] = ¡¡digitalInputs¡¡;
int digitalOutputs[] = ¡¡digitalOutputs¡¡;

int analogInputs[] = ¡¡analogInputs¡¡;
int analogOutputs[] = ¡¡analogOutputs¡¡;

int digitalInputStates[] = {0,0,0,0,0,0,0,0};
int analogInputStates[] = {0,0,0,0,0,0,0,0};


// Web service which returns boolean or
// analog read value
int getState(String param)
{
  int pinNumber = param.charAt(1) - '0';
  char pinType = param.charAt(0);

  if(pinType == 'D'){
    int pin = digitalPins[pinNumber];
    return digitalRead(pin);
  } else if(pinType == 'A'){
    int pin = analogPins[pinNumber];
    return analogRead(pin);
  }
}


// Web service which sets a new state
// to a specified pin and returns the
// new value
int setState(String param)
{
  int pinNumber = param.charAt(1) - '0';
  char pinType = param.charAt(0);

  String stringState = param.substring(3, param.length());
  int state = stringState.toInt();

  if(pinType == 'D'){
    int pin = digitalPins[pinNumber];
    digitalWrite(pin, state);
  } else if(pinType == 'A'){
    int pin = analogPins[pinNumber];
    analogWrite(pin, state);
  }

  return state;
}


void setup()
{
  // Setup default pin modes. Odds are inputs,
  // evens are outputs
  for(int a=0; a<8; a++){
    if(a%2 == 1){
      pinMode(analogPins[a], INPUT);
    } else pinMode(analogPins[a], OUTPUT);
  }

  for(int d=0; d<8; d++){
    if(d%2 == 1){
      pinMode(digitalPins[d], INPUT);
    } else pinMode(digitalPins[d], OUTPUT);
  }

  // "API" Methods
  Spark.function("getState", getState);
  Spark.function("setState", setState);
}


unsigned long lastTime = 0UL;
void loop()
{
  unsigned long now = millis();

  if(now-lastTime>5000UL){
    Spark.publish("polling", "polling");
  }

  if(now-lastTime>100UL){
    lastTime = now;

    // Loop over the analog inputs and publish the read
    // states if they've changed "enough" since the
    // previous event loop
    for(int a=0; a<8; a++){
      if(a%2 == 1){
        int currentState = analogRead(analogPins[a]);

        if(abs(analogStates[a] - currentState) > analogChangeThreshold){
          analogStates[a] = currentState;

          char publishString[64];
          sprintf(publishString, "{ \"pinId\": \"A%u\", \"state\": %u }", d, currentState);
          Spark.publish("input-update", publishString);
        }
      }
    }

    // Loop over the digital inputs and publish the read
    // states if they've changed since the previous
    // event loop
    for(int d=0; d<8; d++){
      if(d%2 == 1){
        int currentState = digitalRead(digitalPins[d]);

        if(currentState != digitalStates[d]){
          digitalStates[d] = currentState;

          char publishString[64];
          sprintf(publishString, "{ \"pinId\": \"D%u\", \"state\": %u }", d, currentState);
          Spark.publish("input-update", publishString);
        }
      }
    }
  }
}
