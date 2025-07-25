import { useEffect, useRef, useState, type JSX } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'clsx';
import type { MotionProps } from 'framer-motion';
import type { AppImageData, ImagesPreview } from '~/lib/types/file';
import { useModal } from '~/lib/hooks/useModal';
import { Modal } from '../modal/modal';
import { ImageModal } from '../modal/image-modal';
import { preventBubbling } from '~/lib/utils';
import { Button } from '../ui/button';
import { HeroIcon } from '../ui/hero-icon';
import { NextImage } from '../ui/next-image';
import { ToolTip } from '../ui/tooltip';


type ImagePreviewProps = {
  tweet?: boolean;
  viewTweet?: boolean;
  previewCount: number;
  imagesPreview: ImagesPreview;
  removeImage?: (targetId: string) => () => void;
};

const variants: MotionProps = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  },
  exit: { opacity: 0, scale: 0.5 },
  transition: { type: 'spring', duration: 0.5 }
};

type PostImageBorderRadius = Record<number, string[]>;

const postImageBorderRadius: Readonly<PostImageBorderRadius> = {
  1: ['rounded-2xl'],
  2: ['rounded-tl-2xl rounded-bl-2xl', 'rounded-tr-2xl rounded-br-2xl'],
  3: ['rounded-tl-2xl rounded-bl-2xl', 'rounded-tr-2xl', 'rounded-br-2xl'],
  4: ['rounded-tl-2xl', 'rounded-tr-2xl', 'rounded-bl-2xl', 'rounded-br-2xl']
};

const optimizeImageUrl = (src: string): string => {
  // Only optimize if it's not already a wsrv URL
  if (src.includes('wsrv.nl')) return src;
  
  // Use wsrv to optimize with JPEG format and il option
  return `https://wsrv.nl/?url=${encodeURIComponent(src)}&output=jpg&il`;
};

export function ImagePreview({
  tweet,
  viewTweet,
  previewCount,
  imagesPreview,
  removeImage
}: ImagePreviewProps): JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<AppImageData | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const { open, openModal, closeModal } = useModal();

  useEffect(() => {
    const imageData = imagesPreview[selectedIndex];
    setSelectedImage(imageData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  const handleVideoStop = (): void => {
    if (videoRef.current) videoRef.current.pause();
  };

  const handleSelectedImage = (index: number, isVideo?: boolean) => () => {
    if (isVideo) handleVideoStop();

    setSelectedIndex(index);
    openModal();
  };

  const handleNextIndex = (type: 'prev' | 'next') => () => {
    const nextIndex =
      type === 'prev'
        ? selectedIndex === 0
          ? previewCount - 1
          : selectedIndex - 1
        : selectedIndex === previewCount - 1
        ? 0
        : selectedIndex + 1;

    setSelectedIndex(nextIndex);
  };

  const isTweet = tweet ?? viewTweet;

  return (
    <div
      className={cn(
        'grid grid-cols-2 grid-rows-2 rounded-2xl',
        viewTweet
          ? 'h-[51vw] xs:h-[42vw] md:h-[305px]'
          : 'h-[42vw] xs:h-[37vw] md:h-[271px]',
        isTweet ? 'mt-2 gap-0.5' : 'gap-3'
      )}
    >
      <Modal
        modalClassName={cn(
          'flex justify-center w-full items-center relative',
          isTweet && 'h-full'
        )}
        open={open}
        closeModal={closeModal}
        closePanelOnClick
      >
        <ImageModal
          tweet={isTweet}
          imageData={selectedImage as AppImageData}
          previewCount={previewCount}
          selectedIndex={selectedIndex}
        handleNextIndex={handleNextIndex}
        />
      </Modal>
      <AnimatePresence mode='popLayout'>
        {imagesPreview.map(({ id, src, alt }, index) => {
          const isVideo = imagesPreview[index].type?.includes('video');
          const optimizedSrc = optimizeImageUrl(src);

          return (
            <motion.button
              key={id}
              type='button'
              className={cn(
                'accent-tab group relative transition-shadow',
                isTweet
                  ? postImageBorderRadius[previewCount][index]
                  : 'rounded-2xl',
                {
                  'col-span-2 row-span-2': previewCount === 1,
                  'row-span-2':
                    previewCount === 2 || (index === 0 && previewCount === 3)
                }
              )}
              {...variants}
              onClick={preventBubbling(handleSelectedImage(index, isVideo))}
              layout={!isTweet ? true : false}
              
            >
              {isVideo ? (
                <>
                  <Button
                    className='visible absolute top-0 right-0 z-10 -translate-x-1 translate-y-1 
                               bg-light-primary/75 p-1 opacity-0 backdrop-blur-sm transition
                               hover:bg-image-preview-hover/75 group-hover:opacity-100 xs:invisible'
                  >
                    <HeroIcon className='h-5 w-5' iconName='ArrowUpRightIcon' />
                  </Button>
                  <video
                    ref={videoRef}
                    className={cn(
                      `relative h-full w-full cursor-pointer transition 
                       hover:brightness-75 hover:duration-200`,
                      isTweet
                        ? postImageBorderRadius[previewCount][index]
                        : 'rounded-2xl'
                    )}
                    src={src}
                    controls
                    muted
                  />
                </>
              ) : (
                <NextImage
                  className='relative h-full w-full cursor-pointer transition 
                             hover:brightness-75 hover:duration-200'
                  imgClassName={cn(
                    isTweet
                      ? postImageBorderRadius[previewCount][index]
                      : 'rounded-2xl'
                  )}
                  previewCount={previewCount}
                  // layout='fill'
                  src={optimizedSrc}
                  alt={alt}
                  useSkeleton={isTweet}
                />
              )}
              {removeImage && (
                <Button
                  className='group absolute top-0 left-0 translate-x-1 translate-y-1
                           bg-light-primary/75 p-1 backdrop-blur-sm 
                           hover:bg-image-preview-hover/75'
                  onClick={preventBubbling(removeImage(id))}
                >
                  <HeroIcon
                    className='h-5 w-5 text-white'
                    iconName='XMarkIcon'
                  />
                  <ToolTip className='translate-y-2' tip='Remove' />
                </Button>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
