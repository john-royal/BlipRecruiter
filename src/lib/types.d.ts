export interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
}

export interface Application {
  job: string;
  name: string;
  email: string;
  resume: File;
}
