<template>
  <v-container fluid>
    <template v-if="isLoaded && hasEmployee">
      <v-row>
        <v-col>
          <v-card v-for="employee in employeeList" :key="employee._id" class="mb-10">
            <v-card-title class="headline">
              Name: {{ employee.name }}
            </v-card-title>

            <v-data-table
              :headers="headers"
              :items="employee.performanceList"
              hide-default-footer
            />
            <v-card-actions>
              <v-spacer />
              <v-btn
                class="ma-2"
                tile
                large
                color="blue"
                icon
                @click="editUser(employee)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                class="ma-2"
                tile
                large
                color="red"
                icon
                @click="deleteUser(employee._id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template v-else-if="isLoaded">
      no employee data
    </template>
    <v-btn
      color="pink"
      dark
      top
      right
      fab
      class="mr-10 mt-12"
      @click="addUser()"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="1000px" persistent>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <label>Name</label>
              <v-text-field
                v-model="userForm.content.name"
                dense
                outlined
              />
            </v-col>
            <v-col v-if="otherEmployeeNameList.length" cols="12" sm="6" md="6">
              <label>Assigned Members</label>
              <v-select
                v-model="userForm.content.assignedList"
                :items="otherEmployeeNameList"
                item-text="name"
                return-object
                chips
                multiple
                dense
                outlined
              />
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            hide-default-footer
          >
            <template v-slot:body>
              <tbody>
                <tr
                  v-for="(performance, index) in userForm.content.performanceList"
                  :key="index"
                >
                  <td>
                    <v-text-field
                      v-model="performance.score"
                      class="mt-5"
                      dense
                    />
                  </td>
                  <td>
                    <v-text-field
                      v-model="performance.feedback"
                      class="mt-5"
                      dense
                    />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
          <div class="flex-grow-1" />
          <v-btn
            class="mr-1"
            color="blue"
            dark
            fab
            @click="addPerformance()"
          >
            <v-icon>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            class="mr-1"
            color="grey"
            depressed
            dark
            width="120"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn color="green darken-1" depressed dark width="120" @click="save()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

export default {
  components: {
  },
  data: () => ({
    isLoaded: false,
    headers: [
      {
        text: 'score',
        align: 'left',
        value: 'score'
      },
      {
        text: 'feedback',
        align: 'left',
        value: 'feedback'
      }
    ],
    userForm: {
      content: {
        _id: null,
        name: null,
        type: null,
        performanceList: [
          {
            score: null,
            feedback: null
          }
        ], // includes score and feedback
        assignedList: []
      }
    },
    performance: {
      score: null,
      feedback: null
    },
    dialog: false,
    otherEmployeeNameList: []
  }),
  computed: {
    employeeList () {
      // TODO only employee
      return this.$store.state.users
    },
    hasEmployee () {
      return this.employeeList.length
    },
    defaultContent () {
      return {
        name: null,
        type: null,
        performanceList: [
          {
            score: null,
            feedback: null
          }
        ], // includes score and feedback
        assignedList: []
      }
    }
  },
  async created () {
    await this.$store.dispatch('getAllUser')
    this.isLoaded = true
  },
  methods: {
    updateOtherEmployeeNameList (_id) {
      const tmp = []
      this.$store.state.users.forEach((user) => {
        if (user._id !== _id) {
          tmp.push({
            name: user.name,
            _id: user._id
          })
        }
      })
      this.otherEmployeeNameList = tmp
    },
    addPerformance () {
      this.userForm.content.performanceList.push(JSON.parse(JSON.stringify(this.performance)))
    },
    addUser () {
      this.updateOtherEmployeeNameList(this.userForm.content._id)
      this.dialog = true
    },
    editUser (employee) {
      this.userForm.content = JSON.parse(JSON.stringify(employee))
      this.updateOtherEmployeeNameList(this.userForm.content._id)
      this.dialog = true
    },
    async save () {
      if (this.userForm.content._id) {
        await this.$store.dispatch('patchUser', {
          value: {
            user: this.userForm.content
          }
        })
      } else {
        await this.$store.dispatch('postUser', {
          value: {
            user: this.userForm.content
          }
        })
      }
      this.close()
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.userForm.content = JSON.parse(JSON.stringify(this.defaultContent))
      }, 300)
    },
    async deleteUser (_id) {
      await this.$store.dispatch('deleteUser', {
        value: {
          _id
        }
      })
    }
  }
}
</script>
