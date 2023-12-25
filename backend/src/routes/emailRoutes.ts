import express from "express";

import * as EmailController from "../controllers/EmailController";
import isAuth from "../middleware/isAuth";

const routes = express.Router();

routes.post("/saveTemplate", isAuth, EmailController.save);

routes.post("/saveCampaignEmail", isAuth, EmailController.saveCampaignEmail);

routes.get("/emails", isAuth, EmailController.index);

routes.get("/email/:id", isAuth, EmailController.show);

routes.post("/email/verify/:id", isAuth, EmailController.VerifyDNS);

routes.post("/keys", isAuth, EmailController.generateKey);


export default routes;
