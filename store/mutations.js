export default {
  originalUsers (state, { value }) {
    state.originalUsers = value
  },
  users (state, { value }) {
    state.users = value
  },
  addUser (state, { value }) {
    state.users.unshift({
      _id: null,
      name: null,
      type: 'employee',
      performanceList: [
        {
          score: null,
          feedback: ''
        }
      ],
      assignedList: []
    })
  },
  name (state, { value }) {
    const { _id, name } = value
    const user = state.users.find((u) => {
      u._id = _id
    })
    user.name = name
  }
}
