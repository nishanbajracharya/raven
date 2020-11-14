import { v4 as uuidv4 } from 'uuid';

function getUser() {
  let user = localStorage.getItem('raven-user');

  if (!user) {
    user = uuidv4();

    localStorage.setItem('raven-user', user);
  }

  return user;
}

export default getUser;