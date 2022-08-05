import { addContactsParams } from '../dto/userDetails.dto';

export const checkContactUsername = (contact: addContactsParams) => {
  const { currentusername, addingusername } = contact;
  if (!currentusername) {
    return { error: { status: 422, message: 'Current user is required' } };
  } else if (!addingusername) {
    return { error: { status: 422, message: 'Adding user is required' } };
  }

  return { user: contact };
};
