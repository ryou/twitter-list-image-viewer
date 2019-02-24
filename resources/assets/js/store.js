import Vue from 'vue'
import Vuex from 'vuex'
import { unionBy } from 'lodash'
import ApiClient from '@/libs/ApiClient'

Vue.use(Vuex)

const FETCH_COUNT = 200

export default new Vuex.Store({
  state: {
    user: undefined,
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
      return ApiClient.verifyCredentials()
        .then(user => commit('setUser', user))
    },
    fetchLists ({ commit }) {
      return ApiClient.fetchLists()
        .then(lists => commit('setLists', lists))
    },
    fetchStatuses ({ commit }, listId) {
      return ApiClient.fetchListStatuses(listId, { count: FETCH_COUNT })
        .then(statuses => {
          commit('setStatuses', { listId, statuses })
        })
    },
    fetchNewStatuses ({ getters, commit }, listId) {
      return ApiClient.fetchListStatuses(
        listId,
        { count: FETCH_COUNT, since_id: getters.newestStatusId(listId) }
      )
        .then(statuses => {
          commit('prependStatuses', { listId, statuses })
        })
    },
    fetchOldStatuses ({ getters, commit }, listId) {
      return ApiClient.fetchListStatuses(
        listId,
        { count: FETCH_COUNT, max_id: getters.oldestStatusId(listId) }
      )
        .then(statuses => {
          commit('appendStatuses', { listId, statuses })
        })
    },
  },
})
