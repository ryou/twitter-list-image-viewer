const axios = require('axios')

class ApiClient {
  constructor () {
    this.client = axios.create()
  }

  verifyCredentials () {
    return this.client.get('/api/account/verify_credentials')
      .then(res => res.data)
  }

  fetchLists () {
    return this.client.get('/api/lists/list')
      .then(res => res.data)
  }

  fetchListStatuses (listId, params = {}) {
    return this.client.get(`/api/lists/statuses/${listId}`, { params })
      .then(res => res.data)
  }
}

export default new ApiClient()
