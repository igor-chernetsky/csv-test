export function getStatus(callback) {
  fetch(location.origin.concat('/metric'))
    .then((response) => response.json())
    .then((res) => {
      callback(res);
    });
  return null;
}