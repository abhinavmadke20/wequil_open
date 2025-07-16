import { AnimatePresence, motion } from 'framer-motion';
import type { JSX } from 'react';
import { formatNumber } from '~/lib/date';
import { getStatsMove } from '~/lib/utils';

type NumberStatsProps = {
  move: number;
  stats: number;
  alwaysShowStats?: boolean;
};

export function NumberStats({
  move,
  stats,
  alwaysShowStats
}: NumberStatsProps): JSX.Element {
  return (
    <div className='overflow-hidden'>
      <AnimatePresence mode='wait' initial={false}>
        {(alwaysShowStats || !!stats) && (
          <motion.p className='text-sm' {...getStatsMove(move)} key={stats}>
            {formatNumber(stats)}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
