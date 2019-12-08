<template>
  <div id="app">
    <div class="text-center">
      <img alt="CGI logo" src="./assets/logo.png" />
    </div>
    <div class="container">
      <form class="p-3 border bg-light">
        <div class="row">
          <div class="col">
            <input class="form-control" v-model="form.name" placeholder="Name" />
            <input class="form-control" v-model="form.surName" placeholder="Surname" />
            <input class="form-control" v-model="form.telephone" placeholder="Telephone" />
            <input class="form-control" v-model="form.email" placeholder="Email" />
          </div>
          <div class="col justify-content-center">
            <div class="row justify-content-center">
              <img v-bind:src="form.image" />
            </div>
            <div class="justify-content-center">
              <input type="file" style="display: none" @change="onFileSelected" ref="fileInput" />
              <input
                type="button"
                class="btn btn-primary"
                value="Choose image"
                @click="$refs.fileInput.click()"
                ref="fileInput2"
              />
            </div>
          </div>
        </div>
      </form>
      <div class="p-1">
        <button class="btn btn-primary" @click="addEmployee">add employee</button>
      </div>

      <div class="employeeList">
        <card
          v-for="employee in employees"
          :key="employee.id"
          :employee="employee"
          @delete="deleteEmployee"
          @edit="editEmployee($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { uuid } from "uuidv4";
import card from "./components/card.vue";
const API_URL = "http://localhost:3000";

