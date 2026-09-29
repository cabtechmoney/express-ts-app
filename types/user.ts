export interface CreateProjectDto {
  title: string;
  description?: string;
  budget: number;
  status: string;
  deadline?: Date;
}