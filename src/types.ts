export interface Question {
  id: string;
  text: string;
  type: "text" | "multiple-choice";
  options?: string[];
  correctOption?: string;
  points: number;
}

export interface Quiz {
  id: string;
  name: string;
  questions: Question[];
}
export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctOption?: string;
  points: number;
  type: "text" | "multiple-choice";
}

export interface Quiz {
  id: string;
  name: string;
  questions: Question[];
}
