/**
 * Create Server
 */
import { Server } from "./Server";

Server.initializeApp().then(() => {
  console.log(("  App is running at http://localhost:%d in %s mode"), Server.app.get("port"), Server.app.get("env"));
}).catch(err => {
  console.log(err);
});
