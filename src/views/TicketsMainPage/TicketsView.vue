<template>
    <div class="container mt-5">
      <!-- Logout Button (Top Left) -->
      <button class="btn btn-danger position-absolute top-0 start-0 m-3" @click="logout">Logout</button>
  
      <h2 class="text-center">My Tickets</h2>
      
      <!-- Create Ticket Button -->
      <button class="btn btn-primary mb-3" @click="showModal = true">Create Ticket</button>
  
      <!-- Ticket Table -->
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
  
      <!-- Create Ticket Modal -->
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal-content">
          <h4>Create New Ticket</h4>
          <form @submit.prevent="createTicket">
            <div class="form-group">
              <label>Plate Number</label>
              <input type="text" v-model="newTicket.plate_number" class="form-control" required />
            </div>
            <div class="form-group">
              <label>Car Type</label>
              <input type="text" v-model="newTicket.car_type" class="form-control" required />
            </div>
            <div class="form-group">
              <label>Trip Details</label>
              <input type="text" v-model="newTicket.trip_details" class="form-control" required />
            </div>
            <div class="form-group">
              <label>Passenger Count</label>
              <input type="number" v-model="newTicket.passenger_count" class="form-control" required />
            </div>
            <div class="form-group">
              <label>Departure Time</label>
              <input type="datetime-local" v-model="newTicket.departure_time" class="form-control" required />
            </div>
            <div class="form-group">
              <label>Expected Return Time</label>
              <input type="datetime-local" v-model="newTicket.expected_return_time" class="form-control" required />
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-success mt-3">Submit</button>
              <button type="button" class="btn btn-secondary mt-3 ms-2" @click="showModal = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        userID: null,
        tickets: [],
        showModal: false,
        newTicket: {
          user_id: null,
          plate_number: "",
          car_type: "",
          trip_details: "",
          passenger_count: "",
          departure_time: "",
          expected_return_time: ""
        }
      };
    },
    mounted() {
      this.getUserID();
    },
    methods: {
      async getUserID() {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/user", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          this.userID = response.data.id;
          this.newTicket.user_id = this.userID;
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
          this.tickets = response.data.data;
        } catch (error) {
          console.error("Error fetching tickets:", error);
        }
      },
      async createTicket() {
        try {
          await axios.post("http://127.0.0.1:8000/api/tickets", this.newTicket, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          this.showModal = false;
          this.fetchTickets();
        } catch (error) {
          console.error("Error creating ticket:", error);
        }
      },
      async logout() {
        try {
          await axios.post("http://127.0.0.1:8000/api/logout", {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          localStorage.removeItem("token");
          this.$router.push("/login");
        } catch (error) {
          console.error("Error logging out:", error);
        }
      },
      viewTicket(ticketID) {
        this.$router.push(`/viewTicket/${ticketID}`);
      },
      addExpense(ticketID) {
        this.$router.push(`/expenses/${ticketID}`);
      },
      statusClass(status) {
        return {
          "badge bg-warning text-dark": status === "pending",
          "badge bg-primary": status === "departed",
          "badge bg-success": status === "arrived"
        };
      }
    }
  };
  </script>
  
  <style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
  }
  </style>
  