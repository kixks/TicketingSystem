<template>
  <div class="container mt-5">
      <h2 class="text-center">My Tickets</h2>
      <table class="table table-bordered table-striped">
          <thead class="table-dark">
              <tr>
                  <th>ID</th>
                  <th>Plate Number</th>
                  <th>Car Type</th>
                  <th>Trip Details</th>
                  <th>Passenger Count</th>
                  <th>Departure Time</th>
                  <th>Return Time</th>
                  <th>Status</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="ticket in tickets" :key="ticket.id">
                  <td>{{ ticket.id }}</td>
                  <td>{{ ticket.plate_number }}</td>
                  <td>{{ ticket.car_type }}</td>
                  <td>{{ ticket.trip_details }}</td>
                  <td>{{ ticket.passenger_count }}</td>
                  <td>{{ ticket.departure_time }}</td>
                  <td>{{ ticket.expected_return_time }}</td>
                  <td>
                      <span :class="statusClass(ticket.status)">
                          {{ ticket.status }}
                      </span>
                  </td>
                  <td>
                      <button class="btn btn-info btn-sm me-2" @click="viewTicket(ticket.id)">
                          View
                      </button>
                      <button class="btn btn-warning btn-sm" @click="addExpense(ticket.id)">
                          Expense
                      </button>
                  </td>
              </tr>
          </tbody>
      </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            userID: null,  // Logged-in user's ID
            tickets: []    // Fetched tickets
        };
    },
    mounted() {
        this.getUserID(); // Get user ID and fetch tickets
    },
    methods: {
        async getUserID() {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/user", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                this.userID = response.data.id;
                this.fetchTickets();
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        },
        async fetchTickets() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/tickets/${this.userID}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                this.tickets = response.data.data; // Since it's a resource collection, access `data`
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        },
        viewTicket(ticketID) {
            // Handle viewing the ticket (e.g., redirect to another page)
            this.$router.push(`/tickets/${ticketID}`);
        },
        addExpense(ticketID) {
            // Handle adding expense logic
            alert(`Adding expense for ticket ID: ${ticketID}`);
        },
        statusClass(status) {
            return {
                "badge bg-success": status === "approved",
                "badge bg-warning text-dark": status === "pending",
                "badge bg-danger": status === "rejected",
            };
        }
    }
};
</script>