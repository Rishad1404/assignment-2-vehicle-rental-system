import config from "./config";
import app from "./app";

const port = config.port;


app.listen(port, () => {
  console.log(`Vehicle Rental System listening on port ${port}`)
})
