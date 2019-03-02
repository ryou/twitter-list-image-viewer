import Vue from 'vue'
import Vuex from 'vuex'
import { forEach, unionBy } from 'lodash'
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
      if (statuses === undefined) {
        return []
      }
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
    setFavorite (state, { idStr, favorited }) {
      forEach(state.statuses, statuses => {
        const target = statuses.find(status => status.id_str === idStr)
        if (target !== undefined) {
          target.favorited = favorited
        }
      })
    },
    setRetweet (state, { idStr, retweeted }) {
      forEach(state.statuses, statuses => {
        const target = statuses.find(status => status.id_str === idStr)
        if (target !== undefined) {
          target.retweeted = retweeted
        }
      })
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
    favorite ({ commit }, idStr) {
      commit('setFavorite', {
        idStr,
        favorited: true,
      })
      return ApiClient.favorite(idStr)
        .catch(() => {
          commit('setFavorite', {
            idStr,
            favorited: false,
          })
        })
    },
    unfavorite ({ commit }, idStr) {
      commit('setFavorite', {
        idStr,
        favorited: false,
      })
      return ApiClient.unfavorite(idStr)
        .catch(() => {
          commit('setFavorite', {
            idStr,
            favorited: true,
          })
        })
    },
    retweet ({ commit }, idStr) {
      commit('setRetweet', {
        idStr,
        retweeted: true,
      })
      return ApiClient.retweet(idStr)
        .catch(() => {
          commit('setRetweet', {
            idStr,
            retweeted: false,
          })
        })
    },
    unretweet ({ commit }, idStr) {
      commit('setRetweet', {
        idStr,
        retweeted: false,
      })
      return ApiClient.unretweet(idStr)
        .catch(() => {
          commit('setRetweet', {
            idStr,
            retweeted: true,
          })
        })
    },
  },
})
