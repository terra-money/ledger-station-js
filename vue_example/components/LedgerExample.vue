<template>
  <div class="terraLedger">
    <br />
    <!--
        Commands
    -->
    <button @click="getVersion">
      Get Version
    </button>

    <button @click="appInfo">
      AppInfo
    </button>

    <button @click="getPublicKey">
      Get pubkey only
    </button>

    <button @click="getAddress">
      Get Address and Pubkey
    </button>

    <button @click="showAddress">
      Show Address and Pubkey
    </button>

    <button @click="signExampleTx">
      Sign Example TX
    </button>
    <!--
        Commands
    -->
    <ul id="ledger-status">
      <li v-for="item in ledgerStatus" :key="item.index">
        {{ item.msg }}
      </li>
    </ul>
  </div>
</template>

<script>
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import TerraApp from "../../src";
import { ERROR_CODE } from "../../src/constants";

const path = [44, 330, 0, 0, 0];

export default {
  name: "TerraLedger",
  props: {},
  data() {
    return {
      deviceLog: []
    };
  },
  computed: {
    ledgerStatus() {
      return this.deviceLog;
    },
  },
  methods: {
    log(msg) {
      this.deviceLog.push({
        index: this.deviceLog.length,
        msg,
      });
    },
    async getTransport() {
      let transport = null;

      this.log(`Trying to connect via WebUSB`)

      try {
        transport = await TransportWebUSB.create();
      } catch (e) {
        this.log(e);
      }

      return transport;
    },
    async getVersion() {
      this.deviceLog = [];

      // Given a transport (U2F/HIF/WebUSB) it is possible instantiate the app
      const transport = await this.getTransport();
      const app = new TerraApp(transport);
      await app.initialize();

      // now it is possible to access all commands in the app
      const response = await app.getVersion();
      if (response.return_code !== ERROR_CODE.NoError) {
        this.log(`Error [${response.return_code}] ${response.error_message}`);
        return;
      }

      this.log("Response received!");
      this.log(`App Version ${response.major}.${response.minor}.${response.patch}`);
      this.log(`Device Locked: ${response.device_locked}`);
      this.log(`Test mode: ${response.test_mode}`);
      this.log("Full response:");
      this.log(response);
    },
    async appInfo() {
      this.deviceLog = [];

      const transport = await this.getTransport();
      const app = new TerraApp(transport);
      await app.initialize();

      // now it is possible to access all commands in the app
      const response = await app.getInfo();
      if (response.return_code !== 0x9000) {
        this.log(`Error [${response.return_code}] ${response.error_message}`);
        return;
      }

      this.log("Response received!");
      this.log(response);
    },
    async getPublicKey() {
      this.deviceLog = [];

      const transport = await this.getTransport();
      const app = new TerraApp(transport);
      await app.initialize();

      let response = await app.getVersion();
      this.log(`App Version ${response.major}.${response.minor}.${response.patch}`);
      this.log(`Device Locked: ${response.device_locked}`);
      this.log(`Test mode: ${response.test_mode}`);

      // now it is possible to access all commands in the app
      response = await app.getPublicKey(path);
      if (response.return_code !== 0x9000) {
        this.log(`Error [${response.return_code}] ${response.error_message}`);
        return;
      }

      this.log("Response received!");
      this.log("Full response:");
      this.log(response);
    },
    async getAddress() {
      this.deviceLog = [];

      const transport = await this.getTransport();
      const app = new TerraApp(transport);
      await app.initialize();

      let response = await app.getVersion();
      this.log(`App Version ${response.major}.${response.minor}.${response.patch}`);
      this.log(`Device Locked: ${response.device_locked}`);
      this.log(`Test mode: ${response.test_mode}`);

      // now it is possible to access all commands in the app
      response = await app.getAddressAndPubKey(path, "terra");
      if (response.return_code !== 0x9000) {
        this.log(`Error [${response.return_code}] ${response.error_message}`);
        return;
      }

      this.log("Response received!");
      this.log("Full response:");
      this.log(response);
    },
    async showAddress() {
      this.deviceLog = [];

      const transport = await this.getTransport();
      const app = new TerraApp(transport);
      await app.initialize();

      let response = await app.getVersion();
      this.log(`App Version ${response.major}.${response.minor}.${response.patch}`);
      this.log(`Device Locked: ${response.device_locked}`);
      this.log(`Test mode: ${response.test_mode}`);

      // now it is possible to access all commands in the app
      this.log("Please click in the device");
      response = await app.showAddressAndPubKey(path, "terra");
      if (response.return_code !== ERROR_CODE.NoError) {
        this.log(`Error [${response.return_code}] ${response.error_message}`);
        return;
      }

      this.log("Response received!");
      this.log("Full response:");
      this.log(response);
    },
    async signExampleTx() {
      this.deviceLog = [];

      const transport = await this.getTransport();
      const app = new TerraApp(transport);
      await app.initialize();

      let response = await app.getVersion();
      this.log(`App Version ${response.major}.${response.minor}.${response.patch}`);
      this.log(`Device Locked: ${response.device_locked}`);
      this.log(`Test mode: ${response.test_mode}`);

      // now it is possible to access all commands in the app
      const message =
        '{"account_number":"6571","chain_id":"cosmoshub-2","fee":{"amount":[{"amount":"5000","denom":"uatom"}],"gas":"200000"},"memo":"Delegated with Ledger from union.market","msgs":[{"type":"cosmos-sdk/MsgDelegate","value":{"amount":{"amount":"1000000","denom":"uatom"},"delegator_address":"cosmos102hty0jv2s29lyc4u0tv97z9v298e24t3vwtpl","validator_address":"cosmosvaloper1grgelyng2v6v3t8z87wu3sxgt9m5s03xfytvz7"}}],"sequence":"0"}';
      response = await app.sign(path, message);

      this.log("Response received!");
      this.log("Full response:");
      this.log(response);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

button {
  padding: 5px;
  font-weight: bold;
  font-size: medium;
}

ul {
  padding: 10px;
  text-align: left;
  alignment: left;
  list-style-type: none;
  background: black;
  font-weight: bold;
  color: greenyellow;
}
</style>
