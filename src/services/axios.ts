import _axios from 'axios';

export const axios = _axios.create({
  timeout: 6_000,
  timeoutErrorMessage: `Range Runner Custom Axios Timeout Error: Request timed out after 6 seconds`,
});
