import express from "express";
import { json } from "body-parser";
import "express-async-errors"; //handles asynchronous errors as syncronous
import cookieSession from "cookie-session";
import { currentUser } from "@itcontext/ticketing-common";
import { errorHandler, NotFoundError } from "@itcontext/ticketing-common";

//routes
import { createOrderRouter } from "./routes/new";
import { getOrderRouter } from "./routes/show";
import { getOrdersRouter } from "./routes/getIndex";
import { deleteOrderRouter } from "./routes/delete";


const app = express();
// express trust nginx proxy
app.set("trust proxy", true);

app.use(json());
app.use(
    cookieSession({
        // turn out the encryption of the cookie (JWT is already encrypted) to simplify reading it accross multiple services running different languages
        signed: false,
        // require https connection to use the cookie while not under test env
        secure: process.env.NODE_ENV !== "test",
    })
);
app.use(currentUser)

app.use(createOrderRouter)
app.use(getOrderRouter)
app.use(getOrdersRouter)
app.use(deleteOrderRouter)

// app.all listens to all type of http requests; thanks to express-async-errors we don't have to handle async errors ourselves
app.all("*", async () => {
    throw new NotFoundError(); // this doesn't have to be wrapped in next() because express-async-errors (check imports above)
});

app.use(errorHandler);

export { app };