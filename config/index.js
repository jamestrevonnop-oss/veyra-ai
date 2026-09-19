import "dotenv/config";

export const config = {
  provider: process.env.VEYRA_PROVIDER || "local",
  model: process.env.VEYRA_MODEL || "veyra-dev",
  apiKey: process.env.VEYRA_API_KEY || "",
  modelUrl:
    process.env.VEYRA_MODEL_URL ||
    "http://127.0.0.1:8000",
  port: Number(
    process.env.VEYRA_PORT || 3000
  )
};
