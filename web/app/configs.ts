'use client';
import { QueryClient } from '@tanstack/react-query';


// --- AI-ASSISTED ---
// Tool: Copilot
// Prompt: "Configure a Chart.JS radar visualization"
// Modifications: Created the register call.
// --- END AI-ASSISTED ---


import {
    Chart as ChartJS,
    RadarController,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
} from 'chart.js';

ChartJS.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler);



export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 min
      gcTime: 1000 * 60 * 10,         // 10 min (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});