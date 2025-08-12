-- 🔥 TRICA PACKAGE REGISTRY DATABASE SETUP 🔥
-- Supabase schema for the LEGENDARY TPKG system

-- Create the trica_packages table
CREATE TABLE IF NOT EXISTS trica_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    version VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    quantum_level INTEGER DEFAULT 1 CHECK (quantum_level >= 0 AND quantum_level <= 11),
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    code TEXT NOT NULL,
    dependencies JSONB DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT '{}',
    license VARCHAR(50) DEFAULT 'MIT',
    repository_url VARCHAR(500),
    homepage_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_deprecated BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trica_packages_name ON trica_packages(name);
CREATE INDEX IF NOT EXISTS idx_trica_packages_author ON trica_packages(author);
CREATE INDEX IF NOT EXISTS idx_trica_packages_downloads ON trica_packages(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_trica_packages_quantum_level ON trica_packages(quantum_level);
CREATE INDEX IF NOT EXISTS idx_trica_packages_created_at ON trica_packages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trica_packages_tags ON trica_packages USING GIN(tags);

-- Create function to increment downloads
CREATE OR REPLACE FUNCTION increment_downloads(package_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE trica_packages 
    SET downloads = downloads + 1,
        updated_at = NOW()
    WHERE id = package_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_trica_packages_updated_at
    BEFORE UPDATE ON trica_packages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some LEGENDARY starter packages
INSERT INTO trica_packages (name, version, description, author, quantum_level, code, tags) VALUES
('neural_networks', '2.1.0', 'Advanced neural networks with quantum neurons that can learn across multiple dimensions', 'Trica AI Team', 8, 
'// 🧠 QUANTUM NEURAL NETWORKS 🧠
include <stdio.h>
include "trica_quantum.h"

import std.math as Math
import std.quantum as Quantum

Main {
    Print "🧠 Initializing Quantum Neural Network..."
    
    // Create a quantum neuron with superposition states
    neurons = 128
    layers = 5
    quantum_states = 16
    
    Print "Neurons: " + neurons
    Print "Layers: " + layers  
    Print "Quantum States: " + quantum_states
    
    // Simulate quantum learning
    learning_rate = 0.001
    epochs = 1000
    
    Print "🔥 Training with quantum backpropagation..."
    Print "Learning Rate: " + learning_rate
    Print "Epochs: " + epochs
    
    Print "✅ Quantum Neural Network ready for MIND DESTRUCTION!"
}', 
ARRAY['ai', 'neural', 'quantum', 'machine-learning']),

('time_travel', '1.0.0', 'Time manipulation and temporal paradox resolution with quantum mechanics', 'Trica Temporal Labs', 10,
'// ⏰ TIME TRAVEL CORE ⏰
include <stdio.h>
include <time.h>
include "trica_temporal.h"

import std.time as Time
import std.quantum as Quantum

Main {
    Print "⏰ TRICA TIME TRAVEL SYSTEM ACTIVATED ⏰"
    
    current_time = Time.now()
    Print "Current Time: " + current_time
    
    // Travel back 1 hour
    target_time = current_time - 3600
    Print "Target Time: " + target_time
    
    Print "🌀 Initiating temporal displacement..."
    Print "⚠️  WARNING: Paradox detection enabled"
    Print "🔮 Quantum timeline stabilization: ACTIVE"
    
    // Simulate time travel
    displacement = current_time - target_time
    Print "Temporal displacement: " + displacement + " seconds"
    
    Print "✅ Time travel sequence complete!"
    Print "🚨 Remember: With great power comes great temporal responsibility!"
}',
ARRAY['time', 'temporal', 'quantum', 'physics']),

('quantum_computing', '3.0.1', 'Quantum algorithms and superposition operations for reality manipulation', 'Quantum Trica Foundation', 9,
'// ⚛️ QUANTUM COMPUTING CORE ⚛️
include <stdio.h>
include <math.h>
include "trica_quantum.h"

import std.quantum as Quantum
import std.math as Math

Main {
    Print "⚛️ QUANTUM COMPUTING SYSTEM ONLINE ⚛️"
    
    // Create quantum bits
    qubits = 32
    Print "Initializing " + qubits + " qubits..."
    
    // Quantum superposition
    Print "🌀 Creating quantum superposition..."
    superposition_states = 2 * qubits
    Print "Superposition states: " + superposition_states
    
    // Quantum entanglement
    Print "🔗 Establishing quantum entanglement..."
    entangled_pairs = qubits / 2
    Print "Entangled pairs: " + entangled_pairs
    
    // Quantum measurement
    Print "📏 Performing quantum measurement..."
    collapsed_state = Math.random() * superposition_states
    Print "Collapsed to state: " + collapsed_state
    
    Print "✅ Quantum computation complete!"
    Print "🧠 Reality has been successfully manipulated!"
}',
ARRAY['quantum', 'computing', 'superposition', 'entanglement']),

('mind_destruction', '∞.∞.∞', 'Ultimate mind-bending and reality destruction tools beyond comprehension', 'The Void', 11,
'// 🧠💥 MIND DESTRUCTION ENGINE 💥🧠
include <stdio.h>
include <stdlib.h>
include <reality.h>
include "trica_void.h"

import void.destruction as Destroy
import reality.bending as Reality
import consciousness.annihilation as Mind

Main {
    Print "🧠💥 MIND DESTRUCTION ENGINE ACTIVATED 💥🧠"
    Print "⚠️  WARNING: CONSCIOUSNESS TERMINATION IMMINENT ⚠️"
    
    Print "🌀 Bending reality matrix..."
    reality_integrity = 100
    
    // Phase 1: Reality Distortion
    Print "Phase 1: Reality distortion at " + reality_integrity + "%"
    reality_integrity = reality_integrity - 25
    Print "Reality integrity: " + reality_integrity + "%"
    
    // Phase 2: Consciousness Fragmentation  
    Print "Phase 2: Consciousness fragmentation initiated"
    mind_coherence = 75
    mind_coherence = mind_coherence - 50
    Print "Mind coherence: " + mind_coherence + "%"
    
    // Phase 3: Complete Annihilation
    Print "Phase 3: COMPLETE MIND ANNIHILATION"
    Print "💀 CONSCIOUSNESS TERMINATED 💀"
    Print "🌌 REALITY MATRIX COLLAPSED 🌌"
    Print "♾️  ENTERING THE VOID ♾️"
    
    Print "✅ Mind destruction sequence complete."
    Print "🧠 Your mind has been successfully DESTROYED!"
}',
ARRAY['destruction', 'mind', 'reality', 'void', 'consciousness']),

('reality_bending', '4.2.0', 'Bend reality to your will with advanced quantum mechanics and dimensional manipulation', 'Reality Hackers Collective', 9,
'// 🌌 REALITY BENDING SYSTEM 🌌
include <stdio.h>
include <physics.h>
include <dimensions.h>
include "trica_reality.h"

import reality.core as Reality
import dimensions.manipulation as Dimensions
import physics.quantum as Physics

Main {
    Print "🌌 REALITY BENDING SYSTEM ONLINE 🌌"
    
    // Check current reality parameters
    dimension_count = 11
    reality_stability = 100
    quantum_flux = 0.001
    
    Print "Current dimension count: " + dimension_count
    Print "Reality stability: " + reality_stability + "%"
    Print "Quantum flux: " + quantum_flux
    
    // Begin reality manipulation
    Print "🔧 Initiating reality manipulation..."
    
    // Bend space-time
    Print "🌀 Bending space-time continuum..."
    spacetime_curvature = 0.5
    Print "Space-time curvature: " + spacetime_curvature
    
    // Alter physical constants
    Print "⚛️ Altering fundamental constants..."
    gravity_constant = 6.674e-11 * 1.1
    Print "Modified gravity constant: " + gravity_constant
    
    // Create pocket dimension
    Print "🌌 Creating pocket dimension..."
    pocket_dimension_id = 42
    Print "Pocket dimension ID: " + pocket_dimension_id
    
    Print "✅ Reality bending complete!"
    Print "🎭 You now control the fabric of existence!"
}',
ARRAY['reality', 'bending', 'physics', 'dimensions', 'quantum']);

-- Enable Row Level Security (RLS)
ALTER TABLE trica_packages ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access" ON trica_packages
    FOR SELECT USING (true);

-- Create policy for authenticated insert (for publishing)
CREATE POLICY "Authenticated insert" ON trica_packages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for author update (package owners can update their packages)
CREATE POLICY "Author update" ON trica_packages
    FOR UPDATE USING (auth.email() = author);

-- Grant permissions
GRANT SELECT ON trica_packages TO anon;
GRANT SELECT, INSERT ON trica_packages TO authenticated;
GRANT USAGE ON SEQUENCE trica_packages_id_seq TO authenticated;

-- Create view for package statistics
CREATE OR REPLACE VIEW package_stats AS
SELECT 
    COUNT(*) as total_packages,
    SUM(downloads) as total_downloads,
    AVG(quantum_level) as avg_quantum_level,
    COUNT(DISTINCT author) as unique_authors
FROM trica_packages;

GRANT SELECT ON package_stats TO anon, authenticated;