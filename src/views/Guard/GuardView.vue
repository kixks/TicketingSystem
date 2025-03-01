<script setup lang="ts">
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import axios from 'axios';

// Reactive state variables
const qrScanned = ref('')
const paused = ref(false)
const showScanConfirmation = ref(false)
const ticketid = ref('')
const scannedAt = ref('')
const status = ref('')
const guardName = ref('') // ✅ Bind this to the input field

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Function to handle QR detection
const onDetect = async (detectedCodes: any) => {
  if (!detectedCodes.length) return

  const newValue = detectedCodes[0]?.rawValue
  
  if (newValue && newValue !== qrScanned.value) {
    qrScanned.value = newValue
    console.log('QR Code detected:', newValue)
    console.log(qrScanned.value);
    console.log(guardName.value)
    paused.value = true
    await timeout(500)
    paused.value = false
  }
}

const submitData = async () => {
  if (!qrScanned.value) {
    alert("No QR code scanned!");
    return;
  }

  if (!guardName.value) { 
    alert("Please enter the Security Officer's Name.");
    return;
  }

  try {
    if (status.value === 'Departed') {
      console.log('2nd entry');

      try {
        const response2 = await axios.put("http://127.0.0.1:8000/api/qrlogs", {
          qr_code: qrScanned.value
        });

        console.log("PUT Request Successful:", response2.data);

      } catch (error: any) {
        console.error("Error in PUT request:", error);
        status.value = "Error updating QR log";
      }
    }
    
    const response = await axios.post("http://127.0.0.1:8000/api/qrlogs", {
      qr_code: qrScanned.value,           
      security_officer_name: guardName.value
    });

    console.log("API Response:", response.data);

    status.value = response.data.QRlogs.status;
    ticketid.value = response.data.QRlogs.ticket_id;
    scannedAt.value = response.data.QRlogs.scanned_at;

    await new Promise(resolve => setTimeout(resolve, 100));

  } catch (error: any) {
    if (error.response && error.response.status === 422) {
      console.error("Validation Error:", error.response.data);
      alert("Validation failed: " + JSON.stringify(error.response.data.errors));
    } else {
      console.error("Error sending data:", error);
      status.value = "Error logging QR code";
    }
  }
};


const onCameraOn = () => {
  showScanConfirmation.value = false
}

const onCameraOff = () => {
  showScanConfirmation.value = true
}
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card w-50 p-4 shadow">
      <div class="card-body">
        <div class="mb-4">
          <p><strong>Ticket ID:</strong> {{ ticketid }}</p>
          <p><strong>Scanned At:</strong> {{ scannedAt }}</p>
          <p><strong>Status:</strong> {{ status }}</p>
        </div>

        <div class="d-flex flex-column align-items-center">
          <div class="w-75">
            <QrcodeStream 
              @detect="onDetect" 
              @camera-on="onCameraOn"
              @camera-off="onCameraOff"
              :paused="paused"
            />
          </div>

          <div class="form-floating w-75 mt-3">
            <input v-model="guardName" type="text" class="form-control" id="floatingName" placeholder="Guard Name">
            <label for="floatingName">Guard Name</label>
          </div>

          <button @click="submitData" class="btn btn-primary w-75 mt-3">Submit Data</button>
        </div>
      </div>
    </div>
  </div>
</template>
