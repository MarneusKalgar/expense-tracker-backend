import { Express, Request, Response } from "express";

export const serverSetup = async (app: Express) => {
  app.use("/", (req: Request, res: Response) => {
    res.send("Server is running");
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
};
