<template>
  <div class="container d-flex justify-content-center align-items-center" style="height: 80vh;">
        <div class="card p-4 shadow-lg" style="width: 350px;">
            <h3 class="text-center mb-4">Login</h3>
            <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
            <form @submit.prevent="login">
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"  v-model="email" required>
                    <label for="floatingInput">Email address</label>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control" id="floatingPassword" placeholder="Password"  v-model="password" required>
                    <label for="floatingPassword">Password</label>
                </div>
                <button type="submit" class="btn btn-success w-100 mt-4">Login</button>
            </form>
            <div class="text-center mt-3">
                <a href="#" class="text-decoration-none">Forgot password?</a>
            </div>
        </div>
    </div>
      
</template>
  
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: "",
        password: "",
        errors: { email: "", password: "", general: "" },
      };
    },
    methods: {
      async login() {
        // Clear previous errors
        this.errors = { email: "", password: "", general: "" };
  
        try {
          const response = await axios.post("http://127.0.0.1:8000/api/login", {
            email: this.email,
            password: this.password,
          });
  
          // Store token in localStorage
          localStorage.setItem("token", response.data.token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
  
          // Redirect to main page
          this.$router.push("/mainPage");
        } catch (error) {
          // If validation errors from Laravel backend
          if (error.response?.status === 422) {
            const validationErrors = error.response.data.errors;
            this.errors.email = validationErrors?.email ? validationErrors.email[0] : "";
            this.errors.password = validationErrors?.password ? validationErrors.password[0] : "";
          } else {
            // General login failure message
            this.errors.general = error.response?.data?.message || "Invalid credentials!";
          }
        }
      },
    },
  };
  </script>