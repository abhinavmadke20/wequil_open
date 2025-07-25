import cn from 'clsx';
import { NumberStats } from './number-stats';
import { HeroIcon, type IconName } from '../ui/hero-icon';
import type { JSX } from 'react';
import { preventBubbling } from '~/lib/utils';
import { ToolTip } from '../ui/tooltip';

type TweetOption = {
  tip: string;
  move?: number;
  stats?: number;
  iconName: IconName;
  disabled?: boolean;
  className: string;
  viewTweet?: boolean;
  iconClassName: string;
  onClick?: (...args: unknown[]) => unknown;
};

export function TweetOption({
  tip,
  move,
  stats,
  disabled,
  iconName,
  className,
  viewTweet,
  iconClassName,
  onClick
}: TweetOption): JSX.Element {
  return (
    <button
      className={cn(
        `group flex items-center gap-1.5 p-0 transition-none
         disabled:cursor-not-allowed inner:transition inner:duration-200`,
        disabled && 'cursor-not-allowed',
        className
      )}
      onClick={preventBubbling(onClick)}
    >
      <i
        className={cn(
          'relative rounded-full p-2 not-italic group-focus-visible:ring-2',
          iconClassName
        )}
      >
        <HeroIcon
          className={viewTweet ? 'h-6 w-6' : 'h-5 w-5'}
          iconName={iconName}
        />
        <ToolTip tip={tip} />
      </i>
      {!viewTweet && (
        <NumberStats move={move as number} stats={stats as number} />
      )}
    </button>
  );
}
