'use client';

import React, { Suspense } from 'react';
import GameRoomPageClient from './GameRoomPageClient';

export default function GameRoomPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading game room...</div>}>
      <GameRoomPageClient />
    </Suspense>
  );
}

