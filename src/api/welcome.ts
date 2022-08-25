import { Response, request } from "express";

export async function welcome(req: Request, res: Response) {
  res.send("Hello selamat datang di templete cerdik-tes");
}
