<script setup lang="ts" >
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const value = ref('i love java')
const size = ref(200)
const qrScanned = ref('')
const onDetect = (detectedCodes) => {
  console.log('QR Code detected:', detectedCodes[0]?.rawValue)
  qrScanned.value = detectedCodes[0]?.rawValue
}
</script>

<template>
  <qrcode-vue :value="value" :size="size" level="H" render-as="svg" />
  <p>{{ qrScanned }}</p>
  <QrcodeStream @detect="onDetect" />
</template>