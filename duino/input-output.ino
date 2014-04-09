Servo SERVO;

int LED = D0;
int BUTTON = D4;
int POT = A4;

int analogChangeThreshold = 5;
int lastPotState = 0;
int lastButtonState = 0;


int digitalPins[] = {D0, D1, D2, D3, D4, D5, D6, D7};
int analogPins[] = {A0, A1, A2, A3, A4, A5, A6, A7};


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
  pinMode(LED, OUTPUT);
  SERVO.attach(A0);

  pinMode(BUTTON, INPUT);
  pinMode(POT, INPUT);

  Spark.function("getState", getState);
  Spark.function("setState", setState);
}


unsigned long lastTime = 0UL;
void loop()
{
  unsigned long now = millis();

  if(now-lastTime>1000UL){
    lastTime = now;

    int currentPotState = analogRead(POT);
    if(abs(lastPotState - currentPotState) > analogChangeThreshold){
      lastPotState = currentPotState;

      char potPublishString[64];
      sprintf(potPublishString, "{ \"pinId\": \"A4\", \"state\": %u }", currentPotState);
      Spark.publish("input-update", potPublishString);
    }

    int currentButtonState = digitalRead(BUTTON);
    if(lastButtonState != currentButtonState){
      lastButtonState = currentButtonState;

      char buttonPublishString[64];
      sprintf(buttonPublishString, "{ \"pinId\": \"D4\", \"state\": %u }", currentButtonState);
      Spark.publish("input-update", buttonPublishString);
    }
  }
}
