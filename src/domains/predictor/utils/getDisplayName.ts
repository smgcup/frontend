export function getDisplayName(user: {
  firstName: string;
  lastName: string;
  username: string;
}): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName.charAt(0)}.`;
  }
  return user.username;
}
