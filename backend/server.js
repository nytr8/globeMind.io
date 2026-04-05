import app from "./src/app.js";
import connectDB from "./src/config/mongodb.js";

connectDB();

const url = process.env.PORT || process.env.BACKEND_URL;

app.listen(url, () => {
  console.log(`server running at ${url}`);
});
