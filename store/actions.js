import axios from 'axios'
import { isEqual, reduce } from 'lodash'

export default {
  async getAllUser ({ commit }) {
    const res = await axios.get('http://localhost:3000/user')
    const { data } = res
    commit('originalUsers', { value: data })
    commit('users', { value: data })
  },

  async postUser ({ state, dispatch }, { value }) {
    const { user } = value
    await axios.post('http://localhost:3000/user', {
      user
    })
    await dispatch('getAllUser')
  },

  async patchUser ({ state, dispatch }, { value }) {
    const after = value.user
    const { _id } = after
    const before = state.users.find((u) => {
      return u._id === after._id
    })
    const diffProps = reduce(before, function (result, value, key) {
      return isEqual(value, after[key]) ? result : result.concat(key)
    }, [])
    const diffObj = diffProps.reduce((obj, prop) => {
      obj[prop] = after[prop]
      return obj
    }, {})

    if (Object.keys(diffObj).length) {
      await axios.patch(`http://localhost:3000/user/${_id}`, diffObj)
      await dispatch('getAllUser')
    }
  },

  async deleteUser ({ dispatch }, { value }) {
    const { _id } = value
    await axios.delete(`http://localhost:3000/user/${_id}`)
    await dispatch('getAllUser')
  }
}
