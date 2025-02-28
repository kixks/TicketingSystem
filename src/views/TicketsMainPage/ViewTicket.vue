<template>
    <div class="container mt-4">
        <h2 class="text-center">Manage Ticket</h2>

        <div class="row">
            <!-- Ticket Form Section (Left Side) -->
            <div class="col-md-6">
                <div class="card p-4 shadow-sm">
                    <h5 class="text-center mb-3">Ticket Details</h5>
                    <form @submit.prevent="updateTicket">
                        <div class="mb-3">
                            <label class="form-label">Ticket ID</label>
                            <input type="text" class="form-control" v-model="ticket.id" readonly />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Plate Number</label>
                            <input type="text" class="form-control" v-model="ticket.plate_number" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Car Type</label>
                            <input type="text" class="form-control" v-model="ticket.car_type" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Trip Details</label>
                            <textarea class="form-control" v-model="ticket.trip_details" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Passenger Count</label>
                            <input type="number" class="form-control" v-model="ticket.passenger_count" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Departure Time</label>
                            <input step="any" type="datetime-local" class="form-control" v-model="ticket.departure_time" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Expected Return Time</label>
                            <input type="datetime-local" class="form-control" v-model="ticket.expected_return_time" required />
                        </div>
                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-danger" @click="deleteTicket">Delete</button>
                            <button type="submit" class="btn btn-success">Update</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- QR Code Section (Right Side) -->
            <div class="col-md-6 d-flex align-items-center justify-content-center">
                <div v-if="qrCodeValue" class="text-center">
                    <h5>Ticket QR Code</h5>
                    <qrcode-vue :value="qrCodeValue" :size="200" level="H" render-as="svg" />
                    <p class="mt-2 text-muted">{{ qrCodeValue }}</p> <!-- Display QR code value -->
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import QrcodeVue from "qrcode.vue";

export default {
    components: { QrcodeVue },
    props: ["ticketID"],
    data() {
        return {
            ticket: {
                id: "",
                plate_number: "",
                car_type: "",
                trip_details: "",
                passenger_count: "",
                departure_time: "",
                expected_return_time: "",
                qr_code: "",
            },
            qrCodeValue: "",
        };
    },
    mounted() {
        this.localTicketID = this.$route.params.ticketID;
        console.log("Extracted Ticket ID:", this.localTicketID);
        this.fetchTicket();
    },
    methods: {
        async fetchTicket() {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/tickets");

                console.log("API Response:", response.data);

                const ticketID = Number(this.localTicketID);
                const foundTicket = response.data.data.find(ticket => ticket.id === ticketID);

                if (!foundTicket) {
                    console.warn("No ticket found with the given ID:", ticketID);
                    return;
                }

                this.ticket = foundTicket;
                this.qrCodeValue = foundTicket.qr_code;

                console.log("Fetched Ticket:", this.ticket);
                console.log("QR Code Value:", this.qrCodeValue);
            } catch (error) {
                console.error("Error fetching ticket:", error);
            }
        },
        async updateTicket() {
            try {
                await axios.put(`http://127.0.0.1:8000/api/tickets/${this.localTicketID}`, {
                    plate_number: this.ticket.plate_number,
                    car_type: this.ticket.car_type,
                    trip_details: this.ticket.trip_details,
                    passenger_count: this.ticket.passenger_count,
                    departure_time: this.ticket.departure_time,
                    expected_return_time: this.ticket.expected_return_time,
                });

                alert("Ticket updated successfully!");
                this.$router.push("/mainPage"); 
            } catch (error) {
                console.error("Error updating ticket:", error);
            }
        },
        async deleteTicket() {
            if (!confirm("Are you sure you want to delete this ticket?")) return;
            try {
                await axios.delete(`http://127.0.0.1:8000/api/tickets/${this.localTicketID}`);
                alert("Ticket deleted successfully!");
                this.$router.push("/mainPage"); 
            } catch (error) {
                console.error("Error deleting ticket:", error);
            }
        }
    }
};
</script>

