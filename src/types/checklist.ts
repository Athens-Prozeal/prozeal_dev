export interface ChecklistResponseType {
  verbose_name: string;
  choice: string;
  remark: string;
}

export type NakedChecklistResponseType = {
  [key: string]: {
    choice?: string;
    remark?: string;
    verbose_name?: string;
  };
};
