import { useMemo, useEffect, type JSX } from 'react';
import { doc } from 'firebase/firestore';
import type { LoadedParents } from './tweet-with-parent';
import { getRandomId } from '~/lib/random';
import { useDocument } from '~/lib/hooks/useDocument';
import { tweetsCollection } from '~/lib/firebase/collections';
import { Tweet } from './tweet';

type TweetParentProps = {
  parentId: string;
  loadedParents: LoadedParents;
  addParentId: (parentId: string, componentId: string) => void;
};

export function TweetParent({
  parentId,
  loadedParents,
  addParentId
}: TweetParentProps): JSX.Element | null {
  const componentId = useMemo(getRandomId, []);

  const isParentAlreadyLoaded = loadedParents.some(
    (child) => child.childId === componentId
  );

  const { data, loading } = useDocument(doc(tweetsCollection, parentId), {
    includeUser: true,
    allowNull: true,
    disabled: isParentAlreadyLoaded
  });

  useEffect(() => {
    addParentId(parentId, componentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !isParentAlreadyLoaded || !data) return null;

  return <Tweet parentTweet {...data} />;
}
