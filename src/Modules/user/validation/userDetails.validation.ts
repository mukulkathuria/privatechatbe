import { updateUserParams } from '../dto/updateUser.dto';

export const userDetailsValidate = (userDetails: updateUserParams) => {
  const { file, query, username } = userDetails;
  if (!username || !username.trim().length) {
    return { error: { status: 422, message: 'Username is required' } };
  } else if (
    !query ||
    (!query.removeprofile && !query.updatename && !query.updateprofile)
  ) {
    return { error: { status: 422, message: 'Invalid query' } };
  }
  const { updateprofile } = query;
  if (updateprofile && (!file || !file.path)) {
    return { error: { status: 422, message: 'Invalid File' } };
  }

  return { data: true };
};
