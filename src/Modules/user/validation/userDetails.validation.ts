import { searchUserQuery, updateUserParams } from '../dto/updateUser.dto';

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

export const searchUserValidate = (query: searchUserQuery) => {
  const { user } = query;
  if (!user || !user.trim().length) {
    return { error: { status: 422, message: 'User name is required' } };
  } else if (user.length < 3) {
    return { error: { status: 422, message: 'Minimum 3 char required' } };
  }

  return { user };
};
