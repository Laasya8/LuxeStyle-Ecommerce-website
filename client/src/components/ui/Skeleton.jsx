import { clsx } from 'clsx';

export const Skeleton = ({ className }) => (
  <div className={clsx('skeleton rounded-lg', className)} />
);

export const ProductCardSkeleton = () => (
  <div className="flex flex-col gap-3">
    <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/3" />
  </div>
);
