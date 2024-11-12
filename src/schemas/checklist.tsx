export interface ChecklistSchema {
  [key: string]: {
    verbose_name: string;
    choices: string[];
    required: boolean;
  };
};

export interface ChecklistResponseType {
  choice: string;
  remark: string;
};
