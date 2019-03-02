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

  favorite (id) {
    return this.client.post(`/api/favorites/create/${id}`)
      .then(res => res.data)
  }

  unfavorite (id) {
    return this.client.post(`/api/favorites/destroy/${id}`)
      .then(res => res.data)
  }

  retweet (id) {
    return this.client.post(`/api/statuses/retweet/${id}`)
      .then(res => res.data)
  }

  unretweet (id) {
    return this.client.post(`/api/statuses/unretweet/${id}`)
      .then(res => res.data)
  }
}

export default new ApiClient()
