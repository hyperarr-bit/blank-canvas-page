import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const equals = () => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    const result = calculate(previousValue, inputValue, operation);
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const btnClass = (type: "number" | "operation" | "clear" | "equals") => {
    const base = "calculator-btn";
    switch (type) {
      case "number": return `${base} bg-card hover:bg-muted text-foreground border border-border`;
      case "operation": return `${base} bg-secondary hover:bg-secondary/80 text-foreground`;
      case "clear": return `${base} bg-foreground hover:bg-foreground/90 text-background`;
      case "equals": return `${base} bg-primary hover:bg-primary/90 text-primary-foreground`;
    }
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-lg border border-border animate-fade-in">
      <div className="bg-muted rounded-lg p-3 mb-4 text-right">
        <div className="text-2xl font-mono font-bold truncate">
          {parseFloat(display).toLocaleString("pt-BR", { maximumFractionDigits: 8 })}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button className={btnClass("clear")} onClick={clear}>AC</Button>
        <Button className={btnClass("operation")} onClick={() => inputDigit("(")}>(</Button>
        <Button className={btnClass("operation")} onClick={() => inputDigit(")")}>)</Button>
        <Button className={btnClass("operation")} onClick={() => performOperation("/")}>÷</Button>

        <Button className={btnClass("number")} onClick={() => inputDigit("7")}>7</Button>
        <Button className={btnClass("number")} onClick={() => inputDigit("8")}>8</Button>
        <Button className={btnClass("number")} onClick={() => inputDigit("9")}>9</Button>
        <Button className={btnClass("operation")} onClick={() => performOperation("*")}>×</Button>

        <Button className={btnClass("number")} onClick={() => inputDigit("4")}>4</Button>
        <Button className={btnClass("number")} onClick={() => inputDigit("5")}>5</Button>
        <Button className={btnClass("number")} onClick={() => inputDigit("6")}>6</Button>
        <Button className={btnClass("operation")} onClick={() => performOperation("-")}>−</Button>

        <Button className={btnClass("number")} onClick={() => inputDigit("1")}>1</Button>
        <Button className={btnClass("number")} onClick={() => inputDigit("2")}>2</Button>
        <Button className={btnClass("number")} onClick={() => inputDigit("3")}>3</Button>
        <Button className={btnClass("operation")} onClick={() => performOperation("+")}>+</Button>

        <Button className={btnClass("number")} onClick={inputDecimal}>.</Button>
        <Button className={btnClass("number")} onClick={() => inputDigit("0")}>0</Button>
        <Button className={btnClass("equals")} onClick={equals} >=</Button>
        <Button className={btnClass("operation")} onClick={() => setDisplay(String(parseFloat(display) / 100))}>%</Button>
      </div>
    </div>
  );
};
