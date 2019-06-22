import { safeCredentials, handleErrors } from '../utils/fetchHelper';

export function createUser(username, email, password) {
  return fetch('api/users', safeCredentials({
      method: 'POST',
      body: JSON.stringify({
        user: {
          username: username,
          email: email,
          password: password
        }
      })
    }))
    .then(handleErrors);

};

export function signinUser(username, password) {
  return fetch('api/sessions', safeCredentials({
      method: 'POST',
      body: JSON.stringify({
        user: {
          username: username,
          password: password
        }
      })
    }))
    .then(handleErrors);

};

export function logoutUser() {
  return fetch('api/sessions', safeCredentials({
      method: 'DELETE'
    }))
    .then(handleErrors);

};

export function authenticate() {
  return fetch('api/authenticated', safeCredentials({
      method: 'GET'
    }))
    .then(handleErrors);

};

export function postTweet(msg) {
  return fetch('api/tweets', safeCredentials({
      method: 'POST',
      body: JSON.stringify({
        tweet: {
          message: msg
        }
      })
    }))
    .then(handleErrors)
    .then(res => {
      return { 'success': true };
    })
};

export function getTweets() {
  return fetch('api/tweets', safeCredentials({
      method: 'GET'
    }))
    .then(handleErrors)
    .then(res => {
      return res;
    })

};

export function deleteTweet(id) {
  return fetch(`api/tweets/${id}`, safeCredentials({
      method: 'DELETE'
    }))
    .then(handleErrors);
};
