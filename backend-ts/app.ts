/**
 * Create Server
 */
// @ts-ignore (hide: has no exported member issue)
import { AddressInfo } from 'net';
import { Server } from "./Server";

Server.initializeApp().then((server) => {
  const address: AddressInfo = server.address() as AddressInfo;

  const logo = require('asciiart-logo');

  console.log(logo({
    name: '  Manuscript  ',
    font: 'Slant',
    lineChars: 100,
    padding: 4,
    margin: 2,
    borderColor: 'grey',
    logoColor: 'bold-green',
    textColor: 'green',
  })
    .emptyLine()
    .right('version 1.0')
    .emptyLine()
    .center("App is running at http://localhost:" + address.port)
    .render());

}).catch(err => {
  console.log(err);
});
