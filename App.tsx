import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';
import { TreeState } from './types';

// Christmas Audio URL (Wikimedia Commons Public Domain/CC)
const AUDIO_URL = "https://upload.wikimedia.org/wikipedia/commons/e/e6/We_Wish_You_a_Merry_Christmas.ogg";

export default function App() {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Interaction Logic: Distinguish Click vs Drag
  const dragRef = useRef({ x: 0, y: 0, time: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    const dt = Date.now() - dragRef.current.time;

    // Threshold for "Click" (movement < 5px and time < 300ms)
    if (Math.sqrt(dx * dx + dy * dy) < 10 && dt < 300) {
      cycleState();
      playAudio();
    }
  };

  const cycleState = () => {
    setTreeState(prev => {
      // Toggle between Tree and Scattered
      if (prev === TreeState.TREE_SHAPE) return TreeState.SCATTERED;
      return TreeState.TREE_SHAPE;
    });
  };

  const playAudio = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(e => console.log("Audio autoplay prevented:", e));
    }
  };

  useEffect(() => {
    // Attempt Auto-play on load
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    
    // Try play immediately
    audio.play().catch(() => {
        console.log("Waiting for user interaction to play audio");
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  return (
    <div 
      className="w-full h-screen relative bg-[#050200] cursor-pointer"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 24], fov: 45 }}
        gl={{ antialias: false, toneMappingExposure: 1.2 }}
      >
        <Suspense fallback={null}>
          <Scene treeState={treeState} />
        </Suspense>
      </Canvas>
      
      <Loader 
        containerStyles={{ backgroundColor: '#050200' }}
        innerStyles={{ width: '200px', height: '1px', backgroundColor: '#333' }}
        barStyles={{ backgroundColor: '#FFD700', height: '1px' }}
        dataStyles={{ display: 'none' }}
      />
      
      <Overlay treeState={treeState} />
    </div>
  );
}