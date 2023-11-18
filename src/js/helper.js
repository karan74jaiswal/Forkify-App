// This file contains all the helper functions which are generally used in all over MVC architecture script files
import { TIMEOUT_SECONDS } from './config';

// Function for Throwing an error when The reponse got from API was not expected OK otherwise it will give response body as json.
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

/**
 *
 * @param {*} url
 * @param {*} uploadData
 * @param {*} errorMsg
 * @returns
 */
export const AJAX = async function (url, uploadData = undefined, errorMsg) {
  try {
    const res = await Promise.race([
      fetch(
        url,
        uploadData && {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        }
      ),
      timeout(TIMEOUT_SECONDS),
    ]);
    if (!res.ok) throw new Error(errorMsg || res.status);
    return await res.json();
  } catch (err) {
    throw err;
  }
};
