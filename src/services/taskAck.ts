import axios from "axios";
import { env } from "../env";

export async function taskAck(args: {
  token: string;
  block: {
    network: string;
    height: string;
  };
  ruleGroupId: string;
  runnerId: string;
  errors?: {
    ruleId: string;
    error: string;
  }[];
}): Promise<{ ackId: string }> {
  const { token, block, ruleGroupId, errors } = args;
  const url = `${env.MANAGER_SERVICE.DOMAIN}${env.MANAGER_SERVICE.ACK_TASK_PATH}`;

  const { data } = await axios.post<{ ackId: string }>(
    url,
    {
      block: block,
      ruleGroupId: ruleGroupId,
      ...(errors?.length ? { errors } : {}),
    },
    {
      headers: {
        "X-API-KEY": token,
      },
    }
  );

  return data;
}
