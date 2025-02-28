<template>
    <div class="container d-flex justify-content-center align-items-center" style="height: 80vh;">
        <div class="card p-4 shadow-lg" style="width: 350px;">
            <h3 class="text-center mb-4">Register</h3>
            <form>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingInput" placeholder="Name">
                    <label for="floatingInput">Name</label>
                </div>

                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                    <label for="floatingInput">Email address</label>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
                    <label for="floatingPassword">Password</label>
                </div>
                <button type="submit" class="btn btn-success w-100 mt-4">Register</button>
            </form>
            <div class="text-center mt-3">
                <a href="#" class="text-decoration-none">Have a account??</a>
            </div>
        </div>
    </div> 
</template>