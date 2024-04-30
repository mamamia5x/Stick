document.getElementById("input").onkeyup = x => evaluate();

function evaluate() {
  let val = document.getElementById("input").value;
  let result = interpreter(val);
  document.getElementById("result").value = result[0] + "\n" + result[2] + " " + format(result[1]);
}
function format(x) {
  let result = "";
  for (var i of x) {
    result += "[" + i.value + ", \"" + i.ascii + "\"]";
  }
  return result;
}
class Number {
  constructor(value = 0) {
    this.value = value;
    this.ascii = this.get(this.value);
  }
  add() {
    this.value ++;
    if (this.value > 255) {
      this.value = 0;
    }
    this.ascii = this.get(this.value);
  }
  minus() {
    this.value --;
    if (this.value < 0) {
      this.value = 255;
    }
    this.ascii = this.get(this.value);
  }
  get() {
    return String.fromCharCode(this.value);
  }
}

function interpreter(tape) {
  let arr = [new Number()];
  let arrIndex = 0;
  let out = "";
  let skip = false;
  let index = -1;
  for (var j = 0; j < tape.length; j ++) {
    let i = tape[j];
    if (i == "[") {
      index = j;
      if (arr[arrIndex].value == 0) {
        skip = true;
      }
    }
    if (i == "]") {
      skip = false;
      if (arr[arrIndex].value != 0) {
        j = index;
      }
    }
    else if (!skip) {
      if (i == ">") {
        arrIndex ++;
        if (arrIndex > arr.length - 1) {
          arrIndex = arr.length - 1;
        }
      }
      if (i == "<") {
        arrIndex --;
        if (arrIndex < 0) {
          arrIndex = 0;
        }
      }
      if (i == "+") {
        arr[arrIndex].add();
      }
      if (i == "-") {
        arr[arrIndex].minus();
      }
      if (i == "*") {
        out += arr[arrIndex].get();
      }
      if (i == "!") {
        arr.unshift(new Number());
      }
      if (i == "?") {
        arr.unshift(new Number(arr[arrIndex].value))
      }
      if (i == "^") {
        arr.shift();
      }
      if (i == "~") {
        arr.splice(arrIndex, 1);
        if (arrIndex > arr.length - 1) {
          arrIndex = arr.length - 1;
        }
      }
    }
  }
  return [out, arr, arrIndex];
}

/*
?+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++?+++++++++++++*>*<+++++*->++*--*++<*>>*<*<+++++++++++++++++++++++++++++++++++*-----*>>*<++++++++++++++++*<?-----------*>++*<?++++*^*>+*>>*<?<<-------------------*^>>>*<-*-----------------<----*<----*+++*>>>*<*<--*<+*>+++++*<?++++*^--*--*
>>>?<<<++++++++++*^>>++++++++++++++++++*<+++*-------*<?+++*^*>+++++++++++*!<++++++++++++++++++++++++++++++++++++++++++++*^>>>*<?<<---------*^+++++++++++?+++++++++*^*>*>>*<<<?[-]++++++++++++++++++++++++++++++++++++++++++++++++++++++*>++++++++*------------*>>>>*<<<<++++++++++*>>>>*<<<<------?-------*>*<*---*^>+++++>~<?<+++*^>*<!++++++++++*^>>--------*<?>++++++++++*~<<----*?++*>>>>*<+++++++++*<<<+++++++*>*<--*[-]*^^-----?---*-->*<*
*/