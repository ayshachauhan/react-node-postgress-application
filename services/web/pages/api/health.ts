// pages/api/health.ts

import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Implement your health check logic here
  const currentTime = new Date();
  const status = {
    status: "ok",
    timestamp: currentTime.toISOString(),
  };

  res.status(200).json(status);
}
