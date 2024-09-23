interface Role {
  name: string;
  _id: string;
  rate: number;
  rateIncrease: number
}

export interface Settings {
  roles: Role[];
  projects: string[];
}
