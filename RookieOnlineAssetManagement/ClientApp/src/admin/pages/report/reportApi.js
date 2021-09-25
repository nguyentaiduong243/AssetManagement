import axios from 'axios';

function getReports(paramString) {
  return axios.get(`api/Reports?${paramString}`);
}

export const getApiReport = {
  getReports,
};
