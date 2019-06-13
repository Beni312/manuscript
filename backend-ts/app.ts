/**
 * Create Server
 */
import { Server } from "./Server";

Server.initializeApp().then(() => {
}).catch(err => {
  console.log(err);
});
