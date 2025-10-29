import { Loader2 } from "lucide-react";

export default function FullScreenLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
      <div className="flex flex-col items-center">
        <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
        <span className="mt-3 text-gray-700 font-medium">Loading...</span>
      </div>
    </div>
  );
}
