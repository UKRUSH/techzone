import { GlobalLoader } from "@/components/ui/loading";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <GlobalLoader isLoading={true} variant="dots" className="scale-150" />
        <h2 className="text-xl font-semibold text-yellow-400">Loading Deals...</h2>
        <p className="text-gray-400">Finding the best offers for you</p>
      </div>
    </div>
  );
}
