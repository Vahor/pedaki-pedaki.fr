import { cache } from '@pedaki/common/lib/cache/memory-cache';
import { env } from '~/env.mjs';
import * as z from 'zod';

interface JsonResponse {
  data: {
    attributes: {
      aggregate_status: MonitoringStatus;
    };
  };
}

export type MonitoringStatus = 'operational' | 'degraded' | 'downtime';

// zod schema to validate the response
const schema = z.object({
  attributes: z.object({
    aggregate_state: z.enum(['operational', 'degraded', 'downtime']),
  }),
});

export const getMonitoringStatus = async () => {
  return await cache(
    async () => {
      console.log('Fetching BetterStack status');
      const response = await fetch(
        `https://betteruptime.com/api/v2/status-pages/${env.BETTERUPTIME_STATUS_PAGE_ID}`,
        {
          headers: {
            Authorization: `Bearer ${env.BETTERUPTIME_API_TOKEN}`,
          },
          next: {
            revalidate: 20, // 20 seconds
          },
        },
      );
      const { data } = (await response.json()) as JsonResponse;
      console.log('Response from BetterStack: ', data);

      // validate the response
      const validated = schema.parse(data);

      const status = validated.attributes.aggregate_state;
      console.log(`BetterStack status: ${status}`);

      return status;
    },
    'monitoring:status',
    {
      ttl: 1000 * 30, // 30 seconds
      keepStale: true,
    },
  );
};