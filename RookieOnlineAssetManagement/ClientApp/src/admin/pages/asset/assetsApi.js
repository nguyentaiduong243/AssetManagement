import axios from 'axios';

function getAssets(paramString) {
  return axios.get(`api/Assets?${paramString}`);
}

function getAsset(id) {
  return axios.get(`api/Assets/${id}`);
}

function getAssetDetails(id) {
  return axios.get(`api/Assets/${id}/Detail`);
}

// CREATE
function createAsset(assets) {
  return axios.post('api/Assets', assets);
}
// Get categories for creating new assets
function getCategories() {
  return axios.get('api/Categories');
}

function createCategories(category) {
  return axios.post('api/Categories', category);
}

// UPDATE
function updateAsset(assets, id) {
  return axios.put(`api/Assets/${id}`, {
    assetName: assets.assetName,
    specification: assets.specification,
    installedDate: assets.installedDate,
    state: assets.state,
  });
}

// DELETE
function deleteAsset(id) {
  return axios.delete(`api/Assets/${id}`);
}

export const getApiAssets = {
  getAssets,
  getAsset,
  getAssetDetails,
  createAsset,
  getCategories,
  createCategories,
  updateAsset,
  deleteAsset,
};
