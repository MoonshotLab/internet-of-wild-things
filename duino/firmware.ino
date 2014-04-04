int analogChangeThreshold = 10;

int digitalPins[] = {D0, D1, D2, D3, D4, D5, D6, D7};
int analogPins[] = {A0, A1, A2, A3, A4, A5, A6, A7};

int digitalStates[] = {0, 0, 0, 0, 0, 0, 0};
int analogStates[] = {0, 0, 0, 0, 0, 0, 0};


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
  for(int a=0; a<8; a = a + 1){
    if(a%2 == 1){
      pinMode(analogPins[a], INPUT);
    } else pinMode(analogPins[a], OUTPUT);
  }

  for(int d=0; d<8; d = d + 1){
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
  if (now-lastTime>100UL) {
    lastTime = now;

    // Loop over the analog inputs and publish the read
    // states if they've changed "enough" since the
    // previous event loop
    for(int a=0; a<8; a = a + 1){
      if(a%2 == 1){
        int currentState = digitalRead(analogPins[a]);

        if(abs(analogStates[a] - currentState) > analogChangeThreshold){
          analogStates[a] = currentState;
          Spark.publish("update", String(currentState));
        }
      }
    }

    // Loop over the digital inputs and publish the read
    // states if they've changed since the previous
    // event loop
    for(int d=0; d<8; d = d + 1){
      if(d%2 == 1){
        int currentState = digitalRead(digitalPins[d]);

        if(currentState != digitalStates[d]){
          digitalStates[d] = currentState;
          Spark.publish("update", String(currentState));
        }
      }
    }
  }
}