export type updateUserQueryDto = {
  updatename?: string;
  updateprofile?: boolean;
  removeprofile?: boolean;
};

type fileParams = {
  path: string;
};

export type updateUserParams = {
  file: fileParams;
  query: updateUserQueryDto;
  username: string;
};
