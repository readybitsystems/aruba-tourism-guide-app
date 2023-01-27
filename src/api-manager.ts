import axios from 'axios';
import {baseUrl} from './globals';

function ApiManager(
  method: any,
  path: string,
  params: any = {},
  token?: string,
  headerOpt: any = {},
) {
  let header: any;
  if (token) {
    header = {
      headers: {
        Authorization: `Bearer ${token}`,
        ...headerOpt,
      },
    };
  } else {
    header = {
      headers: {
        'Content-Type': 'application/json',
        ...headerOpt,
      },
    };
  }
  return new Promise(function (myResolve, myReject) {
    if (method === 'post') {
      axios
        .post(baseUrl + path, params, header)
        .then((response: any) => {
          return myResolve(response);
        })
        .catch((err: any) => {
          return myReject(err);
        });
    } else {
      axios[method](baseUrl + path, header)
        .then((response: any) => {
          return myResolve(response);
        })
        .catch((err: any) => {
          return myReject(err);
        });
    }
  });
}

export default ApiManager;
