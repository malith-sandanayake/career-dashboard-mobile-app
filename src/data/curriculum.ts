import { Module } from '../models/types';

export const CURRICULUM: Module[] = [
  // YEAR 1, SEMESTER 1
  { 
    code: 'CE1010', 
    name: 'Engineering Mechanics', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 1, 
    year: 1,
    aim: 'To provide an exposure to the fundamentals of physics which govern the behaviour of macroscopic elements.',
    content: [
      { title: 'Introduction', subtopics: ['Force systems', 'Forces and couples', 'Equilibrium of rigid body'] },
      { title: 'Analysis of simple structures', subtopics: ['Structures and components', 'Loads and supports', 'Internal and external forces', 'Free-body diagrams', 'Statically determinate structures', 'Analysis of trusses', 'Beams and shear force/bending moment diagrams', 'Stress and strain', 'Hooke’s law', 'Deformation of axially loaded members', 'Statically indeterminate problems'] },
      { title: 'Bending of beams', subtopics: ['Simple bending theory and its applications'] },
      { title: 'Work and energy methods', subtopics: ['Work due to forces and couples', 'Virtual displacements and virtual work', 'Strain energy and potential energy', 'Energy principles'] },
      { title: 'Kinematics of Particle Motion', subtopics: ['Description of particle motion in 3D Inertial frames and in moving frames', 'Use of the euclidean group of translations in describing the relative motion of frames'] },
      { title: 'Kinetics of Particle Motion', subtopics: ['Concept of Space-Time', 'Mass and conservation of linear momentum', 'Relationship to Newton\'s Laws', 'Concept of force', 'Meaning of kinetic energy', 'Notion of spatial angular momentum', 'Conservation of spatial angular momentum'] },
      { title: 'Newton’s laws in Moving Frames', subtopics: ['Meaning of centrifugal, Coriolis, Euler, and Einstein forces', 'Application to description of complex motion of systems'] }
    ],
    assessment: [
      { label: 'Tutorials', percentage: 10 },
      { label: 'Lab Practicals', percentage: 20 },
      { label: 'Mid Semester exam', percentage: 20 },
      { label: 'Final Exam (Theory)', percentage: 50 }
    ]
  },
  { 
    code: 'CO1010', 
    name: 'Programming for Engineers I', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 1, 
    year: 1,
    aim: 'To develop logical thinking through algorithms and structured programming constructs.',
    content: [
      { title: 'Basics', subtopics: ['Variables', 'Operators and precedence', 'Data types', 'Number systems and numerical precision'] },
      { title: 'Control Structures', subtopics: ['Conditions and loops'] },
      { title: 'Modularization', subtopics: ['Standard libraries and functions', 'User-defined functions'] },
      { title: 'Input/Output', subtopics: ['Standard input/output', 'File input and file output'] },
      { title: 'Data Structures', subtopics: ['List and list comprehension', 'String processing and formatting', 'Stack and Queue', 'Dictionaries'] },
      { title: 'Object-Oriented Concepts', subtopics: ['Classes and Objects', 'Accessing variables and functions within objects'] },
      { title: 'Quality Assurance', subtopics: ['Good programming practices', 'Testing', 'Debugging', 'Exception and error handling'] },
      { title: 'Algorithms', subtopics: ['Developing algorithms for well-defined engineering problems'] },
      { title: 'Numerical Computations', subtopics: ['Introduction to numpy', 'Use of mathematical software such as Matlab'] }
    ],
    assessment: [
      { label: 'Online class participation', percentage: 5 },
      { label: 'Practicals', percentage: 35 },
      { label: 'Assignments and Projects', percentage: 20 },
      { label: 'Final Assessment (Theory)', percentage: 40 }
    ]
  },
  { 
    code: 'EE1010', 
    name: 'Electricity', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 1, 
    year: 1,
    aim: 'To equip the learners with fundamentals of physics of electricity.',
    content: [
      { title: 'Introduction', subtopics: ['Field theory as a tool to understand the universe', 'Fundamentals of Fields', 'Introduction to field theory'] },
      { title: 'Electrostatics', subtopics: ['Electric Charge and Coulomb\'s Law', 'Permittivity', 'Electric field', 'Gauss law', 'Electric flux', 'Electric potential', 'Energy stored in a static electric field', 'Dielectric polarization', 'Boundary conditions', 'Capacitance'] },
      { title: 'Magnetism', subtopics: ['Magnetic flux and Flux density (B)', 'Permeability', 'Magnetic field intensity (H)', 'Biot-Savart law', 'Ampere’s law', 'Gauss law for magnetic fields', 'Magnetic force and torque', 'Self and mutual inductance', 'Faraday’s law of Induction', 'Lenz’s law', 'Stored energy in magnetic field', 'Magnetic properties of materials', 'B-H curve', 'Reluctance and magnetic circuits', 'Eddy current', 'Hysteresis and iron losses'] },
      { title: 'Linear Electrical Circuit Analysis (Steady state)', subtopics: ['Charge flow - ohm\'s law', 'Current and current density (J)', 'Resistance and resistivity', 'Impedance and admittance', 'Mesh and nodal analysis', 'Thevenin’s theorem', 'Norton’s theorem', 'Maximum power transfer theorem'] },
      { title: 'Linear Electrical Circuit Analysis (Transient)', subtopics: ['Analysis of RC, RL and RLC circuits under dc excitation'] },
      { title: 'Advances in modeling techniques', subtopics: ['Recent developments in modeling electrical phenomena'] },
      { title: 'Analysis tools', subtopics: ['Modern tools for electrical and magnetic field analysis', 'Electrical Engineering Mini Project'] }
    ],
    assessment: [
      { label: 'Tutorials', percentage: 10 },
      { label: 'Quizzes', percentage: 4 },
      { label: 'Assignment/Project', percentage: 26 },
      { label: 'Labs', percentage: 20 },
      { label: 'Final Exam (Theory)', percentage: 40 }
    ]
  },
  { 
    code: 'EF1010', 
    name: 'English for Communication I', 
    credits: 3, 
    gpaIncluded: false, 
    semester: 1, 
    year: 1,
    aim: 'To develop the competence in using English effectively to follow the engineering degree programme.',
    content: [
      { title: 'Listening Comprehension', subtopics: ['Dialogues', 'Short & long lectures', 'Talks', 'Documentaries', 'Taking down notes', 'Paraphrase and summarize'] },
      { title: 'Reading Comprehension', subtopics: ['Passages from various disciplines', 'Skimming & scanning', 'Paraphrasing', 'Improving vocabulary', 'Critical analysis of content'] },
      { title: 'Writing', subtopics: ['General descriptions', 'Processes', 'Essays', 'Graph descriptions', 'Lab reports', 'Writing with cohesion and grammar'] },
      { title: 'Speech', subtopics: ['Effective use in different contexts', 'Impromptu & prepared speeches', 'Debates', 'Discussions and presentations'] }
    ],
    assessment: [
      { label: 'Assignments', percentage: 70 },
      { label: 'Final Assessment (Theory)', percentage: 30 }
    ]
  },
  { 
    code: 'EM1010', 
    name: 'Calculus I', 
    credits: 4, 
    gpaIncluded: true, 
    semester: 1, 
    year: 1,
    aim: 'To introduce mathematical concepts arising in the areas of calculus and functions of complex variables.',
    content: [
      { title: 'Functions of a Single Variable', subtopics: ['Limits', 'Continuity', 'Differentiability', 'Intermediate value theorem', 'Rolle’s theorem', 'Mean value theorem', 'Leibnitz theorem', 'Tangent line approximation', 'Extreme values', 'Integration of single variable function'] },
      { title: 'Sequences and Series', subtopics: ['Monotonic and bounded sequences', 'Convergence and divergence', 'Oscillation', 'Real power series', 'Maclaurin and Taylor series approximation'] },
      { title: 'First order Ordinary Differential Equations', subtopics: ['Mathematical model and Classification', 'Separable', 'Linear', 'Exact', 'Reducible forms'] },
      { title: 'Vector approach to geometry in space', subtopics: ['Vectors', 'Determinant', 'Lines and planes', 'Parametric representation of curves', 'Curvature', 'Radius and center of curvature', 'Derivatives of vector valued function'] },
      { title: 'Functions of Several Variables', subtopics: ['Limit and continuity', 'Partial derivatives', 'Total differential', 'Chain rule', 'Higher order partial derivatives'] },
      { title: 'Functions of Complex Variables', subtopics: ['Roots of unity', 'Mapping of complex variables', 'Derivatives of complex functions', 'Cauchy Riemann equation', 'Holomorphic functions', 'Harmonic functions'] }
    ],
    assessment: [
      { label: 'Assignments/Quizzes', percentage: 10 },
      { label: 'Tutorials', percentage: 10 },
      { label: 'Mid-semester exam', percentage: 30 },
      { label: 'Final Exam (Theory)', percentage: 50 }
    ]
  },
  { 
    code: 'MA1100', 
    name: 'Ethics and Sustainability', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 1, 
    year: 1,
    aim: 'To impart knowledge on basic concepts of sustainability and ethics.',
    content: [
      { title: 'Ethics and Morality', subtopics: ['Concept of morality', 'Personal and common morality', 'Core values'] },
      { title: 'Academic integrity', subtopics: ['Usage of information', 'Citation and acknowledgement', 'Plagiarism', 'Impersonation'] },
      { title: 'Professional Ethics', subtopics: ['Engineers in an organization', 'Introduction to IESL Code of Ethics'] },
      { title: 'Ethics and Sustainability', subtopics: ['Ethical considerations in decision making', 'Application of IESL Code of Ethics'] },
      { title: 'Global environmental and social issues', subtopics: ['Global warming and resource limitation', 'Green and welfare economies'] },
      { title: 'Sustainable Development', subtopics: ['Concept of sustainable development', 'Three pillars of sustainability', 'SDGs'] },
      { title: 'Tools and Concepts for Sustainability', subtopics: ['Life Cycle Thinking', 'Design for sustainability', 'Cleaner production', 'Circular economy'] }
    ],
    assessment: [
      { label: 'Small Group Activities', percentage: 40 },
      { label: 'Quizzes', percentage: 20 },
      { label: 'Final Assessment (Theory)', percentage: 40 }
    ]
  },

  // YEAR 1, SEMESTER 2
  { 
    code: 'CO1020', 
    name: 'Computer Systems Programming', 
    credits: 5, 
    gpaIncluded: true, 
    semester: 2, 
    year: 1,
    aim: 'To establish a solid foundation of computer programming and provide a programmer’s perspective on systems.',
    content: [
      { title: 'Overview of computer systems', subtopics: ['Abstractions in software and hardware', 'Von Neumann machine concept', 'Organization of a computer system', 'Process of building and executing programs'] },
      { title: 'Introduction to C programming syntax', subtopics: ['Comments', 'Variables', 'Data types', 'Operators', 'Expressions', 'Flow control', 'Functions', 'I/O'] },
      { title: 'Structured programming', subtopics: ['Functions syntax', 'Naming conventions', 'Parameter passing', 'Recursion'] },
      { title: 'Error detection and prevention', subtopics: ['Syntax/semantic/logical errors', 'Compile-time/run-time errors', 'Assertions', 'Debugging tools (GDB)', 'Testing'] },
      { title: 'Memory allocation and peripheral I/O', subtopics: ['Memory layout (stack, heap, code)', 'Stack tracing', 'Arrays', 'Pointers', 'Structures', 'File I/O', 'Socket programming'] },
      { title: 'Assembly language programming', subtopics: ['Introduction to ISA', 'Arithmetic and logic operations', 'Branching', 'Function calls', 'Stack operations', 'Data memory access'] }
    ],
    assessment: [
      { label: 'Practicals & quizzes', percentage: 20 },
      { label: 'Assignments', percentage: 20 },
      { label: 'Final Exam (Theory)', percentage: 30 },
      { label: 'Final Exam (Practical)', percentage: 30 }
    ]
  },
  { 
    code: 'CO1030', 
    name: 'Data Structures and Algorithms I', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 2, 
    year: 1,
    aim: 'To introduce the notion of efficiently solving computational problems using linearly structured data.',
    content: [
      { title: 'Algorithm analysis', subtopics: ['Empirical measuring of performance', 'Big-O/Big-Omega/Big-Theta notations', 'Time complexity of recursive algorithms', 'Master theorem', 'Space efficiency'] },
      { title: 'Search and sort strategies', subtopics: ['Linear search', 'Divide and conquer', 'Binary search', 'Bubble-sort', 'Selection-sort', 'Insertion-sort', 'Quick-sort', 'Merge-sort'] },
      { title: 'Linear data structures', subtopics: ['Abstract data types (ADT)', 'List ADT', 'Linked vs array based implementations', 'Search/maintenance operations', 'Stack and queue'] }
    ],
    assessment: [
      { label: 'Practicals & quizzes', percentage: 50 },
      { label: 'Final Exam (Theory)', percentage: 30 },
      { label: 'Final Exam (Practical)', percentage: 20 }
    ]
  },
  { 
    code: 'EE1810', 
    name: 'Electronics', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 2, 
    year: 1,
    aim: 'To introduce the operational characteristics and applications of fundamental analog electronic devices.',
    content: [
      { title: 'Diodes', subtopics: ['Semiconductors', 'P-N junction', 'Operation principle', 'Ideal & piecewise linear modeling', 'Common diode circuits', 'Diode logic circuits'] },
      { title: 'Bipolar Junction Transistors', subtopics: ['Terminal characteristics', 'Operational principles', 'BJT amplifier and switching circuits', 'Biasing circuits', 'DC/AC load line analysis', 'Small signal analysis'] },
      { title: 'Amplifiers using BJTs', subtopics: ['Voltage/Current/Power gain', 'Input/Output resistance', 'Multi-stage amplifiers', 'Coupling techniques', 'Frequency response'] },
      { title: 'BJT Logic families', subtopics: ['Transistor inverter circuits', 'Logic level definitions', 'Switching characteristics', 'DTL and TTL'] },
      { title: 'Field Effect Transistors (FET)', subtopics: ['Terminal characteristics', 'Circuit models', 'MOSFET amplifier and switching circuits', 'DC/AC load line analysis'] },
      { title: 'MOS Logic Families', subtopics: ['NMOS logic design', 'Inverters', 'NOR/NAND/SOP/POS', 'Complex gates', 'PMOS logic', 'CMOS logic', 'Dynamic logic'] },
      { title: 'Interfacing logic families', subtopics: ['Interface criteria', 'Interfacing TTL - CMOS', 'Interfacing TTL - ECL'] }
    ],
    assessment: [
      { label: 'Assignments', percentage: 20 },
      { label: 'Mid Semester exam', percentage: 20 },
      { label: 'Final Exam (Theory)', percentage: 60 }
    ]
  },
  { 
    code: 'EM1020', 
    name: 'Linear Algebra', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 2, 
    year: 1,
    aim: 'To provide knowledge of linear algebra concepts and their applications in engineering.',
    content: [
      { title: 'Matrix Algebra', subtopics: ['Operations', 'Elementary matrices', 'Inverse', 'Partitioned matrices'] },
      { title: 'Determinants', subtopics: ['Introduction and properties'] },
      { title: 'Vector spaces', subtopics: ['Definition', 'Subspaces', 'Linear independence/spanning', 'Basis', 'Change of basis', 'Normed spaces', 'Gram-Schmidt orthonormalization'] },
      { title: 'Linear Transformations', subtopics: ['Introduction', 'Matrix representation', 'Operations of linear transformations', 'Change of basis'] },
      { title: 'System of linear equations', subtopics: ['Gauss and Jordan elimination', 'LU factorization', 'Least square approximations', 'Ill-conditioned systems'] },
      { title: 'Characteristic value problem', subtopics: ['Computing eigenvalues and eigenvectors', 'Eigen-basis', 'Diagonalization', 'Matrix exponentials'] },
      { title: 'Real Symmetric matrices', subtopics: ['Properties', 'Definiteness', 'Quadratic forms', 'Applications'] }
    ],
    assessment: [
      { label: 'Tutorials/Assignments/Quizzes', percentage: 20 },
      { label: 'Mid Semester Exam', percentage: 30 },
      { label: 'Final Exam (Theory)', percentage: 50 }
    ]
  },
  { 
    code: 'EM1030', 
    name: 'Differential Equations', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 2, 
    year: 1,
    aim: 'To introduce analytical solving techniques for differential equations.',
    content: [
      { title: 'Second Order Ordinary DEs', subtopics: ['Spring mass damper equation', 'Forced oscillations and resonance'] },
      { title: 'Laplace Transform', subtopics: ['Definition and properties', 'Laplace transform of standard functions', 'Solving ordinary DEs with constant coefficients', 'Convolution'] },
      { title: 'Boundary Value Problems', subtopics: ['Second order DE with constant coefficients using direct calculation', 'Euler Bernoulli equation', 'Macaulay’s Bracket method'] },
      { title: 'Systems of ODEs', subtopics: ['Converting to first-order', 'Eigenvalue eigenvector method', 'Matrix exponential method'] },
      { title: 'First order linear PDEs', subtopics: ['Mathematical model and Classification', 'Method of characteristics'] },
      { title: 'Second order linear PDEs', subtopics: ['Classification: hyperbolic, parabolic, elliptic', 'Fourier series', 'Method of separation of variables', 'Wave equation', 'Heat equation', 'Laplace equation'] }
    ],
    assessment: [
      { label: 'Tutorials/Assignments/Quizzes', percentage: 20 },
      { label: 'Mid Semester exam', percentage: 30 },
      { label: 'Final Exam (Theory)', percentage: 50 }
    ]
  },
  { 
    code: 'EM1050', 
    name: 'Discrete Mathematics', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 2, 
    year: 1,
    aim: 'To solve problems related to propositional calculus, algorithms and graph theory.',
    content: [
      { title: 'Fundamentals', subtopics: ['Set theory', 'Relations and functions', 'Axiomatic systems', 'Induction', 'Invariants'] },
      { title: 'Number Theory', subtopics: ['Divisibility', 'GCD', 'Modular arithmetic', 'Fermat’s Little theorem', 'RSA algorithm'] },
      { title: 'Algebraic Structures', subtopics: ['Monoids', 'Groups', 'Rings', 'Fields'] },
      { title: 'Logic and Proofs', subtopics: ['Propositional and predicate logic', 'Proof methods and strategy'] },
      { title: 'Graph Theory', subtopics: ['Representation', 'Isomorphic graphs', 'Eulerian and Hamiltonian graphs', 'Planar graphs', 'Graph coloring', 'Trees/spanning trees', 'Hasse diagrams'] },
      { title: 'Algorithms', subtopics: ['Greedy algorithms', 'Searching and sorting', 'Minimum spanning tree', 'Shortest path', 'Complexity analysis'] },
      { title: 'Models for Computing Machines', subtopics: ['Finite state machines', 'Finite state automata', 'Turing machines'] }
    ],
    assessment: [
      { label: 'Tutorials/Assignments/Quizzes', percentage: 20 },
      { label: 'Mid Semester exam', percentage: 30 },
      { label: 'Final Exam (Theory)', percentage: 50 }
    ]
  },

  // YEAR 2, SEMESTER 3
  { 
    code: 'CO2010', 
    name: 'Digital Circuits Design', 
    credits: 4, 
    gpaIncluded: true, 
    semester: 3, 
    year: 2,
    aim: 'To introduce digital electronics with emphasis on practical design techniques.',
    content: [
      { title: 'Introduction', subtopics: ['Purpose of logic circuits in systems', 'Boolean logic', 'Basic logic gates', 'Integration levels', 'Design flow', 'Logic families'] },
      { title: 'Data representation', subtopics: ['Binary/hex number systems', 'Unsigned and signed representation', 'Binary arithmetic'] },
      { title: 'Boolean logic', subtopics: ['Operations, laws and theorems', 'Sum-of-products/Product-of-sums', 'Karnaugh maps', 'Quine Mc-Cluskey', 'Don’t care combinations'] },
      { title: 'Basic logic circuits', subtopics: ['Gate implementations', 'Three-state logic', 'Multi-level gates', 'Positive/negative/mixed-logic', 'Design tradeoffs', 'HDL and logic synthesis'] },
      { title: 'Combinational logic', subtopics: ['Multiplexers', 'Encoders/Decoders', 'Adders', 'Subtractors', 'Shifters', 'Arithmetic & Logic Unit (ALU)'] },
      { title: 'Sequential logic and memory', subtopics: ['Latches', 'Gated/master-slave operation', 'Flip-flops', 'Timing characteristics', 'Registers and counters', 'Static and dynamic memory'] },
      { title: 'Synchronous sequential design', subtopics: ['FSM models', 'State diagrams and tables', 'State minimization', 'State assignment'] },
      { title: 'Asynchronous design', subtopics: ['Design procedure', 'Flow tables', 'Reduction of states', 'Race-free assignment'] },
      { title: 'Programmable logic', subtopics: ['History', 'Architectures', 'Basic elements'] }
    ],
    assessment: [
      { label: 'Practicals Assignments', percentage: 40 },
      { label: 'Final Assessment (Theory)', percentage: 40 },
      { label: 'Final Assessment (Practical)', percentage: 20 }
    ]
  },
  { 
    code: 'CO2020', 
    name: 'Computer Networking', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 3, 
    year: 2,
    aim: 'To provide a fundamental view behind computer networks and their protocols.',
    content: [
      { title: 'Introduction to Networking', subtopics: ['What is the internet', 'Network edge and core', 'Packet-switched networks', 'Performance measurement', 'Layered architecture', 'Networks under attack'] },
      { title: 'Application Layer', subtopics: ['Web and HTTP', 'FTP/email/DNS', 'P2P applications', 'Socket programming (UDP, TCP)', 'Network distributions'] },
      { title: 'Transport Layer', subtopics: ['UDP and TCP', 'Reliable data transfer', 'Congestion control', 'Evolution of transport functionality'] },
      { title: 'Network Layer: Data Plane', subtopics: ['Forwarding and routing', 'Router design', 'IP design', 'SDN', 'Middleboxes (firewalls, NAT)'] },
      { title: 'Network Layer: Control Plane', subtopics: ['Routing algorithms', 'Intra-AS and Exterior protocols', 'SDN control plane', 'Network management'] },
      { title: 'Link Layer and LANs', subtopics: ['Link layer services', 'Error detection and correction', 'Multiple access protocols'] },
      { title: 'Retrospection', subtopics: ['A day in the life of a web page request', 'Troubleshooting analysis', 'Reliability and flow control'] }
    ],
    assessment: [
      { label: 'Practicals (programming projects)', percentage: 30 },
      { label: 'Tutorials, Quizzes/Assignments', percentage: 20 },
      { label: 'Mid Semester Evaluation', percentage: 20 },
      { label: 'Final Assessment (Theory)', percentage: 30 }
    ]
  },
  { 
    code: 'CO2030', 
    name: 'Data Structures and Algorithms II', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 3, 
    year: 2,
    aim: 'To expand the notion of efficiently representing and solving non-trivial computational problems using complex data structures.',
    content: [
      { title: 'Trees', subtopics: ['Tree ADT', 'Tree traversal', 'Binary search trees', 'Balanced BSTs (AVL, red-black)', 'Binary heaps', 'Priority queues', 'Heapsort', 'B-trees', 'Radix-trees'] },
      { title: 'Graphs', subtopics: ['Graph ADT', 'Traversal (DFS, BFS)', 'Topological sort', 'Eulerian and Hamiltonian cycles', 'Spanning trees (Kruskal, Prim)', 'Greedy algorithms/Local optima', 'Shortest-path (Dijkstra, A*, Floyd-Warshall)', 'Reachability', 'Graph coloring'] },
      { title: 'Hashing', subtopics: ['Associative-array ADT', 'Dictionary problem', 'Hash table implementations', 'Hash functions and codes', 'Collision handling', 'Memoization', 'No-SQL databases'] }
    ],
    assessment: [
      { label: 'Practicals & quizzes', percentage: 50 },
      { label: 'Final Assessment (Theory)', percentage: 30 },
      { label: 'Final Assessment (Practical)', percentage: 20 }
    ]
  },
  { 
    code: 'CO2040', 
    name: 'Software Design and Development', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 3, 
    year: 2,
    aim: 'To familiarize students with the fundamental principles of software engineering and design.',
    content: [
      { title: 'Software Process', subtopics: ['Goals and challenges', 'Process models', 'Evolution', 'Agile development details'] },
      { title: 'Requirement Analysis', subtopics: ['Functional vs non-functional requirements', 'Use cases'] },
      { title: 'Software Design', subtopics: ['Design fundamentals', 'Design qualities', 'Object oriented design (OOD)', 'Design patterns'] },
      { title: 'Software Testing', subtopics: ['Blackbox vs glass-box', 'Test case design', 'Unit testing', 'Integration testing', 'Test frameworks'] },
      { title: 'Web Applications', subtopics: ['HTTP and HTML', 'Processing user input', 'Dynamic output', 'Client-side scripting'] }
    ],
    assessment: [
      { label: 'Practicals & quizzes', percentage: 60 },
      { label: 'Final Assessment (Theory)', percentage: 40 }
    ]
  },
  { 
    code: 'CO2060', 
    name: 'Software Systems Design Project', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 3, 
    year: 2,
    aim: 'To provide opportunity to design and implement a non-trivial software system with a database component.',
    content: [
      { title: 'Requirement analysis and elicitation', subtopics: ['Identification and presenting of functional/non-functional requirements', 'Relevant tools'] },
      { title: 'Software systems design and development', subtopics: ['Software and database design concepts', 'Non-trivial software solutions', 'UX design', 'Software deployment', 'Version control', 'Code reusability'] },
      { title: 'Software testing', subtopics: ['Unit testing', 'Integration testing', 'Acceptance testing'] }
    ],
    assessment: [
      { label: 'Requirement analysis (oral/written)', percentage: 30 },
      { label: 'Progress evaluations (design/test)', percentage: 40 },
      { label: 'Final project evaluation', percentage: 30 }
    ]
  },
  { 
    code: 'EM2020', 
    name: 'Probability and Statistics', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 3, 
    year: 2,
    aim: 'To introduce basic concepts of probability and inferential statistics.',
    content: [
      { title: 'Concepts of probability', subtopics: ['Discrete/continuous random variables', 'Probability distributions', 'Mean/expectation/variance', 'Moment generating functions'] },
      { title: 'Discrete probability distributions', subtopics: ['Bernoulli', 'Binomial', 'Poisson', 'Geometric', 'Hypergeometric'] },
      { title: 'Continuous probability distributions', subtopics: ['Uniform', 'Exponential', 'Normal', 'Student-t', 'Weibull', 'Chi-squared'] },
      { title: 'Sampling distributions', subtopics: ['Central limit theorem', 'Normal approximation', 'Sample mean/variance distribution'] },
      { title: 'Estimation and Confidence Intervals', subtopics: ['Calculation of CIs for mean', 'Difference of means', 'Variance'] },
      { title: 'Test of Hypothesis', subtopics: ['Hypothesis for mean', 'Difference of means'] }
    ],
    assessment: [
      { label: 'Tutorials/Assignments/Quizzes', percentage: 10 },
      { label: 'Mid Semester Examination', percentage: 30 },
      { label: 'Final Assessment (Theory)', percentage: 60 }
    ]
  },
  { 
    code: 'EM2060', 
    name: 'Numerical Methods', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 3, 
    year: 2,
    aim: 'To apply and analyze numerical methods for modeling and simulation.',
    content: [
      { title: 'Preliminaries', subtopics: ['Floating point arithmetic', 'Big O notation', 'Matrix norms', 'Review of programming'] },
      { title: 'Error Analysis', subtopics: ['Numerical solutions to nonlinear equations', 'Fixed point iteration', 'Bisection', 'Newton-Raphson'] },
      { title: 'Systems of linear equations', subtopics: ['Gaussian elimination', 'Jacobi method', 'Gauss-Seidel'] },
      { title: 'Interpolation', subtopics: ['Lagrange interpolating polynomial', 'Newton’s interpolating polynomials', 'Spline interpolation'] },
      { title: 'Numerical integration', subtopics: ['Trapezoidal rule', 'Simpson rule', 'Gaussian quadrature'] },
      { title: 'Ordinary differential equations', subtopics: ['Initial value problems', 'Euler method', 'Runge-Kutta', 'Boundary value problems', 'Finite difference method'] },
      { title: 'Partial differential equations', subtopics: ['Explicit and implicit finite difference', 'Finite element methods basics'] }
    ],
    assessment: [
      { label: 'Lab assignments, tutorials', percentage: 40 },
      { label: 'Final Assessment (Theory)', percentage: 60 }
    ]
  },

  // YEAR 2, SEMESTER 4
  { 
    code: 'CO2050', 
    name: 'Database Systems', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 4, 
    year: 2,
    aim: 'To familiarize students with basic theoretical and practical concepts of database management systems.',
    content: [
      { title: 'Introduction', subtopics: ['Information models and systems', 'Evolution', 'DBMS approach', 'Components/Architecture', 'Data independence', 'Life cycle'] },
      { title: 'Data modeling', subtopics: ['ER/EER and UML', 'Logical models (relational vs object oriented)', 'Relational mapping', 'NoSQL models'] },
      { title: 'RDBMS concepts', subtopics: ['Normalization (1NF to BCNF)', 'Object oriented extensions'] },
      { title: 'Database query languages', subtopics: ['4GL environments', 'SQL (DDL, DML, DCL)', 'Triggers and views'] },
      { title: 'Database programming', subtopics: ['Embedded SQL', 'Function/procedure calls (ODBC, JDBC)', 'Object-relational mapping'] },
      { title: 'Index and Transactions', subtopics: ['Types of indexes', 'ACID properties', 'Concurrency control', 'Failure and recovery'] },
      { title: 'Security', subtopics: ['Security issues and threats', 'Access privileges', 'Privacy and encryption'] }
    ],
    assessment: [
      { label: 'Practicals & quizzes', percentage: 50 },
      { label: 'Final Assessment (Theory)', percentage: 50 }
    ]
  },
  { 
    code: 'CO2070', 
    name: 'Computer Architecture', 
    credits: 4, 
    gpaIncluded: true, 
    semester: 4, 
    year: 2,
    aim: 'To provide a strong understanding on the role of microprocessors and microprocessor design.',
    content: [
      { title: 'Introduction', subtopics: ['Review of computer system organization', 'History and current trends'] },
      { title: 'Performance evaluation', subtopics: ['Metrics', 'Response time vs throughput', 'Clock rate', 'Cycles per instruction', 'Benchmarks', 'Design tradeoffs'] },
      { title: 'ISA', subtopics: ['Programmer model', 'Instruction encoding', 'Operand types', 'Instruction types', 'Register conventions', 'Addressing modes', 'CISC vs RISC'] },
      { title: 'CPU organization', subtopics: ['Implementation of Von Neumann machine', 'Datapath and control', 'Register file', 'ALU', 'Instruction fetching/decoding', 'Verilog HDL behavioral modeling'] },
      { title: 'Pipelining', subtopics: ['Instruction level parallelism', 'Pipeline hazards and stalls', 'Data forwarding', 'Branch prediction'] },
      { title: 'Memory sub-system', subtopics: ['Memory technologies', 'Locality principles', 'Cache performance', 'Multi-level caches', 'Virtual memory/Page tables'] },
      { title: 'Interfacing and I/O', subtopics: ['Bus interconnects', 'Synchronization and arbitration', 'Mapped vs Ported I/O', 'DMA', 'Systems-on-chip'] },
      { title: 'Multiprocessor systems', subtopics: ['Parallel processing', 'Shared-memory', 'Symmetric vs Distributed', 'Cache coherence/Snooping', 'Message passing', 'Flynn’s classification'] }
    ],
    assessment: [
      { label: 'Practical assignments & quizzes', percentage: 50 },
      { label: 'Final Assessment (Theory)', percentage: 50 }
    ]
  },
  { 
    code: 'CO2080', 
    name: 'Network Design Principles', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 4, 
    year: 2,
    aim: 'To further explore fundamental concepts in the design and implementation of computer communication networks.',
    content: [
      { title: 'Network Design Principles', subtopics: ['Ethernet/IEEE 802.3', 'Multiple-access protocols (CSMA/CD)', 'Switched LANs (L2 switches)', 'VLANs', 'Subnetting and supernetting', 'L3 switches/routers', 'Diagnostics and tools'] },
      { title: 'Campus Networks', subtopics: ['Complex designs with switched LANs', 'VLAN design', 'Routing implementations'] },
      { title: 'Network Programming Project', subtopics: ['Layered application development', 'Blocking/Non-blocking calls', 'IO multiplexing', 'Signal handling', 'Asynchronous IO'] },
      { title: 'Performance and Reliability', subtopics: ['Reliability/flow-control', 'Multiplexing across layers', 'Troubleshooting roundup'] }
    ],
    assessment: [
      { label: 'Network Design and Programming Projects', percentage: 40 },
      { label: 'Tutorials, Quizzes and Assignments', percentage: 10 },
      { label: 'Mid Semester Evaluation', percentage: 20 },
      { label: 'Final Assessment (Theory)', percentage: 30 }
    ]
  },
  { 
    code: 'EE2820', 
    name: 'Applied Electronics', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 4, 
    year: 2,
    aim: 'To provide essential fundamental knowledge to design and implement electronic circuits for practical applications.',
    content: [
      { title: 'Operational Amplifiers (OPAMP)', subtopics: ['The ideal OPAMP', 'Open-loop gain/resistance', 'Slew rate/bandwidth', 'Cllipping and rejection ratios'] },
      { title: 'OPAMP Applications', subtopics: ['Linear: Inverting/summing/differential', 'Nonlinear: Precision rectifiers', 'Schmitt-trigger', 'Logarithmic amplifiers'] },
      { title: 'Active Filters', subtopics: ['Low-pass/band-pass/stop sections', 'Butterworth/Chebyshev/Elliptic', 'Circuit realization', 'Frequency/Impedance scaling'] },
      { title: 'Data conversion circuits', subtopics: ['ADC/DAC definitions', 'Codes and linearity', 'Counting converters', 'Sample-and-hold circuits', 'Integrating analog signals'] },
      { title: 'Oscillators', subtopics: ['Basic concepts', 'Wien-bridge oscillator'] },
      { title: 'Circuit modeling', subtopics: ['Introduction to CAD tools', 'DC/AC/Transient analysis', 'Simulation control options'] },
      { title: 'Logic Circuits', subtopics: ['SOP/POS K-map simplification', 'Edge triggered flip flops', 'Shift registers and counters', 'Timing diagrams'] }
    ],
    assessment: [
      { label: 'Assignments/Tutorials/Quizzes', percentage: 25 },
      { label: 'Practical Work', percentage: 15 },
      { label: 'Final Assessment (Theory)', percentage: 60 }
    ]
  },
  { 
    code: 'EM2010', 
    name: 'Calculus II', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 4, 
    year: 2,
    aim: 'To introduce calculus of functions of several variables and integral theorems.',
    content: [
      { title: 'Functions of several variables', subtopics: ['Sketching level curves/surfaces', 'Limits and continuity', 'Tangent planes', 'Scalar line integrals'] },
      { title: 'Double and Triple Integration', subtopics: ['Integration over rectangular/general domains', 'Jacobian properties', 'Change of coordinates (polar/cylindrical/spherical)'] },
      { title: 'Vector Fields and Vector Operators', subtopics: ['Scalar vs Vector fields', 'Gradient', 'Divergence', 'Curl', 'Geometrical interpretations'] },
      { title: 'Line, Surface and Volume Integrals', subtopics: ['Path independence', 'Connected domains', 'Conservative vector fields', 'Area and volume elements'] },
      { title: 'Integral Theorems', subtopics: ['Green\'s Theorem', 'Stokes’ theorem', 'Divergence theorem', 'Applications in curvilinear coordinates'] }
    ],
    assessment: [
      { label: 'Tutorials/Assignments/Quizzes', percentage: 10 },
      { label: 'Mid Semester Examination', percentage: 30 },
      { label: 'Final Assessment (Theory)', percentage: 60 }
    ]
  },

  // YEAR 3, SEMESTER 5
  { 
    code: 'CO3010', 
    name: 'Embedded Systems', 
    credits: 4, 
    gpaIncluded: true, 
    semester: 5, 
    year: 3,
    aim: 'To provide a broad understanding on developing embedded computer systems containing hardware and software components.',
    content: [
      { title: 'Introduction', subtopics: ['Applications', 'Dependability/Efficiency metrics', 'Event-driven architecture', 'Controller platform types'] },
      { title: 'Microcontrollers', subtopics: ['Instructions and addressing modes', 'Memory organization (EEPROM, banked)', 'Bootup process', 'Programming (C/Assembly)'] },
      { title: 'Interrupts', subtopics: ['System usage', 'Vectors and service routines', 'Priority and nesting', 'Interrupts vs Polling'] },
      { title: 'Timing and Waveform', subtopics: ['Device operation', 'Timing accuracy', 'PWM applications'] },
      { title: 'Data acquisition', subtopics: ['ADC/DAC characteristics', 'Sampling rate', 'Precision and encoding', 'Sensors and actuators'] },
      { title: 'Serial communication', subtopics: ['Half/Full duplex', 'SPI/I2C/UART/USART/RS485/USB/CAN', 'Protocol implementations'] },
      { title: 'Mobile/Networked systems', subtopics: ['Topologies', 'Data and control flow', 'Wireless connectivity', 'LPM techniques'] },
      { title: 'Industrial standards', subtopics: ['MQTT', 'IEEE-488', 'SCADA', 'OPC UA', 'PLCs', 'Modbus/Profibus'] }
    ],
    assessment: [
      { label: 'Practicals & quizzes', percentage: 50 },
      { label: 'Final Assessment (Theory)', percentage: 30 },
      { label: 'Final Assessment (Practical)', percentage: 20 }
    ]
  },
  { 
    code: 'CO3040', 
    name: 'Cloud Computing Systems', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 5, 
    year: 3,
    aim: 'To provide a broad understanding on design and development of distributed networked software applications.',
    content: [
      { title: 'Networked application preliminaries', subtopics: ['C/S vs P2P architecture', 'Datagram vs Stream sockets', 'Data serialization (binary, text)', 'Deutsch’s fallacies'] },
      { title: 'Request-response protocols', subtopics: ['HTTP request/response structure', 'Metadata and status codes', 'JSON serialization'] },
      { title: 'Concurrency', subtopics: ['Threads/processes/coroutines', 'Data races', 'Transactions', 'Finite automata modeling'] },
      { title: 'Remote procedure calls', subtopics: ['RPC abstraction', 'IDLs', 'Failure modes', 'Protocol buffers'] },
      { title: 'Asynchronous coordination', subtopics: ['Publish-subscribe', 'MQTT', 'Message brokers', 'QoS delivery semantics'] },
      { title: 'Distributed data storage', subtopics: ['Streaming datastores', 'BLOB storage', 'Distributed hash tables', 'Consistency models (Brewer’s CAP)'] },
      { title: 'Application security', subtopics: ['Threat models (STRIDE)', 'Oauth/Webauthn', 'IoT security considerations'] },
      { title: 'Provisioning and Observability', subtopics: ['IaaS vs PaaS', 'Infrastructure as code', 'Containers (K8s)', 'SLOs', 'Postmortem/Root cause analysis'] }
    ],
    assessment: [
      { label: 'Practical assignments', percentage: 30 },
      { label: 'Quizzes (programming, written, oral)', percentage: 30 },
      { label: 'Final Assessment (Theory)', percentage: 40 }
    ]
  },
  { 
    code: 'CO3060', 
    name: 'Computer Systems Design Project', 
    credits: 6, 
    gpaIncluded: true, 
    semester: 5, 
    year: 3,
    aim: 'To provide guidance to work as a team to design and implement a real-world cyber-physical system.',
    content: [
      { title: 'Product Design', subtopics: ['Classification', 'Requirement specification', 'Market analysis', 'Project planning', 'Management best practices'] },
      { title: 'Cyber-Physical Systems', subtopics: ['Architecture', 'Embedded hardware (sensing/control)', 'Cloud deployment'] },
      { title: 'Systems and Security', subtopics: ['Information flow control', 'Network security', 'Software applications security'] },
      { title: 'Systems Testing', subtopics: ['Planning', 'Test types', 'Case design'] },
      { title: 'User-Experience', subtopics: ['UX vs UI', 'UX design best practices', 'Usability studies'] },
      { title: 'Computer Aided Design', subtopics: ['System design tools', 'Electronics design', '2D/3D design'] },
      { title: 'Presentation of Information', subtopics: ['Best practices in oral presentation', 'Online documentation and reporting'] }
    ],
    assessment: [
      { label: 'Progress evaluations (design, implementation)', percentage: 70 },
      { label: 'Final project evaluation (oral/written)', percentage: 30 }
    ]
  },

  // YEAR 3, SEMESTER 6
  { 
    code: 'CO3020', 
    name: 'Operating Systems', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 6, 
    year: 3,
    aim: 'To provide an understanding on the fundamental concepts in operating systems and their application.',
    content: [
      { title: 'Introduction', subtopics: ['Role of OS', 'History', 'Kernel', 'Computer system structure'] },
      { title: 'Basic OS concepts', subtopics: ['Concurrency and deadlocks', 'Memory management', 'File system', 'Scheduling', 'Information protection'] },
      { title: 'Interrupts and exceptions', subtopics: ['Cycle', 'Hardware exception handling', 'Stack frames'] },
      { title: 'System calls', subtopics: ['Role', 'Classes', 'Mechanism', 'Calling conventions'] },
      { title: 'Processes and threads', subtopics: ['Creation and termination', 'States', 'Implementation', 'User-level vs Kernel threads', 'Context switch'] },
      { title: 'Concurrency and synchronization', subtopics: ['Busy waiting', 'Synchronization primitives (Semaphores, Monitors)', 'Deadlock modeling and detection'] },
      { title: 'Memory management', subtopics: ['Partitioning', 'Swapping', 'Virtual memory/Paging', 'Page tables', 'Segmentation'] },
      { title: 'File systems', subtopics: ['Access methods', 'Directory organization', 'File system implementation', 'Virtual file system'] },
      { title: 'Input/output management', subtopics: ['Device controllers', 'Bus architectures', 'Interrupt-driven I/O', 'DMA', 'Device drivers'] }
    ],
    assessment: [
      { label: 'Practicals & quizzes', percentage: 50 },
      { label: 'Final Assessment (Theory)', percentage: 50 }
    ]
  },
  { 
    code: 'CO3030', 
    name: 'Computer Systems Security', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 6, 
    year: 3,
    aim: 'To provide a broad understanding about the importance of computer systems security and Approaches to mitigate vulnerabilities.',
    content: [
      { title: 'Concepts', subtopics: ['Importance of security', 'History and impact', 'Basic concepts', 'Threat models', 'Security goals'] },
      { title: 'Cryptography', subtopics: ['Modern protocols', 'Encryption/Authentication', 'Hash functions', 'Symmetric vs Public-key', 'Zero-knowledge proofs'] },
      { title: 'Software Security', subtopics: ['Importance', 'Authentication vs Authorization', 'Sandboxing'] },
      { title: 'Network Security', subtopics: ['Secure protocols (TCP/IP)', 'Firewalls', 'Segmentation', 'Intrusion detection'] },
      { title: 'Web Security', subtopics: ['SSL/HTTPS', 'OAuth2', 'Permission validation (OPA, SSO)'] },
      { title: 'Hardware Security', subtopics: ['Hardware security modules', 'Side-channel attacks', 'Hardware trojans'] },
      { title: 'Advanced Topics', subtopics: ['Blockchain', 'Privacy (GDPR)', 'AI-driven security', 'Ethical hacking'] }
    ],
    assessment: [
      { label: 'Practical assignments & quizzes', percentage: 40 },
      { label: 'Final Assessment (Theory)', percentage: 60 }
    ]
  },
  { 
    code: 'CO3050', 
    name: 'Signal Processing', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 6, 
    year: 3,
    aim: 'To provide an in-depth understanding of signal processing techniques and their applications.',
    content: [
      { title: 'Signal Analysis', subtopics: ['Deterministic vs random', 'Digital vs analog', 'Transformations of the independent variable'] },
      { title: 'Time Domain Processing', subtopics: ['Convolution', 'Autocorrelation', 'Fourier series (periodic)', 'Power spectral density'] },
      { title: 'Frequency Domain Processing', subtopics: ['Fourier transform', 'Energy spectral density', 'Laplace transform', 'Bode plots', 'Nyquist plots'] },
      { title: 'Digital Signal Processing', subtopics: ['Sampling', 'Information theory', 'Hartley/Shannon\'s Law', 'DTFT/DFS/DFT', 'FFT', 'z-transform', 'Filter design (FIR/IIR)'] },
      { title: 'Image Processing', subtopics: ['Human vision system', 'Sampling/quantization', 'Spatial domain techniques', 'Point/group processing'] },
      { title: 'Cellular and Wireless', subtopics: ['The cellular concept', 'Wireless LANs', 'Mobility management', 'GSM/UMTS/LTE/5G'] }
    ],
    assessment: [
      { label: 'Practical Assignments & Quizzes', percentage: 50 },
      { label: 'Final Assessment (Theory)', percentage: 50 }
    ]
  },
  { 
    code: 'CO3090', 
    name: 'Machine Learning Theory', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 6, 
    year: 3,
    aim: 'To introduce students to the mathematical foundations of machine learning.',
    content: [
      { title: 'Introduction', subtopics: ['Biological motivations', 'Generalization', 'Defining learning algorithms', 'State-of-the-art applications'] },
      { title: 'Foundations', subtopics: ['Probability uncertainty', 'Bayes Theorem', 'Law of large numbers', 'Multivariate Gaussian', 'Convexity optimisation'] },
      { title: 'Linear Algebra in ML', subtopics: ['Matrix solutions', 'Eigenvalues/eigenvectors', 'Singular value decomposition'] },
      { title: 'Supervised Learning', subtopics: ['Regression analysis', 'Bayesian classification', 'Perceptron/SVM/ANN', 'Multi-layer perceptrons', 'Discriminant analysis'] },
      { title: 'Unsupervised Learning', subtopics: ['PCA', 'K-Means clustering', 'Spectral clustering'] },
      { title: 'Model-fitting', subtopics: ['Linear/Polynomial regression', 'Kernel based networks'] }
    ],
    assessment: [
      { label: 'Practical assignments & quizzes', percentage: 40 },
      { label: 'Final Assessment (Theory)', percentage: 60 }
    ]
  },
  { 
    code: 'CO3100', 
    name: 'Research Methodology', 
    credits: 1, 
    gpaIncluded: true, 
    semester: 6, 
    year: 3,
    aim: 'To guide the students to work as a team to identify a research problem and familiarize with scientific planning.',
    content: [
      { title: 'Introduction', subtopics: ['Research ethics', 'Formulating research questions'] },
      { title: 'Review of existing work', subtopics: ['Research articles', 'Literature review techniques'] },
      { title: 'Scientific method', subtopics: ['Project planning', 'Experiments', 'Statistical methods', 'Scientific writing', 'Peer evaluation'] }
    ],
    assessment: [
      { label: 'Literature review', percentage: 70 },
      { label: 'Preliminary project proposal', percentage: 30 }
    ]
  },

  // YEAR 4, SEMESTER 7
  { 
    code: 'CO3070', 
    name: 'Fundamentals of Artificial Intelligence', 
    credits: 3, 
    gpaIncluded: true, 
    semester: 7, 
    year: 4,
    aim: 'To impart a working knowledge of the foundations of modern Artificial Intelligence.',
    content: [
      { title: 'Introduction', subtopics: ['Foundations and history', 'Mapping current state', 'Intelligent Agents', 'Rationality'] },
      { title: 'Search', subtopics: ['Solving by searching', 'Uninformed vs Informed strategies', 'Heuristic Functions', 'Adversarial search (Game theory)', 'Minimax/Alpha-Beta pruning'] },
      { title: 'Optimization', subtopics: ['Local search', 'Constraint Satisfaction Problems'] },
      { title: 'Knowledge and Reasoning', subtopics: ['Logic (Propositional, First Order)', 'Knowledge Engineering', 'Inference'] },
      { title: 'Uncertainty', subtopics: ['Probability theory', 'Probabilistic Reasoning', 'Bayesian Networks', 'Markov Models'] },
      { title: 'Advanced Topics', subtopics: ['Reinforcement Learning', 'Neural Networks', 'Natural Language Processing'] }
    ],
    assessment: [
      { label: 'Practical assignments and quizzes', percentage: 60 },
      { label: 'Final Assessment (Theory)', percentage: 40 }
    ]
  },
  { 
    code: 'CO3080', 
    name: 'Applied Operating Systems', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 7, 
    year: 4,
    aim: 'To provide a broad understanding on the advanced concepts of applied operating systems.',
    content: [
      { title: 'Real Time Operating Systems', subtopics: ['RTOS components', 'Task scheduling', 'Inter-task communication'] },
      { title: 'Virtualization', subtopics: ['History and requirements', 'Hypervisor types', 'Nested page tables', 'I/O Virtualization (IOMMU)'] },
      { title: 'Cloud Computing OS', subtopics: ['Clouds as a service', 'Virtual machine migration', 'Checkpointing'] },
      { title: 'OS Security', subtopics: ['Importance', 'Secure environments', 'Access control', 'Malware defenses'] }
    ],
    assessment: [
      { label: 'Practical assignments & quizzes', percentage: 40 },
      { label: 'Final Assessment (Theory)', percentage: 60 }
    ]
  },
  { 
    code: 'CO4010', 
    name: 'Professional Practices for Computer Engineers', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 7, 
    year: 4,
    aim: 'To prepare students for a career in computer engineering by exposure to professional practices.',
    content: [
      { title: 'The Profession', subtopics: ['Education and career prospects', 'CPD', 'Certification and licensing', 'Professional societies', 'Nature of standards'] },
      { title: 'Legal and Economic', subtopics: ['Impact of computer systems', 'IP and legal issues', 'Trade-off analysis', 'Communication skills'] },
      { title: 'Portfolio Development', subtopics: ['Building and maintaining a professional portfolio'] },
      { title: 'Dynamics', subtopics: ['Group dynamics and psychology', 'Multicultural environments', 'Dealing with ambiguity'] }
    ],
    assessment: [
      { label: 'Practicals & quizzes', percentage: 70 },
      { label: 'End of course evaluation', percentage: 30 }
    ]
  },
  { 
    code: 'CO4020', 
    name: 'Software Project Management', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 7, 
    year: 4,
    aim: 'To familiarize students with techniques and tools to plan, execute and monitor software projects.',
    content: [
      { title: 'Project Management Intro', subtopics: ['Project goals', 'Assumptions and forecasts', 'Cost/benefit analysis'] },
      { title: 'Life Cycle and Organization', subtopics: ['Estimation techniques', 'Scheduling', 'Project management tools'] },
      { title: 'Team structures', subtopics: ['Responsibilities', 'Meeting structures', 'Conflict resolution', 'Virtual teams'] },
      { title: 'Risk and Quality', subtopics: ['Risk identification', 'Risk planning (Tolerance)', 'Quality metrics and models', 'Process improvement (CMMI, ISO9000)', 'Communication management'] }
    ],
    assessment: [
      { label: 'Practical assignments & quizzes', percentage: 50 },
      { label: 'Final Assessment (Theory)', percentage: 50 }
    ]
  },
  { 
    code: 'CO4030', 
    name: 'Information Systems Management', 
    credits: 2, 
    gpaIncluded: true, 
    semester: 7, 
    year: 4,
    aim: 'To introduce the complexities related to designing and maintaining IS for large scale business.',
    content: [
      { title: 'IS and Business', subtopics: ['Aligning IT with competencies', 'Competitive position', 'Fostering competition'] },
      { title: 'Planning and Budgeting', subtopics: ['Operating principles', 'Structuring IS organization', 'Hiring and retaining professionals', 'Determining skills models'] },
      { title: 'Resources and Capabilities', subtopics: ['Infrastructure capabilities', 'Sourcing information systems'] },
      { title: 'Risk Management', subtopics: ['Business continuity', 'Security and privacy', 'IS/IT governance'] }
    ],
    assessment: [
      { label: 'Practical assignments, case studies, quizzes', percentage: 50 },
      { label: 'Final Assessment (Theory)', percentage: 50 }
    ]
  },
  { 
    code: 'CO4060', 
    name: 'Computer Engineering Research Project', 
    credits: 6, 
    gpaIncluded: true, 
    semester: 7, 
    year: 4,
    aim: 'To provide students with opportunity to execute a project with a major research component.',
    content: [
      { title: 'Planning and Management', subtopics: ['Developing research problem', 'Devising plan', 'Reference management', 'Literature assessment'] },
      { title: 'Empirical research', subtopics: ['Conducting experiments', 'Statistical methods'] },
      { title: 'Research writing', subtopics: ['Standard structures', 'Writing process', 'Appropriate styles'] },
      { title: 'Publishing', subtopics: ['Peer-review', 'Ethics in publications', 'Being a reviewer'] },
      { title: 'Presentations', subtopics: ['Delivering presentations', 'Poster presentations', 'Evaluation by supervisor'] }
    ],
    assessment: [
      { label: 'Project proposal and literature review', percentage: 15 },
      { label: 'Progress evaluations', percentage: 30 },
      { label: 'Evaluation by the supervisor', percentage: 25 },
      { label: 'Final project evaluation', percentage: 30 }
    ]
  },

  // INDUSTRIAL TRAINING
  { 
    code: 'EF4010', 
    name: 'Industrial Training', 
    credits: 6, 
    gpaIncluded: false, 
    semester: 0, 
    year: 4,
    aim: 'To provide industrial exposure for students to acquire knowledge and develop professional skills.',
    content: [
      { title: 'The Training Programme', subtopics: ['Importance and parties involved', 'Schedules', 'Reporting and behavior'] },
      { title: 'Knowledge Acquisition', subtopics: ['Management structure', 'SOPs', 'Health and safety', 'Applying engineering principles'] },
      { title: 'Professional Skills', subtopics: ['Daily diary maintenance', 'Effective presentations', 'Social aspects and Sustainability'] }
    ],
    assessment: [
      { label: 'Mid Training Presentation', percentage: 10 },
      { label: 'Final Assessment (Practical)', percentage: 90 }
    ]
  },
];
