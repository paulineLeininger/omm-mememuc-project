import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// hook for get, post and delete requests to the backend API
const useFetch = () => {
  const token = useSelector((state) => state.token);

  /**
   * retrieves data from the backend through a get request
   *
   * @param {string} url the API url that you want to fetch
   * @return {Promise} a promise with the response JSON of the get request
   */

  const getRequest = (url) => {
    if (token !== null) {
      // console.log(url);
      return fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        if (response.status === 200) {
          console.log('SUCCESS');
          return response.json();
        }
        throw Error(`Error during Get Request. Code: ${response.status}`);
      });
    }
    return Promise.reject(new Error('No token found.'));
  };

  /**
   * post request to the backend
   *
   * @param {string} url the API url that you want to post to
   * @param {BodyInit} body the body of the post request (attention: needs to be in JSON format!)
   * @return {Promise} a promise of the request
   */
  const postRequest = (url, body) => {
    if (token !== null) {
      return fetch(url, {
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        if (response.status === 200 || response.status === 201) {
          console.log('SUCCESS');
          return response;
        }
        throw Error(`Error posting the request. Code: ${response.status}`);
      });
    }
    return Promise.reject(new Error('No token found.'));
  };

  /**
   * delete request to the backend
   *
   * @param {string} url the API url that you want to access to delete something
   * @param {BodyInit} body the body of the delete request (attention: needs to be in JSON format!)
   * @return {Promise} a promise of the request
   */
  const deleteRequest = (url, body) => {
    if (token !== null) {
      return fetch(url, {
        method: 'DELETE',
        body,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        if (response.status !== 200) {
          throw Error(`Error during delete request. Error code: ${response.status}`);
        } else {
          console.log('SUCCESS');
          return response;
        }
      });
    }
    return Promise.reject(new Error('No token found.'));
  };

  /**
   * patch request to the backend
   *
   * @param {string} url the API url that you want to access to patch something
   * @param {BodyInit} body the body of the patch request (attention: needs to be in JSON format!)
   * @return {Promise} a promise of the request
   */
  const patchRequest = (url, body) => {
    if (token !== null) {
      return fetch(url, {
        method: 'PATCH',
        body: body || {},
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        if (response.status === 200 || response.status === 201) {
          console.log('SUCCESS');
          return response;
        }
        throw Error(`Error during patch request. Error code: ${response.status}`);
      });
    }
    return Promise.reject(new Error('No token found.'));
  };

  return { getRequest, postRequest, deleteRequest, patchRequest };
};

export default useFetch;
