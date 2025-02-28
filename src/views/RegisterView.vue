<template>
    <div class="container d-flex justify-content-center align-items-center" style="height: 80vh;">
        <div class="card p-4 shadow-lg" style="width: 350px;">
            <h3 class="text-center mb-4">Register</h3>
            <form @submit.prevent="register">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingName" placeholder="Name" v-model="model.user.name">
                    <label for="floatingName">Name</label>
                    <small v-if="errors.name" class="text-danger">{{ errors.name[0] }}</small>
                </div>

                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingEmail" placeholder="name@example.com" v-model="model.user.email">
                    <label for="floatingEmail">Email address</label>
                    <small v-if="errors.email" class="text-danger">{{ errors.email[0] }}</small>
                </div>

                <div class="form-floating">
                    <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="model.user.password">
                    <label for="floatingPassword">Password</label>
                    <small v-if="errors.password" class="text-danger">{{ errors.password[0] }}</small>
                </div>

                <button type="submit" class="btn btn-success w-100 mt-4">Register</button>
            </form>
            <div class="text-center mt-3">
                <router-link to="/login" class="text-decoration-none">Have an account?</router-link>
            </div>
        </div>
    </div> 
</template>

<script>
import axios from 'axios';

export default {
    name: 'userCreate',
    data() {
        return {
            model: {
                user: {
                    name: '',
                    email: '',
                    password: '',
                }
            },
            errors: {} // Store validation errors
        };
    },
    methods: {
        async register() {
            try {
                const response = await axios.post("http://127.0.0.1:8000/api/register", this.model.user);

                // Store the token
                localStorage.setItem("token", response.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                alert("Registration successful! Redirecting to the main page...");

                // Redirect to main page
                this.$router.push("/mainPage");
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 422) {
                        // Laravel validation error handling
                        this.errors = error.response.data.errors;
                    } else if (error.response.status === 500) {
                        // General registration failure
                        alert(error.response.data.message || "Something went wrong while registering.");
                    }
                } else {
                    alert("Network error. Please try again.");
                }
            }
        }
    }
};
</script>
