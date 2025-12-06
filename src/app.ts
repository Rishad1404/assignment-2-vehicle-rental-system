import express, {  Request, Response } from "express";
import initDB from "./config/db";
import logger from "./middleware/logger";


const app = express();


// parser
app.use(express.json());


// Initializing DataBase
initDB();


app.get("/", logger, (req: Request, res: Response) => {
  res.send("This is assignment no.2 !");
});



app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app

