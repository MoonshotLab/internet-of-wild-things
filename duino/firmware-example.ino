int analogChangeThreshold = 50;

char analogInputRefs[] = {'0', '6'};
char digitalInputRefs[] = {'4'};

int analogInputs[] = {};
int analogOutputs[] = {A0, A4, A7};
int digitalInputs[] = {D4};
int digitalOutputs[] = {D0};

int analogInputStates[] = {0, 0};

unsigned long lastLoop = 0UL;


// Web service which sets a new state
// to a specified pin and returns the
// new value
int setState(String command)
{
  // param parsing
  char pinType = command.charAt(0);
  int pinRef = command.charAt(1) - '0';
  String pinValString = command.substring(3, command.length());
  int pinVal = atoi(pinValString.c_str());

  if(pinType == 'D')
    digitalWrite(pinRef, pinVal);
  else{
    char publishString[64];

    // just fuck it all
    if(command.charAt(1) == '0')
      analogWrite(A0, pinVal);
    if(command.charAt(1) == '1')
      analogWrite(A1, pinVal);
    if(command.charAt(1) == '2'){
      analogWrite(A2, pinVal);
      sprintf(publishString, "{ \"pinId\": \"A%c\", \"state\": %u }", command.charAt(1), pinVal);
      Spark.publish("receive-test", publishString);
    }
    if(command.charAt(1) == '3')
      analogWrite(A3, pinVal);
    if(command.charAt(1) == '4')
      analogWrite(A4, pinVal);
    if(command.charAt(1) == '5')
      analogWrite(A5, pinVal);
    if(command.charAt(1) == '6')
      analogWrite(A6, pinVal);
    if(command.charAt(1) == '7')
      analogWrite(A7, pinVal);
  }

  return 1;
}



void setup(){
  // Loop over analogs inputs and outputs,
  // setting each one appropriately
  for(int i=0; i<sizeof(digitalInputs)/sizeof(int); i++){
    pinMode(digitalInputs[i], INPUT);
  }
  for(int i=0; i<sizeof(digitalOutputs)/sizeof(int); i++){
    pinMode(digitalOutputs[i], OUTPUT);
  }
  for(int i=0; i<sizeof(analogOutputs)/sizeof(int); i++){
    pinMode(analogOutputs[i], OUTPUT);
  }
  for(int i=0; i<sizeof(analogInputs)/sizeof(int); i++){
    pinMode(analogInputs[i], INPUT);
  }

  // "API" Methods
  Spark.function("setState", setState);
}


void loop(){
  unsigned long now = millis();


  if(now-lastLoop > 1000UL){
    lastLoop = now;

    // Loop over the analog inputs and publish the read
    // states if they've changed "enough" since the
    // previous event loop
    for(int i=0; i<sizeof(analogInputs)/sizeof(int); i++){
      int currentState = analogRead(analogInputs[i]);

      if(abs(analogInputStates[i] - currentState) > analogChangeThreshold){
        analogInputStates[i] = currentState;

        char publishString[64];
        sprintf(publishString, "{ \"pinId\": \"A%c\", \"state\": %u }", analogInputRefs[i], currentState);
        Spark.publish("input-update", publishString);
      }
    }
  }

  // Loop over the digital inputs and publish the read
  // states if they've changed since the previous
  // event loop
  for(int i=0; i<sizeof(digitalInputs)/sizeof(int); i++){
    if(digitalRead(digitalInputs[i]) == 1){
      char publishString[64];
      sprintf(publishString, "{ \"pinId\": \"D%c\", \"state\": %u }", digitalInputRefs[i], 1);
      Spark.publish("input-update", publishString);
      delay(1000);
    }
  }
}