export default {
  components: {
    card
  },

  data() {
    return {
      employees: [],
      form: {
        name: "",
        surName: "",
        telephone: "",
        email: "",
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJIAAACVCAIAAAA8HDRhAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAjSSURBVHhe7dJb0uWqDUDhM5A8Zh55zeAzlYyh42MtiBDGNjcbvPlK1bV/JDBI/defZUJrbFNaY5vSGtuU1timtMY2pTW2Ka2xTWn6sf2ViW2Tm+wZ9L41Tp/HBDemtU/hq2Mb95Z08T3cY0jDXY6ejYSbjWSUO9GhIhxxD3uKcMQA3r8KLbmNbe1w7m1se9Wbl6ANV6h+Cl+9QvVL3vk8Tz9F6Xu4xylKHzfi/2VKh8G10qh70HOf5Ilp1I2KW6ZR94iHPsbLEiiaATdOoKi/7l/iQQkUzYbbJ1DUU99v8I4jVMyMlxyhopteH+D6R6j4Cl51hIoOuhzNrY9Q8S287QgVrbU/l/tGSH8X74yQbqrxodw0QvrreG2EdDstT+SOIXK/hJeHyDXS7DhuFyL3e3h/iFwLbc7iXiFyv4ouhMhVa3AQNwqR+230IkSuTu0p3CVEbunWn6ojuEWI3OLQlxC5UuX7+X6I3BKiOyFyRQo38+UQueUIPQqRy1eyk2+GyC1pdCpELlObsZFYrtCvELkc2Xv4lEJiuYeuKSRy5O3hOwqJOv/693/kX/kRS61Pit4pJG7L2MAXFBJF/Kj8nxL6dxxS/AF0UCFxzwtjk+7rYdwPOeED6KBC4p671ZytkMhkxnA/ZK8c8rwen6aPCokbbpVyqkIik+9+ZchpD9BfNL/9yt91peimQuLKa2PzP3JjP6k789HzYE8+uqmQuHJdx3kKiUzmqYexHW5W4uC4bsznbgab80lLNRKnssfGaibzyMPgA1eT48RuzOfuhOyS7QV4tsPqqYsiTlJI5NAvTAWnOyarg0P7MN8y4e+WuiGnZJJjNRJpeWNjNZN5Wyr4Rroj+ncn/hNxcDnFFGzBKfk40WE17ayCMxQSmczbTmL7hFmJg0P7MN/yIc/XZFHXbMEp+eRMjURCxthYLWKeVxOc2If5lg66oJiCLTilCIc6rCYk0+xWSBQxzysOjuvDfCsO6YNZlJDtck4ZOVwjceTu2FgtpV9YGZzYh/mWj5OUD6nZjylErx1Wj0w2No7rxnwuNzilFL1WSESOE2xyWK1gnlccHNeN+VxWcEQdOu6wGnlobBvzyNzglM7MR7OCI+rQcYfVyEGCHQqJOv5t/p2plS1kUae23w/wn7sfsku216PjConQ9dhYbcE/MhU6u+94mv96VrC5EfrusBp6dGyeebYOXSC/H+ZvcifY0xR9d1gNvTM2z788/vEiGclh+KxU9kDfFRKKXaLQYfXH6PHokOwD6L7DqrLGduytgQm677CqrLGNiO47rCrBElUKieVZdF8h4ZyNjdXlDczAYdVZYxsUM3BYddbYBsUMHFadNbZBMQOHVWeNbVDMwGHVWWMbFDNQSOz+/wdJh9XlPUzCYXW3xjYuJuGwultjGxeTcFjdrbGNi0k4rO7W2MbFJBxWd2ts42ISDqu7NbZxMQmH1d0a27iYhMPqbo1tXEzCYXW3xjYuJuGwums/tv/+4586WF3yMQmH1V3jscmc/MDW5GowCYfVXfux6YGtmdVgEg6ru5Zj86MyQXrJxCQcVnfhHyFWc8iQ9Mxk5Xc0fC9jcFjdtR/bYZD+tLZPZgYOq07LsZl7x0HdF5mXSpArwgwcVp2WY9uYe8dB3beYN/ogXYQZOKw67ccm/6ZCyj7GvFEHFfmYgcOq03hswlzdBEVfYV6ng4oizMBh1Tkb24ZEPvMAHVR8hXmdDiry0X2FhBP9HWI1n3mADiq+wrxOBxX56L7DqvL02Eh/iHmgD9JF6L7DqtJrbBvzDB1UzM+8ywRF+ei+w6pyMbYNiXzmDTqo+ATzNB+k89F3hYRytBRiNZ95hgmKJmcepYOKfPTdYTXUcWwb8xIdVMzMvEgHFUXou8Nq6HpsGxL5zGPioG5O5i06qMhHxxUSocRqiNV85jGHQelszCtMUJSPjjusRvqOTZgnxUHdVMwTJGRdCsrQcYfVyK2xbUgU0Q87DOrmYe6vg4oi9FohEUknQqxWMM+T0OtSNj5/4cOgqAi9dlg9cndsGxKlzPPikBopHpC+5ElIcQG6rJA4cpoLsVrBP8w/Mg6pHE18ycM/99pCdNlhNSFjbBsSFfxTU0Hd2+Qm+mJ3QvYWoL8KiYSrdIjVOuapEnpdyl6h7+B/3wnZXoz+Oqym5Y1tQ6KCefBhUPogc4Hc4JQidFYhkXajIsRqNfNsE1Iglc/Q370fsrcSnXVYPZU9tg2JOvJm3YI4pLIr88Ws4Ig69FQhcepeUYREC6YXJqRAKpvTHyoITqlANxUSV0Yfmw4pll1N6MNzgyPq0E2FxJXbdRESLZiOpILqFsPTx+YGR1SjjwqJG3JKIyRaMK05DCnTxfvWDH5jZXBcBTqokLhnlLFtTGvuhOzS282K/BuHX08VpOLvc1uggwqJezKrIyQaMT0qjh5H7Rdsg94pJG7L3xAh0Yjv1yuRuoDcrQm6ppDI0WBsG3LtmK4VRM0hstf/2xD9CpHLUbTnCLl2fONO4rKgIPSnt38bolMhcplKtx0h15pv6PPBDVqgRyFy+Sp2HiHXgWlo2+Abu3ilHt0JkStSt/kIuT50T+V3fejT5Hdb9CVErlT1/iPkOpMu+3b7pusf/nfM7OqEjoTIVWhxxBFyv41eREhXaNNfrhMi96voQoR0nY5j25D+Pbw/Qrpay85ytRC5X8LLQ+QaaX1cAumv47UR0u10ODGB9HfxzgjppvocmkbF5/C8COnWup2bRsVX8KojVHTQt4lc/wgVM+MlR6jopv8HTlE0G26fQFFPDzWOByVQNANunEZdZ8+1jGelUTcqbplG3SOebhZPTKNuJNwsjboHvdMmnnuK0vdwj1OUPu7N7vD0K1Q/ha9eofolc/yn9tjTGqffw55XDXGJDS3Jx/4c7MzH/gEMdBVBhwbD5YYx3IUE3XobtxnPuDfzaOFT+OrY5rilR2tb4/R5zHdjg8bnYOfMvvCGH7TGNqU1timtsU1pjW1Ka2xTWmOb0J8//wN749AASrchhQAAAABJRU5ErkJggg==",
        id: ""
      }
    };
  },
  methods: {
    getEmployees() {
      axios
        .get(`${API_URL}/employee`)
        .then(response => (this.employees = response.data));
    },
    addEmployee() {
      axios
        .post(`${API_URL}/employee`, { ...this.form, id: uuid() })
        .then(() => this.getEmployees());

      const input = this.$refs.fileInput;
      input.type = "text";
      input.type = "file";

      this.form.name = "";
      this.form.surName = "";
      this.form.telephone = "";
      this.form.email = "";
      this.form.image = "";
    },
    deleteEmployee(id) {
      axios.delete(`${API_URL}/employee/${id}`).then(() => this.getEmployees());
    },
    editEmployee(e) {
      axios
        .put(`${API_URL}/employee/${e.id}`, e.data)
        .then(() => this.getEmployees());
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
  },

  mounted() {
    this.getEmployees();
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

form img {
  width: 18%;
  height: auto;
}
</style>
