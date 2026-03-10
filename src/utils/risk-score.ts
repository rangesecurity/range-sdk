import { env } from '../env';
import { axios } from '../services/axios';

export async function fetchRangeRiskScore({
  address,
  network,
}: {
  address: string;
  network: string;
}) {
  try {
    const res = await axios.get(
      `${env.RANGE_API_HOST}/v1/risk/address?address=${address}&network=${network}`,
      {
        headers: {
          'X-API-KEY': env.RANGE_API_KEY,
        },
      }
    );

    return res.data.riskScore;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
