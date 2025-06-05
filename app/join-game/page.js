import { Suspense } from 'react';
import JoinGameMain from '@/components/JoinGameScreenUI/JoinGameMain';

function JoinGameLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-6xl mb-4">⏳</div>
        <p className="text-white text-xl">Loading...</p>
      </div>
    </div>
  );
}

export default function JoinGamePage() {
  return (
    <Suspense fallback={<JoinGameLoading />}>
      <JoinGameMain />
    </Suspense>
  );
}
