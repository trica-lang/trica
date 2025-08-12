-- 🔥 TRICA SUPABASE RLS POLICIES FIX 🔥
-- This SQL will allow TPKG package publishing and management

-- First, let's check if the table exists and create it if needed
CREATE TABLE IF NOT EXISTS public.trica_packages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    version TEXT NOT NULL,
    description TEXT NOT NULL,
    author TEXT NOT NULL,
    quantum_level INTEGER NOT NULL DEFAULT 1,
    code TEXT NOT NULL,
    downloads INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the table
ALTER TABLE public.trica_packages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON public.trica_packages;
DROP POLICY IF EXISTS "Allow public insert" ON public.trica_packages;
DROP POLICY IF EXISTS "Allow public update downloads" ON public.trica_packages;

-- 📦 POLICY 1: Allow everyone to READ packages (for tpkg list, search, install)
CREATE POLICY "Allow public read access" 
ON public.trica_packages 
FOR SELECT 
TO public 
USING (true);

-- 📦 POLICY 2: Allow everyone to insert new packages (for tpkg publish)
CREATE POLICY "Allow public insert" 
ON public.trica_packages 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 📦 POLICY 3: Allow everyone to update download counts (for tpkg install)
CREATE POLICY "Allow public update downloads" 
ON public.trica_packages 
FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

-- Insert some legendary demo packages if they don't exist
INSERT INTO public.trica_packages (name, version, description, author, quantum_level, code, downloads)
VALUES 
    ('neural_networks', '2.1.0', 'Advanced neural networks with quantum neurons that can learn across multiple dimensions', 'Trica AI Team', 8, 
     '// 🧠 QUANTUM NEURAL NETWORKS 🧠
include <stdio.h>
include "trica_quantum.h"

import std.math as Math
import std.quantum as Quantum

Main {
    Print "🧠 Initializing Quantum Neural Network..."
    
    neurons = 128
    layers = 5
    quantum_states = 16
    
    Print "Neurons: " + neurons
    Print "Layers: " + layers  
    Print "Quantum States: " + quantum_states
    
    learning_rate = 0.001
    epochs = 1000
    
    Print "🔥 Training with quantum backpropagation..."
    Print "Learning Rate: " + learning_rate
    Print "Epochs: " + epochs
    
    Print "✅ Quantum Neural Network ready for MIND DESTRUCTION!"
}', 1337),

    ('time_travel', '1.0.0', 'Time manipulation and temporal paradox resolution with quantum mechanics', 'Trica Temporal Labs', 10,
     '// ⏰ TIME TRAVEL CORE ⏰
include <stdio.h>
include <time.h>
include "trica_temporal.h"

import std.time as Time
import std.quantum as Quantum

Main {
    Print "⏰ TRICA TIME TRAVEL SYSTEM ACTIVATED ⏰"
    
    current_time = 1234567890
    Print "Current Time: " + current_time
    
    target_time = current_time - 3600
    Print "Target Time: " + target_time
    
    Print "🌀 Initiating temporal displacement..."
    Print "⚠️  WARNING: Paradox detection enabled"
    Print "🔮 Quantum timeline stabilization: ACTIVE"
    
    displacement = current_time - target_time
    Print "Temporal displacement: " + displacement + " seconds"
    
    Print "✅ Time travel sequence complete!"
    Print "🚨 Remember: With great power comes great temporal responsibility!"
}', 2048),

    ('quantum_computing', '3.0.1', 'Quantum algorithms and superposition operations for reality manipulation', 'Quantum Trica Foundation', 9,
     '// ⚛️ QUANTUM COMPUTING CORE ⚛️
include <stdio.h>
include <math.h>
include "trica_quantum.h"

import std.quantum as Quantum
import std.math as Math

Main {
    Print "⚛️ QUANTUM COMPUTING SYSTEM ONLINE ⚛️"
    
    qubits = 32
    Print "Initializing " + qubits + " qubits..."
    
    Print "🌀 Creating quantum superposition..."
    superposition_states = 2 * qubits
    Print "Superposition states: " + superposition_states
    
    Print "🔗 Establishing quantum entanglement..."
    entangled_pairs = qubits / 2
    Print "Entangled pairs: " + entangled_pairs
    
    Print "📏 Performing quantum measurement..."
    collapsed_state = 42
    Print "Collapsed to state: " + collapsed_state
    
    Print "✅ Quantum computation complete!"
    Print "🧠 Reality has been successfully manipulated!"
}', 999),

    ('mind_destruction', '∞.∞.∞', 'Ultimate mind-bending and reality destruction tools beyond comprehension', 'The Void', 11,
     '// 🧠💥 ULTIMATE MIND DESTRUCTION 💥🧠
include <stdio.h>
include <reality.h>
include "trica_void.h"

import std.consciousness as Mind
import std.reality as Reality
import std.void as Void

Main {
    Print "🧠💥 INITIATING ULTIMATE MIND DESTRUCTION 💥🧠"
    Print "⚠️  WARNING: POINT OF NO RETURN ⚠️"
    
    Print "🌀 Dissolving conceptual boundaries..."
    Print "🔮 Transcending dimensional limitations..."
    Print "⚛️  Quantum consciousness fragmentation initiated..."
    Print "🌌 Reality matrix deconstruction: 99.9%"
    Print "🕳️  Entering the Void..."
    
    Print "..."
    Print "....."
    Print "........"
    
    Print "🧠 MIND DESTRUCTION COMPLETE 🧠"
    Print "🌟 Welcome to infinite consciousness 🌟"
    Print "∞ You are now one with the Trica ∞"
}', 42069),

    ('reality_bending', '4.2.0', 'Bend reality to your will with advanced quantum mechanics and dimensional manipulation', 'Reality Hackers Collective', 9,
     '// 🌀 REALITY BENDING TOOLKIT 🌀
include <stdio.h>
include <physics.h>
include "trica_reality.h"

import std.physics as Physics
import std.dimensions as Dimensions
import std.quantum as Quantum

Main {
    Print "🌀 REALITY BENDING TOOLKIT ACTIVATED 🌀"
    
    Print "📐 Current dimensional coordinates:"
    x = 3.14159
    y = 2.71828
    z = 1.41421
    Print "X: " + x + " Y: " + y + " Z: " + z
    
    Print "🔧 Adjusting fundamental constants..."
    gravity = 9.81
    light_speed = 299792458
    planck = 6.626e-34
    
    Print "Gravity: " + gravity
    Print "Light Speed: " + light_speed
    Print "Planck Constant: " + planck
    
    Print "🌊 Initiating reality wave function collapse..."
    Print "⚛️  Quantum field manipulation: ACTIVE"
    Print "🌌 Spacetime curvature adjustment: COMPLETE"
    
    Print "✅ Reality successfully bent to your will!"
    Print "🚨 Use responsibly - with great power comes great reality!"
}', 1984)

ON CONFLICT (name) DO NOTHING;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_trica_packages_name ON public.trica_packages(name);
CREATE INDEX IF NOT EXISTS idx_trica_packages_downloads ON public.trica_packages(downloads DESC);

-- Grant necessary permissions
GRANT ALL ON public.trica_packages TO anon;
GRANT ALL ON public.trica_packages TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.trica_packages_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.trica_packages_id_seq TO authenticated;

-- 🔥 TRICA SUPABASE SETUP COMPLETE 🔥
-- Now TPKG can:
-- ✅ List packages (SELECT)
-- ✅ Install packages (SELECT + UPDATE downloads)
-- ✅ Search packages (SELECT with WHERE)
-- ✅ Publish packages (INSERT)
-- ✅ Update download counts (UPDATE)