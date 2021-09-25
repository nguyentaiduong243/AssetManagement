import axios from 'axios';
// Get an user
function getbyid(id) {
  return axios.get(`api/Users/${id}`);
}

// Get users
function getall(paramString) {
  return axios.get(`api/Users?${paramString}`);
}

// Create a new user
function create(users) {
  return axios.post('api/Users', users);
}

//Edit an user

function edit(users, id) {
  return axios.put(`api/Users/${id}`, {
    doB: users.doB,
    joinedDate: users.joinedDate,
    gender: users.gender,
    roleType: users.roleType,
  });
}

function disable(id) {
  return axios.put(`api/Users/disable/${id}`);
}

export const useCreateUser = {
  create,
  getbyid,
  edit,
  disable,
  getall,
};
