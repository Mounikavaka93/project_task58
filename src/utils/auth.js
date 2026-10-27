export function authDestination(location) {
  const from = location.state?.from;
  const blocked = !from || from.startsWith('/login') || from.startsWith('/signup');
  return blocked ? '/dashboard' : from;
}
