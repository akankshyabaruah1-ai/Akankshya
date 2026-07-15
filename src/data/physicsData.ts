import { PhysicsSubject, AchievementBadge } from "../types";

export const PHYSICS_SUBJECTS: PhysicsSubject[] = [
  {
    id: "mathematical_physics",
    name: "Mathematical Physics",
    description: "Rigorous mathematical frameworks underpinning advanced physical theories.",
    subtopics: [
      { id: "vector_analysis", name: "Vector Analysis" },
      { id: "tensor_analysis", name: "Tensor Analysis" },
      { id: "differential_equations", name: "Differential Equations" },
      { id: "complex_analysis", name: "Complex Analysis" },
      { id: "fourier_series", name: "Fourier Series" },
      { id: "fourier_transform", name: "Fourier Transform" },
      { id: "laplace_transform", name: "Laplace Transform" },
      { id: "linear_algebra", name: "Linear Algebra" },
      { id: "calculus_variations", name: "Calculus of Variations" },
      { id: "greens_functions", name: "Green's Functions" }
    ]
  },
  {
    id: "classical_mechanics",
    name: "Classical Mechanics",
    description: "Lagrangian, Hamiltonian dynamics, and relativistic frameworks.",
    subtopics: [
      { id: "lagrangian_formalism", name: "Lagrangian Formalism" },
      { id: "hamiltonian_formalism", name: "Hamiltonian Formalism" },
      { id: "central_forces", name: "Central Force Problems" },
      { id: "rigid_body", name: "Rigid Body Dynamics" },
      { id: "small_oscillations", name: "Small Oscillations" },
      { id: "special_relativity", name: "Special Relativity" },
      { id: "canonical_transformations", name: "Canonical Transformations" },
      { id: "hamilton_jacobi", name: "Hamilton-Jacobi Theory" },
      { id: "poisson_brackets", name: "Poisson Brackets" },
      { id: "chaos_theory", name: "Chaos Theory" }
    ]
  },
  {
    id: "electromagnetic_theory",
    name: "Electromagnetic Theory",
    description: "Classical electrodynamics, electromagnetic waves, and radiation systems.",
    subtopics: [
      { id: "electrostatics", name: "Electrostatics" },
      { id: "magnetostatics", name: "Magnetostatics" },
      { id: "maxwell_equations", name: "Maxwell's Equations" },
      { id: "em_waves", name: "Electromagnetic Waves" },
      { id: "wave_propagation", name: "Wave Propagation" },
      { id: "radiation", name: "Radiation" },
      { id: "gauge_transformations", name: "Gauge Transformations" },
      { id: "relativistic_electrodynamics", name: "Relativistic Electrodynamics" },
      { id: "waveguides", name: "Waveguides" },
      { id: "boundary_problems", name: "Boundary Value Problems" }
    ]
  },
  {
    id: "thermodynamics",
    name: "Thermodynamics",
    description: "Laws governing heat, entropy, work, and phase equilibria.",
    subtopics: [
      { id: "laws_thermodynamics", name: "Laws of Thermodynamics" },
      { id: "thermodynamic_potentials", name: "Thermodynamic Potentials" },
      { id: "maxwell_relations", name: "Maxwell Relations" },
      { id: "entropy", name: "Entropy" },
      { id: "carnot_cycle", name: "Carnot Cycle" },
      { id: "phase_equilibrium", name: "Phase Equilibrium" },
      { id: "chemical_potential", name: "Chemical Potential" },
      { id: "heat_engines", name: "Heat Engines" }
    ]
  },
  {
    id: "statistical_mechanics",
    name: "Statistical Mechanics",
    description: "Macroscopic properties derived from microscopic statistical distributions.",
    subtopics: [
      { id: "microstates_ensembles", name: "Microstates & Ensembles" },
      { id: "partition_function", name: "Partition Function" },
      { id: "maxwell_boltzmann", name: "Maxwell-Boltzmann Statistics" },
      { id: "bose_einstein", name: "Bose-Einstein Statistics" },
      { id: "fermi_dirac", name: "Fermi-Dirac Statistics" },
      { id: "black_body_radiation", name: "Black Body Radiation" },
      { id: "phase_transitions", name: "Phase Transitions" },
      { id: "ising_model", name: "Ising Model" }
    ]
  },
  {
    id: "quantum_mechanics",
    name: "Quantum Mechanics",
    description: "Wave mechanics, operator algebra, and perturbation theory.",
    subtopics: [
      { id: "wave_function", name: "Wave Function" },
      { id: "schrodinger_equation", name: "Schrödinger Equation" },
      { id: "operators", name: "Operators" },
      { id: "eigenvalues_functions", name: "Eigenvalues & Eigenfunctions" },
      { id: "angular_momentum", name: "Angular Momentum" },
      { id: "spin", name: "Spin" },
      { id: "perturbation_theory", name: "Perturbation Theory" },
      { id: "hydrogen_atom", name: "Hydrogen Atom" },
      { id: "approximation_methods", name: "Approximation Methods" },
      { id: "scattering_theory", name: "Scattering Theory" }
    ]
  },
  {
    id: "solid_state_physics",
    name: "Solid State Physics",
    description: "Crystalline structures, electronic bands, and physical behaviors of solids.",
    subtopics: [
      { id: "crystal_structure", name: "Crystal Structure" },
      { id: "reciprocal_lattice", name: "Reciprocal Lattice" },
      { id: "phonons_vibrations", name: "Phonons & Lattice Vibrations" },
      { id: "free_electron_gas", name: "Free Electron Fermi Gas" },
      { id: "energy_bands", name: "Energy Bands" },
      { id: "semiconductors", name: "Semiconductors" },
      { id: "superconductivity", name: "Superconductivity" },
      { id: "magnetic_properties", name: "Magnetic Properties" },
      { id: "dielectrics", name: "Dielectrics" },
      { id: "nanostructures", name: "Nanostructures" }
    ]
  },
  {
    id: "atomic_physics",
    name: "Atomic Physics",
    description: "Spectra, transitions, and fine details of atomic electron shells.",
    subtopics: [
      { id: "bohr_model", name: "Bohr's Model" },
      { id: "alkali_spectra", name: "Alkali Spectra" },
      { id: "zeeman_effect", name: "Zeeman Effect" },
      { id: "stark_effect", name: "Stark Effect" },
      { id: "fine_structure", name: "Fine Structure" },
      { id: "hyperfine_structure", name: "Hyperfine Structure" },
      { id: "coupling_schemes", name: "L-S and J-J Coupling" },
      { id: "laser_spectroscopy", name: "Laser Spectroscopy" },
      { id: "xray_spectra", name: "X-ray Spectra" }
    ]
  },
  {
    id: "nuclear_physics",
    name: "Nuclear Physics",
    description: "Nuclear structures, radioactive decays, reactions, and model mechanics.",
    subtopics: [
      { id: "nuclear_properties", name: "Nuclear Size & Charge" },
      { id: "binding_energy", name: "Binding Energy" },
      { id: "liquid_drop_model", name: "Liquid Drop Model" },
      { id: "shell_model", name: "Shell Model" },
      { id: "radioactive_decay", name: "Radioactive Decay" },
      { id: "radiations_types", name: "Alpha/Beta/Gamma Radiation" },
      { id: "nuclear_reactions", name: "Nuclear Reactions" },
      { id: "fission_fusion", name: "Fission & Fusion" },
      { id: "particle_accelerators", name: "Particle Accelerators" }
    ]
  },
  {
    id: "particle_physics",
    name: "Particle Physics",
    description: "Elementary particles, Standard Model, quarks, and fundamental fields.",
    subtopics: [
      { id: "particle_classification", name: "Classification of Particles" },
      { id: "fundamental_interactions", name: "Fundamental Interactions" },
      { id: "quarks_leptons", name: "Quarks & Leptons" },
      { id: "conservation_laws", name: "Conservation Laws" },
      { id: "gell_mann_nishijima", name: "Gell-Mann-Nishijima Formula" },
      { id: "cpt_theorem", name: "CPT Theorem" },
      { id: "higgs_mechanism", name: "Higgs Mechanism" },
      { id: "standard_model", name: "Standard Model" },
      { id: "feynman_diagrams", name: "Feynman Diagrams" }
    ]
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Analog circuits, operational amplifiers, digital systems, and sequential logic.",
    subtopics: [
      { id: "semiconductor_diodes", name: "Semiconductor Diodes" },
      { id: "bjt_transistors", name: "Bipolar Junction Transistors (BJT)" },
      { id: "fet_transistors", name: "Field Effect Transistors (FET)" },
      { id: "op_amps", name: "Operational Amplifiers" },
      { id: "feedback_amplifiers", name: "Feedback Amplifiers" },
      { id: "oscillators", name: "Oscillators" },
      { id: "logic_gates", name: "Digital Logic Gates" },
      { id: "combinational_circuits", name: "Combinational Circuits" },
      { id: "sequential_circuits", name: "Sequential Circuits" },
      { id: "microprocessors", name: "Microprocessors" }
    ]
  },
  {
    id: "optics",
    name: "Optics",
    description: "Wave properties, interference, diffraction, polarization, and lasers.",
    subtopics: [
      { id: "interference", name: "Interference" },
      { id: "diffraction", name: "Diffraction" },
      { id: "polarization", name: "Polarization" },
      { id: "lasers_masers", name: "Lasers & Masers" },
      { id: "holography", name: "Holography" },
      { id: "fiber_optics", name: "Fiber Optics" },
      { id: "waveguides_opt", name: "Waveguides in Optics" },
      { id: "fourier_optics", name: "Fourier Optics" },
      { id: "nonlinear_optics", name: "Non-Linear Optics" },
      { id: "geometrical_optics", name: "Geometrical Optics" }
    ]
  },
  {
    id: "condensed_matter_physics",
    name: "Condensed Matter Physics",
    description: "Liquid phases, topological phases, graphene, and polymer configurations.",
    subtopics: [
      { id: "liquids_amorphous", name: "Liquids & Amorphous Solids" },
      { id: "liquid_crystals", name: "Liquid Crystals" },
      { id: "polymers", name: "Polymers" },
      { id: "quasicrystals", name: "Quasicrystals" },
      { id: "low_temp_physics", name: "Low-Temperature Physics" },
      { id: "quantum_hall", name: "Quantum Hall Effect" },
      { id: "topological_insulators", name: "Topological Insulators" },
      { id: "graphene", name: "Graphene" },
      { id: "correlated_systems", name: "Correlated Electron Systems" }
    ]
  },
  {
    id: "computational_physics",
    name: "Computational Physics",
    description: "Algorithms, ODE integrations, Monte Carlo, and matrix diagonalizations.",
    subtopics: [
      { id: "numerical_integration", name: "Numerical Integration" },
      { id: "root_finding", name: "Root Finding" },
      { id: "monte_carlo", name: "Monte Carlo Methods" },
      { id: "finite_difference", name: "Finite Difference Method" },
      { id: "molecular_dynamics", name: "Molecular Dynamics" },
      { id: "runge_kutta", name: "Runge-Kutta Methods" },
      { id: "matrix_diagonalization", name: "Matrix Diagonalization" },
      { id: "fft_algorithms", name: "FFT Algorithms" },
      { id: "neural_networks_phys", name: "Neural Networks in Physics" }
    ]
  },
  {
    id: "experimental_physics",
    name: "Experimental Physics",
    description: "Error analysis, noise cancellation, vacuums, and cryogenics in research.",
    subtopics: [
      { id: "error_analysis", name: "Error Analysis & Propagation" },
      { id: "vacuum_techniques", name: "Vacuum Techniques" },
      { id: "cryogenics", name: "Cryogenics" },
      { id: "signal_conditioning", name: "Signal Conditioning" },
      { id: "noise_reduction", name: "Noise Reduction" },
      { id: "radiation_detection", name: "Radiation Detection" },
      { id: "sensor_calibration", name: "Sensor Calibration" },
      { id: "interferometry_exp", name: "Interferometry" },
      { id: "optical_spectroscopy", name: "Optical Spectroscopy" }
    ]
  },
  {
    id: "astrophysics",
    name: "Astrophysics",
    description: "Stellar evolutions, General Relativity, black holes, and observational cosmologies.",
    subtopics: [
      { id: "stellar_structure", name: "Stellar Structure" },
      { id: "stellar_evolution", name: "Stellar Evolution" },
      { id: "nucleosynthesis", name: "Nucleosynthesis" },
      { id: "cosmology", name: "Cosmology" },
      { id: "hubbles_law", name: "Hubble's Law" },
      { id: "cmb_radiation", name: "Cosmic Microwave Background" },
      { id: "gr_foundations", name: "General Relativity Foundations" },
      { id: "black_holes", name: "Black Holes" },
      { id: "gravitational_waves", name: "Gravitational Waves" },
      { id: "active_galaxies", name: "Active Galactic Nuclei (AGN)" }
    ]
  }
];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: "streak_3",
    name: "Thermal Ignition",
    description: "Maintain a study streak of 3 consecutive days.",
    iconName: "Flame",
    category: "streak",
    requirementText: "3 Day Streak"
  },
  {
    id: "streak_7",
    name: "Quantum Coherence",
    description: "Maintain a study streak of 7 consecutive days.",
    iconName: "Sparkles",
    category: "streak",
    requirementText: "7 Day Streak"
  },
  {
    id: "hours_10",
    name: "MegaWatt Power",
    description: "Log more than 10 total study hours.",
    iconName: "Zap",
    category: "hours",
    requirementText: "10 Study Hours"
  },
  {
    id: "hours_50",
    name: "Thermonuclear Core",
    description: "Log more than 50 total study hours.",
    iconName: "Atom",
    category: "hours",
    requirementText: "50 Study Hours"
  },
  {
    id: "subjects_3",
    name: "Unified Field Theorist",
    description: "Complete progress on at least 3 distinct subtopics in different subjects.",
    iconName: "Compass",
    category: "subjects",
    requirementText: "3 Subjects Explored"
  },
  {
    id: "subjects_all",
    name: "Universal Polymath",
    description: "Unlock progress in every single physics subject.",
    iconName: "Award",
    category: "subjects",
    requirementText: "All 16 Subjects Initiated"
  }
];
