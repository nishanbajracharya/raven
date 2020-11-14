function generateMethod(method) {
  return function (url, body) {
    return fetch(`/api${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body && JSON.stringify(body),
    }).then((response) => response.json());
  }
}

export default {
  get: generateMethod('GET'),
  put: generateMethod('PUT'),
  post: generateMethod('POST'),
  delete: generateMethod('DELETE'),
};
