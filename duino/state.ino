// Setup pin arrays
int digitalOutputs[] = {D0, 0, D2, 0, D4, 0, D6, 0};
int digitalInputs[]  = {0, D1, 0, D3, 0, D5, 0, D7};
int analogOutputs[]  = {A0, 0, A2, 0, A4, 0, A6, 0};
int analogInputs[]   = {0, A1, 0, A3, 0, A5, 0, A7};

int state_A0 = 0;
int state_D0 = 0;
int state_A1 = 0;
int state_D1 = 0;


// Get the digital or analog pin from the stored
// arrays above
int getPin(char type, int pinNumber)
{
  // is it an input or output?
  int modulo = pinNumber%2;

  // digital or analog?
  if(type == 'D'){
    if(modulo == 1){
      return digitalOutputs[pinNumber];
    } else {
      return digitalInputs[pinNumber];
    }
  } else if(type == 'A'){
    if(modulo == 1){
      return analogOutputs[pinNumber];
    } else {
      return analogInputs[pinNumber];
    }
  } else{
    return -1;
  }
}


// Web service which returns boolean or
// analog read value
int getState(String param)
{
/*  // convert ascii to integer
  int pinNumber = param.charAt(1) - '0';
  char pinType = param.charAt(0);

  // read and return
  int pin = getPin(pinType, pinNumber);

  if(pinType == 'D'){
    return digitalRead(pin);
  } else if(pinType == 'A'){
    return analogRead(pin);
  }*/

  state_A0 = analogRead(A0);
  state_A1 = analogRead(A0);
  state_D0 = analogRead(D0);
  state_D1 = analogRead(D1);
}


// Web service which sets a new state
// to a specified pin and returns the
// new value
int setState(String param)
{
  // convert ascii to integer
  int pinNumber = param.charAt(1) - '0';
  char pinType = param.charAt(0);

  int pin = getPin(pinType, pinNumber);
  String stringState = param.substring(3, param.length());
  int state = stringState.toInt();

  if(pinType == 'D'){
    digitalWrite(pin, state);
    return digitalRead(pin);
  } else if(pinType == 'A'){
    analogWrite(pin, state);
    return analogRead(pin);
  } else{
    return -1;
  }
}


void setup()
{
  // Setup default pin modes
  pinMode(D0, OUTPUT);
  pinMode(D2, OUTPUT);
  pinMode(D4, OUTPUT);
  pinMode(D6, OUTPUT);
  pinMode(A0, OUTPUT);
  pinMode(A2, OUTPUT);
  pinMode(A4, OUTPUT);
  pinMode(A6, OUTPUT);
  pinMode(D1, INPUT);
  pinMode(D3, INPUT);
  pinMode(D5, INPUT);
  pinMode(D7, INPUT);
  pinMode(A1, INPUT);
  pinMode(A3, INPUT);
  pinMode(A5, INPUT);
  pinMode(A7, INPUT);

  Spark.variable("A0", &state_A0, INT);
  Spark.variable("D0", &state_D0, INT);
  Spark.variable("A1", &state_A1, INT);
  Spark.variable("D1", &state_D1, INT);
  Spark.function("getState", getState);
  Spark.function("setState", setState);
}


void loop()
{

}
