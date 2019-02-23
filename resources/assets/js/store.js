import Vue from 'vue'
import Vuex from 'vuex'
import { unionBy } from 'lodash'
const axios = require('axios')

Vue.use(Vuex)

const FETCH_COUNT = 200

export default new Vuex.Store({
  state: {
    user: null,
    lists: [],
    statuses: {},
  },
  getters: {
    statusesOfList: state => listId => {
      const statuses = state.statuses[listId]
      if (statuses === undefined) return []
      return statuses
    },
    statusFromList: (state, getters) => (listId, statusId) => {
      const statuses = getters.statusesOfList(listId)
      return statuses.find(status => status.id_str === statusId)
    },
    newestStatusId: (state, getters) => listId => getters.statusesOfList(listId)[0].id_str,
    oldestStatusId: (state, getters) => listId => {
      const statuses = getters.statusesOfList(listId)
      return statuses[statuses.length - 1].id_str
    },
  },
  mutations: {
    setUser (state, userData) {
      state.user = userData
    },
    setLists (state, listsData) {
      state.lists = listsData
    },
    setStatuses (state, { listId, statuses }) {
      Vue.set(state.statuses, listId, statuses)
    },
    appendStatuses (state, { listId, statuses }) {
      const newStatuses = unionBy(state.statuses[listId], statuses, 'id_str')
      Vue.set(state.statuses, listId, newStatuses)
    },
    prependStatuses (state, { listId, statuses }) {
      const newStatuses = unionBy(statuses, state.statuses[listId], 'id_str')
      Vue.set(state.statuses, listId, newStatuses)
    },
  },
  actions: {
    fetchUserInfo ({ commit }) {
      return axios.get('/api/account/verify_credentials')
        .then(res => {
          commit('setUser', res.data)
        })
    },
    fetchLists ({ commit }) {
      return axios.get('/api/lists/list')
        .then(res => {
          commit('setLists', res.data)
        })
    },
    fetchStatuses ({ commit }, listId) {
      return axios.get(`/api/lists/statuses/${listId}`, { params: { count: FETCH_COUNT } })
        .then(res => {
          commit('setStatuses', {
            listId,
            statuses: res.data,
          })
        })
    },
    fetchNewStatuses ({ getters, commit }, listId) {
      axios.get(`/api/lists/statuses/${listId}`, { params: {
        count: FETCH_COUNT,
        since_id: getters.newestStatusId(listId),
      } })
        .then(res => {
          commit('prependStatuses', {
            listId,
            statuses: res.data,
          })
        })
    },
    fetchOldStatuses ({ getters, commit }, listId) {
      axios.get(`/api/lists/statuses/${listId}`, { params: {
        count: FETCH_COUNT,
        max_id: getters.oldestStatusId(listId),
      } })
        .then(res => {
          commit('appendStatuses', {
            listId,
            statuses: res.data,
          })
        })
    },
  },
})
