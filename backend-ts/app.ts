/**
 * Create Server
 */
import { Server } from "./Server";

Server.initializeApp().then((server) => {
  console.log(("  App is running at http://localhost:%d"), server.address().port);
}).catch(err => {
  console.log(err);
});
