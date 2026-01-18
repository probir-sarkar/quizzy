import type { Context } from "aws-lambda";

interface LambdaEvent {
  length: number;
  width: number;
}

export const handler = async (event: LambdaEvent, context: Context) => {
  const length = event.length;
  const width = event.width;
  let area = calculateArea(length, width);
  console.log(`The area is ${area}`);

  console.log("CloudWatch log group: ", context.logGroupName);

  let data = {
    area: area
  };
  return JSON.stringify(data);

  interface CalculateAreaParams {
    length: number;
    width: number;
  }

  function calculateArea(length: number, width: number): number;
  function calculateArea(params: CalculateAreaParams): number;
  function calculateArea(...args: any[]): number {
    if (args.length === 2) {
      const [length, width] = args;
      return length * width;
    }
    const params = args[0] as CalculateAreaParams;
    return params.length * params.width;
  }
};
