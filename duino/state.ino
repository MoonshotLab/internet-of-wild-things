// Get the digital or analog pin from the stored
// arrays above
int getPinValue(char pinType, char pinNumber)
{
  if(pinType == 'D'){
    if(pinNumber == '0') return digitalRead(D0);
    else if(pinNumber == '1') return digitalRead(D1);
    else if(pinNumber == '2') return digitalRead(D2);
    else if(pinNumber == '3') return digitalRead(D3);
    else if(pinNumber == '4') return digitalRead(D4);
    else if(pinNumber == '5') return digitalRead(D5);
    else if(pinNumber == '6') return digitalRead(D6);
    else if(pinNumber == '7') return digitalRead(D7);
  } else if(pinType == 'A'){
    if(pinNumber == '0') return analogRead(A0);
    else if(pinNumber == '1') return analogRead(A1);
    else if(pinNumber == '2') return analogRead(A2);
    else if(pinNumber == '3') return analogRead(A3);
    else if(pinNumber == '4') return analogRead(A4);
    else if(pinNumber == '5') return analogRead(A5);
    else if(pinNumber == '6') return analogRead(A6);
    else if(pinNumber == '7') return analogRead(A7);
  } else {
    return 'x';
  }
}


// Web service which returns boolean or
// analog read value
int getState(String param)
{
  char pinNumber = param.charAt(1);
  char pinType = param.charAt(0);

  int pinValue = getPinValue(pinType, pinNumber);
  return pinValue;
}


// Web service which sets a new state
// to a specified pin and returns the
// new value
int setState(String param)
{
  char pinNumber = param.charAt(1);
  char pinType = param.charAt(0);

  String stringState = param.substring(3, param.length());
  int state = stringState.toInt();

  if(pinType == 'D'){
    if(pinNumber == '0') digitalWrite(D0, state);
    else if(pinNumber == '1') digitalWrite(D1, state);
    else if(pinNumber == '2') digitalWrite(D2, state);
    else if(pinNumber == '3') digitalWrite(D3, state);
    else if(pinNumber == '4') digitalWrite(D4, state);
    else if(pinNumber == '5') digitalWrite(D5, state);
    else if(pinNumber == '6') digitalWrite(D6, state);
    else if(pinNumber == '7') digitalWrite(D7, state);
  } else if(pinType == 'A'){
    if(pinNumber == '0') analogWrite(A0, state);
    else if(pinNumber == '1') analogWrite(A1, state);
    else if(pinNumber == '2') analogWrite(A2, state);
    else if(pinNumber == '3') analogWrite(A3, state);
    else if(pinNumber == '4') analogWrite(A4, state);
    else if(pinNumber == '5') analogWrite(A5, state);
    else if(pinNumber == '6') analogWrite(A6, state);
    else if(pinNumber == '7') analogWrite(A7, state);
  }

  return state;
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

  Spark.function("getState", getState);
  Spark.function("setState", setState);
}


void loop()
{

}
