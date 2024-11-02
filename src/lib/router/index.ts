import { Router } from "express";
import { readdirSync } from "fs";
import path from "path";

const PATH_ROUTER = path.join("src", "features");
const router = Router();

readdirSync(PATH_ROUTER).filter((folderName) => {
  console.log(`The /${folderName} route is being loaded`);
  import(
    path.join("..", "..", "features", `${folderName}`, `${folderName}.route`)
  ).then((moduleRouter) => {
    router.use(`/api/v1/${folderName}`, moduleRouter.router);
  });
});

export { router };
