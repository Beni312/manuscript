/**
 * Create Server
 */
import { AddressInfo } from 'net';
import { Server } from "./Server";

Server.initializeApp().then((server) => {
  const address: AddressInfo = server.address() as AddressInfo;
  console.log(("App is running at http://localhost:%d"), address.port);
}).catch(err => {
  console.log(err);
});
