<template>
  <v-container fluid>
    <template v-if="isLoaded && hasEmployee">
      <h1 class="display-2">
        {{ pageTitle }}
      </h1>
      <v-row>
        <v-col>
          <v-card v-for="employee in employeeList" :key="employee._id" class="mb-10">
            <v-card-title class="headline" @click="goEmployee(employee.name)">
              {{ `${employee.name} (Please click here)` }}
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
      v-if="isLoaded"
      v-show="!isEmployee"
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
                :disabled="isEmployee"
              />
            </v-col>
            <v-col v-if="otherEmployeeNameList.length" cols="12" sm="6" md="6">
              <label>Accessible Performance List</label>
              <v-select
                v-model="userForm.content.accessibleList"
                :items="otherEmployeeNameList"
                item-text="name"
                return-object
                chips
                multiple
                dense
                outlined
                :disabled="isEmployee"
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
                      :disabled="isEmployee"
                      class="mt-5"
                      dense
                    />
                  </td>
                  <td>
                    <v-text-field
                      v-model="performance.feedback"
                      :disabled="!isEmployee || !isMyData(userForm.content.name)"
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
            v-show="!isEmployee"
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
        text: 'reviews',
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
        type: 'employee',
        performanceList: [
          {
            score: null,
            feedback: null
          }
        ],
        accessibleList: []
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
      if (this.isEmployee) {
        const user = this.$store.state.users.filter((u) => {
          return u.name === this.employeeName
        })
        const myAcessibleList = user[0].accessibleList

        const readableEmployees = [user[0]]
        myAcessibleList.forEach((item) => {
          this.$store.state.users.forEach((user) => {
            if (user._id === item._id) {
              readableEmployees.push(user)
            }
          })
        })
        return readableEmployees
      } else {
        return this.$store.state.users
      }
    },
    hasEmployee () {
      return this.employeeList.length
    },
    defaultContent () {
      return {
        name: null,
        type: 'employee',
        performanceList: [
          {
            score: null,
            feedback: null
          }
        ],
        accessibleList: []
      }
    },
    employeeName () {
      return this.$route.params.employeeName
    },
    isEmployee () {
      return !!this.$route.params.employeeName
    },
    pageTitle () {
      return this.employeeName ? `I'm ${this.employeeName}` : 'Admin View - TOP'
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
    },
    goEmployee (employeeName) {
      this.$router.push({ path: `/employee/${employeeName}` })
    },
    isMyData (name) {
      return this.employeeName === name
    }
  }
}
</script>
