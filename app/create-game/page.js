
import { Suspense } from 'react';
import CreateGameMain from '@/components/CreateGameScreenUI/CreateGameMain';

function CreateGameLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-500 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-6xl mb-4">⏳</div>
        <p className="text-white text-xl">Loading...</p>
      </div>
    </div>
  );
}

export default function CreateGamePage() {
  return (
    <Suspense fallback={<CreateGameLoading />}>
      <CreateGameMain />
    </Suspense>
  );
}
