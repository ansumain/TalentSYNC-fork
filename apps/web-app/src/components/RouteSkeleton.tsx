export const RouteSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Animated skeleton loaders */}
        <div className="w-32 h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
        <div className="w-24 h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default RouteSkeleton;
