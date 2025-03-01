<template>
    <div class="container mt-4">
        <h2 class="text-center">Manage Expenses</h2>

        <!-- Expense Form -->
        <div class="card p-4 shadow-sm">
            <h5 class="text-center mb-3">{{ isEditing ? "Update Expense" : "Add Expense" }}</h5>
            <form @submit.prevent="isEditing ? updateExpense() : addExpense()">
                <div class="mb-3">
                    <label for="expenseType" class="form-label">Expense Type</label>
                    <select v-model="expense.type" class="form-select" required>
                        <option value="gas">Gas</option>
                        <option value="food">Food</option>
                        <option value="hotel">Hotel</option>
                        <option value="allowance">Allowance</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="amount" class="form-label">Amount</label>
                    <input type="number" class="form-control" v-model="expense.amount" required />
                </div>

                <div class="mb-3">
                    <label for="remarks" class="form-label">Remarks</label>
                    <textarea class="form-control" v-model="expense.remarks" rows="2" required></textarea>
                </div>

                <button type="submit" class="btn btn-success w-100">
                    {{ isEditing ? "Update Expense" : "Add Expense" }}
                </button>
                <button v-if="isEditing" type="button" class="btn btn-secondary w-100 mt-2" @click="cancelEdit">
                    Cancel
                </button>
            </form>
        </div>

        <!-- Expenses Table -->
        <div class="mt-4">
            <h5 class="text-center">Expense List</h5>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Remarks</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(expense, index) in expenses" :key="expense.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ expense.expense_type }}</td>
                        <td>₱{{ expense.amount }}</td>
                        <td>{{ expense.remarks }}</td>
                        <td>
                            <button class="btn btn-primary btn-sm me-2" @click="editExpense(expense)">Edit</button>
                            <button class="btn btn-danger btn-sm" @click="deleteExpense(expense.id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    props: ["ticketID"], // Receive ticket ID from the route
    data() {
        return {
            localTicketID: null, // Store ticket ID locally
            expense: {
                id: null,
                type: "",
                amount: "",
                remarks: ""
            },
            expenses: [], // Store fetched expenses
            isEditing: false // Flag to track if editing
        };
    },
    mounted() {
        // Store ticket ID from prop into a local data variable
        this.localTicketID = this.$route.params.ticketID;
        console.log("Extracted Ticket ID:", this.localTicketID);

        this.fetchExpenses(); // Load expenses when the component is mounted
    },
    methods: {
        // Fetch Expenses
        async fetchExpenses() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/expenses/${this.localTicketID}`);
                this.expenses = response.data.data; 
                console.log("Fetched Expenses:", this.expenses); 
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        },

        // Add Expense
        async addExpense() {
            console.log("Ticket ID in Add Expense:", this.localTicketID);
            try {
                const response = await axios.post("http://127.0.0.1:8000/api/expenses", {
                    ticket_id: this.localTicketID, 
                    expense_type: this.expense.type,
                    amount: this.expense.amount,
                    remarks: this.expense.remarks
                });

                this.expenses.push(response.data); // Add new expense to table
                this.resetForm();
                this.fetchExpenses(); 
            } catch (error) {
                console.error("Error adding expense:", error);
            }
        },

        // Delete Expense
        async deleteExpense(expenseID) {
            if (!confirm("Are you sure you want to delete this expense?")) return;

            try {
                await axios.delete(`http://127.0.0.1:8000/api/expenses/${expenseID}`);
                this.expenses = this.expenses.filter(exp => exp.id !== expenseID); // Remove from table
            } catch (error) {
                console.error("Error deleting expense:", error);
            }
        },

        // Edit Expense - Prefill form with selected row
        editExpense(expense) {
            this.expense = {
                id: expense.id,
                type: expense.expense_type,
                amount: expense.amount,
                remarks: expense.remarks
            };
            this.isEditing = true; // Switch to edit mode
        },

        // Update Expense - Send PUT request to update existing record
        async updateExpense() {
            if (!this.expense.id) return;

            try {
                await axios.put(`http://127.0.0.1:8000/api/expenses/${this.expense.id}`, {
                    expense_type: this.expense.type,
                    amount: this.expense.amount,
                    remarks: this.expense.remarks
                });

                this.fetchExpenses(); // Refresh the list
                this.resetForm();
            } catch (error) {
                console.error("Error updating expense:", error);
            }
        },

        // Cancel Editing - Reset Form
        cancelEdit() {
            this.resetForm();
        },

        // Reset Form to Default State
        resetForm() {
            this.expense = { id: null, type: "", amount: "", remarks: "" };
            this.isEditing = false;
        }
    }
};
</script>


<style scoped>
.table {
    text-align: center;
}
</style>
