import { LedgerKey } from "../src";
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';

async function main() {
  const lk = await LedgerKey.create({ transport: await TransportNodeHid.create(60 * 1000) });
  console.log(`accAddress: ${lk.accAddress('terra')} / publicKey: ${JSON.stringify(lk.publicKey)}`);

  console.log(lk.getAppInfo());
  console.log(lk.getAppVersion());
  console.log(await lk.getAppDeviceInfo());
  console.log(await lk.getAppPublicKey());
  console.log(await lk.getAppAddressAndPubKey('terra'));
  console.log(await lk.showAddressAndPubKey('terra'));

}

main().catch(console.error);

