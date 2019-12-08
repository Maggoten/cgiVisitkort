<template>
  <div class="container">
    <div class="card bg-light">
      <div class="image" v-if="!editingEmployee">
        <img v-bind:src="employee.image" />
      </div>

      <div class="updateInfo" v-else>
        <input class="form-control" v-model="form.name" placeholder="Name" />
        <input class="form-control" v-model="form.surName" placeholder="Surname" />
        <input class="form-control" v-model="form.telephone" placeholder="Telephone" />
        <input class="form-control" v-model="form.email" placeholder="Email" />

        <div class="col justify-content-center">
          <div class="row justify-content-center">
            <img v-bind:src="form.image" />
          </div>
          <div class="justify-content-center">
            <input type="file" style="display: none" @change="onFileSelected" ref="fileInput" />
            <input
              type="button"
              class="btn btn-primary"
              value="Change image"
              @click="$refs.fileInput.click()"
              ref="fileInput2"
            />
          </div>
        </div>
      </div>

      <div class="info">
        <h1>{{ employee.name }} {{ employee.surName }}</h1>
        <p>Telephone:{{ employee.telephone }}</p>
        <p>E-mail:{{ employee.email }}</p>
      </div>

      <div class="buttons">
        <button
          @click="deleteEmployee(employee.id)"
          v-if="!editingEmployee"
          class="btn btn-danger"
        >Delete</button>
        <button @click="editingEmployee = !editingEmployee" v-else class="btn btn-primary">Cancel</button>
        <button @click="editEmployee" v-if="!editingEmployee" class="btn btn-primary">Edit</button>
        <button @click="saveEmployee(employee.id)" v-else class="btn btn-success">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const API_URL = "http://localhost:3000";
export default {
  props: ["employee"],

  data() {
    return {
      editingEmployee: false,
      form: {
        name: "",
        surName: "",
        telephone: "",
        email: "",
        image: "",
        id: ""
      }
    };
  },

  methods: {
    updateEmployee(id) {
      axios.patch(`${API_URL}/employee/${id}`, { name: "test1" });
    },

    deleteEmployee(id) {
      this.$emit("delete", id);
    },

    saveEmployee(id) {
      this.editingEmployee = !this.editingEmployee;
      this.$emit("edit", { data: this.form, id });
    },

    editEmployee() {
      this.editingEmployee = !this.editingEmployee;
      this.form.name = this.employee.name;
      this.form.surName = this.employee.surName;
      this.form.telephone = this.employee.telephone;
      this.form.email = this.employee.email;
      this.form.image = this.employee.image;
    },
    onFileSelected(e) {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onloadend = file => {
        this.form.image = reader.result;
        // eslint-disable-next-line no-console
        console.log(file);
      };
      reader.readAsDataURL(file);
    }
  }
};
</script>


<style>
img {
  width: 18%;
  height: auto;
  margin-top: 0.5vw;
}

.btn {
  margin: 0.2vw;
}
.card {
  margin: 0.5vw;
}
</style>