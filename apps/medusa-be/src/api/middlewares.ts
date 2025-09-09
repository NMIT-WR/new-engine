import {defineMiddlewares} from "@medusajs/medusa"
import {storeProducersRoutesMiddlewares} from "./store/producers/middlewares";
import {storeRoutesMiddlewares} from "./store/middlewares";
import {authRoutesMiddlewares} from "./auth/middlewares";

export default defineMiddlewares({
    routes: [
        ...authRoutesMiddlewares,
        ...storeRoutesMiddlewares,
        ...storeProducersRoutesMiddlewares,
    ],
})