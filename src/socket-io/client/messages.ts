const Messages = {
  FAILED_REGISTER: `Failed to register! Try clearing your browsers cache`,
  FAILED_MESSAGE: 'Failed to send message!',
  FAILED_SIGNUP: 'Failed to create account!',
  FAILED_SIGNIN: 'Failed to sign in!',
  FAILED_INVITE: `Couldn't invite you!`,

  TYPE_ERROR: (name: string, expected: string, actual: string) =>
    Messages.ERROR(name, 'of type', expected, actual),

  ERROR: (name: string, statement: string, expected: string, actual: string) =>
    `Expected '${name}' to be ${statement} '${expected}', got '${actual}'`
}

export default Messages
