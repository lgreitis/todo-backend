// Possibly this comes from express, we need this for our error middleware
export interface SyntaxError {
  type: string;
  status: number;
  message: string;
}
