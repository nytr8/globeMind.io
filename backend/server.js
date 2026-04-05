import app from "./src/app.js";
import connectDB from "./src/config/mongodb.js";

connectDB();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running at ${port}`);
});
