import express, { Request, Response } from "express";
import { detectObjects } from "./controllers/objectsController";
import { detectPlace } from "./controllers/placesController";

const app = express();
const port = process.env.PORT || 8000;

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/place", detectPlace);
app.post("/objects", detectObjects);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
