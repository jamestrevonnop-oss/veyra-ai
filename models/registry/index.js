import { MockModel } from "../providers/mock.js";
import { VeyraLocalModel } from "../providers/veyra-local.js";

const providers = {
  mock: () => new MockModel(),
  local: () => new VeyraLocalModel(),
  veyra: () => new VeyraLocalModel()
};

export function getModel(provider) {
  const normalized = String(provider || "local").toLowerCase();
  const factory = providers[normalized];

  if (!factory) {
    throw new Error(
      `Unknown Veyra provider: ${provider}`
    );
  }

  return factory();
}
