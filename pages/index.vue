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
                @click="dialogTrigger(employee)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn class="ma-2" tile large color="red" icon>
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
            <v-col cols="12" sm="6" md="6">
              <label>Assigned Members</label>
              <v-select
                v-model="userForm.content.assignedList"
                :items="employeeNameList"
                item-text="name"
                return-object
                chips
                multiple
                dense
                outlined
              />
            </v-col>
          </v-row>
          <v-row class="scoped-text-field">
            <v-col cols="4">
              <label>score</label>
              <span
                v-for="(performance, index) in userForm.content.performanceList"
                :key="index"
              >
                <v-text-field
                  v-model="performance.score"
                  dense
                  outlined
                />
              </span>
            </v-col>
          </v-row>
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
        name: null,
        type: null,
        performanceList: [], // includes score and feedback
        assignedList: []
      },
      index: -1
    },
    dialog: false
  }),
  computed: {
    employeeList () {
      // TODO only employee
      return this.$store.state.users
    },
    employeeNameList () {
      if (!this.isLoaded) { return }
      // TODO only employee
      const tmp = []
      this.$store.state.users.forEach((user) => {
        tmp.push({
          name: user.name,
          _id: user._id
        })
      })
      return tmp
    },
    hasEmployee () {
      return this.employeeList.length
    },
    defaultContent () {
      return {
        name: null,
        type: null,
        performanceList: [], // includes score and feedback
        assignedList: []
      }
    }
  },
  async created () {
    await this.$store.dispatch('getAllUser')
    this.isLoaded = true
  },
  methods: {
    dialogTrigger (employee) {
      this.userForm.content = JSON.parse(JSON.stringify(employee))
      this.dialog = true
    },
    async save () {
      await this.$store.dispatch('patchUser', {
        value: {
          user: this.userForm.content
        }
      })
      this.close()
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.userForm.content = { ...this.defaultContent }
        this.userForm.index = -1
      }, 300)
    }
  }
}
</script>
