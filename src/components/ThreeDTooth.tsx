import React, { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face {
  indices: number[];
  type: 'crown' | 'root' | 'occlusal';
  name: string;
}

interface Edge {
  a: number;
  b: number;
  type?: 'crown' | 'root' | 'groove';
}

export default function ThreeDTooth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Physics momentum refs
  const dragStart = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0.2, y: 0.8 }); // initial tilt
  const velocity = useRef({ x: 0, y: 0.005 }); // initial rotation velocity
  const lastTime = useRef(Date.now());

  // 1. Precise 3D Vertex Definition
  const vertices: Point3D[] = [
    // --- Crown Top Cusps (Occlusal table) ---
    { x: 0.45, y: 0.75, z: 0.45 },   // 0: Buccal-Mesial Cusp
    { x: -0.45, y: 0.75, z: 0.45 },  // 1: Buccal-Distal Cusp
    { x: -0.45, y: 0.75, z: -0.45 }, // 2: Lingual-Distal Cusp
    { x: 0.45, y: 0.75, z: -0.45 },  // 3: Lingual-Mesial Cusp
    { x: 0.0, y: 0.50, z: 0.0 },     // 4: Central Pit/Groove depression

    // --- Crown Outer Crest (Wide belly/ridge) ---
    { x: 0.68, y: 0.35, z: 0.68 },   // 5
    { x: -0.68, y: 0.35, z: 0.68 },  // 6
    { x: -0.68, y: 0.35, z: -0.68 }, // 7
    { x: 0.68, y: 0.35, z: -0.68 },  // 8

    // --- Cervix (Dental neck at gingivia) ---
    { x: 0.44, y: -0.15, z: 0.38 },   // 9
    { x: -0.44, y: -0.15, z: 0.38 },  // 10
    { x: -0.44, y: -0.15, z: -0.38 }, // 11
    { x: 0.44, y: -0.15, z: -0.38 },  // 12

    // --- Root bifurcation arches ---
    { x: 0.18, y: -0.55, z: 0.08 },   // 13: Mid core Root 1
    { x: -0.18, y: -0.55, z: 0.08 },  // 14: Mid core Root 2

    // --- Root apices (Tips) ---
    { x: 0.32, y: -1.15, z: 0.0 },    // 15: Root Apex 1 (Mesial)
    { x: -0.32, y: -1.15, z: 0.0 },   // 16: Root Apex 2 (Distal)
  ];

  // 2. High-Fidelity 3D Polygon Faces
  const faces: Face[] = [
    // --- Occlusal Cuspal slopes (masticating surface) ---
    { indices: [0, 1, 4], type: 'occlusal', name: 'Occlusal Surface' },
    { indices: [1, 2, 4], type: 'occlusal', name: 'Occlusal Surface' },
    { indices: [2, 3, 4], type: 'occlusal', name: 'Occlusal Surface' },
    { indices: [3, 0, 4], type: 'occlusal', name: 'Occlusal Surface' },

    // --- Upper Enamel Ridges (Cusps to Bellies) ---
    { indices: [0, 5, 6, 1], type: 'crown', name: 'Enamel Crown' },
    { indices: [1, 6, 7, 2], type: 'crown', name: 'Enamel Crown' },
    { indices: [2, 7, 8, 3], type: 'crown', name: 'Enamel Crown' },
    { indices: [3, 8, 5, 0], type: 'crown', name: 'Enamel Crown' },

    // --- Lower Enamel Ridges (Belly to Cervix) ---
    { indices: [5, 9, 10, 6], type: 'crown', name: 'Cervical Bridge' },
    { indices: [6, 10, 11, 7], type: 'crown', name: 'Cervical Bridge' },
    { indices: [7, 11, 12, 8], type: 'crown', name: 'Cervical Bridge' },
    { indices: [8, 12, 9, 5], type: 'crown', name: 'Cervical Bridge' },

    // --- Root Apex 1 Triangles (Double bifurcated roots) ---
    { indices: [9, 13, 15], type: 'root', name: 'Mesial Root' },
    { indices: [12, 13, 15], type: 'root', name: 'Mesial Root' },
    { indices: [9, 12, 15], type: 'root', name: 'Mesial Root Wall' },

    // --- Root Apex 2 Triangles ---
    { indices: [10, 14, 16], type: 'root', name: 'Distal Root' },
    { indices: [11, 14, 16], type: 'root', name: 'Distal Root' },
    { indices: [10, 11, 16], type: 'root', name: 'Distal Root Wall' },

    // --- Furcation Core connecting membranes ---
    { indices: [9, 10, 14, 13], type: 'root', name: 'Root Furcation' },
    { indices: [11, 12, 13, 14], type: 'root', name: 'Root Furcation Inner' }
  ];

  // 3. Mathematical wireframes for crisp borders
  const edges: Edge[] = [
    { a: 0, b: 1, type: 'crown' },
    { a: 1, b: 2, type: 'crown' },
    { a: 2, b: 3, type: 'crown' },
    { a: 3, b: 0, type: 'crown' },
    { a: 0, b: 4, type: 'groove' },
    { a: 1, b: 4, type: 'groove' },
    { a: 2, b: 4, type: 'groove' },
    { a: 3, b: 4, type: 'groove' },
    { a: 5, b: 6, type: 'crown' },
    { a: 6, b: 7, type: 'crown' },
    { a: 7, b: 8, type: 'crown' },
    { a: 8, b: 5, type: 'crown' },
    { a: 9, b: 10, type: 'crown' },
    { a: 10, b: 11, type: 'crown' },
    { a: 11, b: 12, type: 'crown' },
    { a: 12, b: 9, type: 'crown' },
    { a: 9, b: 15, type: 'root' },
    { a: 12, b: 15, type: 'root' },
    { a: 13, b: 15, type: 'root' },
    { a: 10, b: 16, type: 'root' },
    { a: 11, b: 16, type: 'root' },
    { a: 14, b: 16, type: 'root' },
    { a: 13, b: 14, type: 'groove' }
  ];

  // 4. Vector Cross Product to fetch Surface Normal angles for flat-shading
  const getFaceNormal = (
    v0: Point3D, 
    v1: Point3D, 
    v2: Point3D
  ): Point3D => {
    const ux = v1.x - v0.x;
    const uy = v1.y - v0.y;
    const uz = v1.z - v0.z;

    const vx = v2.x - v0.x;
    const vy = v2.y - v0.y;
    const vz = v2.z - v0.z;

    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;

    const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    return { x: nx / len, y: ny / len, z: nz / len };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // 1. Friction & momentum physics engine
      if (!isDragging) {
        rotation.current.y += velocity.current.y;
        rotation.current.x += velocity.current.x;

        // Apply friction decay over time
        velocity.current.y *= 0.95;
        velocity.current.x *= 0.95;

        // Ensure constant minimal sideways rotation so it doesn't stand still completely
        if (Math.abs(velocity.current.y) < 0.003) {
          rotation.current.y += 0.006;
        }
      }

      // Constrain vertical rotation pitch to prevent complete gimbal lock flip-ups
      rotation.current.x = Math.max(-0.6, Math.min(0.6, rotation.current.x));

      // 2. Refresh high contrast clear rect
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 15; // lower slightly to center root tips safely
      const scale = Math.min(canvas.width, canvas.height) * 0.42;

      // Trigonometry setup
      const cosX = Math.cos(rotation.current.x);
      const sinX = Math.sin(rotation.current.x);
      const cosY = Math.cos(rotation.current.y);
      const sinY = Math.sin(rotation.current.y);

      // Rotated and projected points mapping
      const rotatedPoints3D: Point3D[] = vertices.map(p => {
        // Rotate Y (sideways spin)
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;

        // Rotate X (vertical pitch)
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        return { x: x1, y: y2, z: z2 };
      });

      const projected = rotatedPoints3D.map(p => {
        // Perspective distance
        const dist = 3.2;
        const pers = dist / (dist - p.z);
        
        return {
          x: cx + p.x * scale * pers,
          y: cy - p.y * scale * pers, // invert Y
          depth: p.z
        };
      });

      // Ambient Point Light Source (top right forward)
      const lightSource: Point3D = { x: 0.35, y: 0.8, z: 0.8 };
      const len = Math.sqrt(lightSource.x * lightSource.x + lightSource.y * lightSource.y + lightSource.z * lightSource.z);
      const normLight = { x: lightSource.x / len, y: lightSource.y / len, z: lightSource.z / len };

      // 3. Painter's Algorithm -- calculate average depth for each face to sort them back-to-front
      const sortedFaces = faces.map((face, index) => {
        const depths = face.indices.map(idx => rotatedPoints3D[idx].z);
        const avgDepth = depths.reduce((sum, d) => sum + d, 0) / depths.length;
        return { face, avgDepth, index };
      }).sort((a, b) => a.avgDepth - b.avgDepth); // back faces drawn first, then front faces

      // 4. Draw shaded polygon faces
      sortedFaces.forEach(({ face }) => {
        const isExcluded = false;

        if (face.indices.length < 3) return;

        // Calculate face normal in 3D using transformed vertices
        const v0 = rotatedPoints3D[face.indices[0]];
        const v1 = rotatedPoints3D[face.indices[1]];
        const v2 = rotatedPoints3D[face.indices[2]];
        const normal = getFaceNormal(v0, v1, v2);

        // Standard Lambertian Shading Dot Product (Diffuse Highlight)
        // Clamp between 0.1 and 1.0 to prevent completely pitch black side surfaces
        const dotProduct = Math.max(0.12, normal.x * normLight.x + normal.y * normLight.y + normal.z * normLight.z);

        // Fetch color palette configuration (Ceramic Enamel)
        let fillColor = '';
        const baseAlpha = 0.94;

        // Soft pearl white transitions
        if (face.type === 'occlusal') {
          const h = Math.round(230 + dotProduct * 20);
          const s = Math.round(15 + dotProduct * 15);
          const l = Math.round(92 + dotProduct * 7);
          fillColor = `hsla(${h}, ${s}%, ${l}%, ${baseAlpha})`;
        } else if (face.type === 'crown') {
          const l = Math.round(88 + dotProduct * 10);
          fillColor = `rgba(${Math.round(250 * dotProduct + 5)}, ${Math.round(246 * dotProduct + 9)}, ${Math.round(238 * dotProduct + 17)}, ${baseAlpha})`;
        } else {
          // roots look ivory creamy structure
          fillColor = `rgba(${Math.round(244 * dotProduct + 10)}, ${Math.round(238 * dotProduct + 15)}, ${Math.round(226 * dotProduct + 20)}, ${baseAlpha})`;
        }

        // Draw the filled path
        ctx.beginPath();
        const pStart = projected[face.indices[0]];
        ctx.moveTo(pStart.x, pStart.y);
        for (let idx = 1; idx < face.indices.length; idx++) {
          const pt = projected[face.indices[idx]];
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();

        ctx.fillStyle = fillColor;
        ctx.fill();

        // Trace subtle inner wire seams for structural beauty
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // 5. Draw overlay structural boundary edges
      edges.forEach(edge => {
        const pA = projected[edge.a];
        const pB = projected[edge.b];
        const avgDepth = (pA.depth + pB.depth) / 2;

        const isExcluded = false;

        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);

        let color = '#b8975a'; // gold
        let lineWidth = 1.8;

        if (edge.type === 'root') {
          color = '#dedcd3';
          lineWidth = 1.25;
        } else if (edge.type === 'groove') {
          color = '#0abab5';
          lineWidth = 0.95;
        }

        // Apply depth fading (simulated 3D fog of edge lines)
        const depthFog = Math.max(0.12, Math.min(1.0, (avgDepth + 1.2) / 2.4));
        const finalOpacity = depthFog;

        ctx.strokeStyle = color;
        ctx.globalAlpha = finalOpacity;
        ctx.lineWidth = lineWidth * (1 + (avgDepth * 0.22)); // prospective thickness
        ctx.stroke();
      });

      // 6. Draw glowing vertices cusp nodes
      ctx.globalAlpha = 1.0;
      projected.forEach((p, idx) => {
        // Top occlusal cusps and root tip ends
        const isCusp = idx < 5;
        const isTip = idx === 15 || idx === 16;
        
        if (isCusp || isTip) {
          const isExcluded = false;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, isCusp ? 3.2 : 2.5, 0, 2 * Math.PI);
          
          const nodeColor = isCusp ? '#0abab5' : '#d4b07a';
          
          ctx.fillStyle = nodeColor;
          ctx.globalAlpha = 1.0;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isDragging]);

  // Handle Drag physics inputs
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    velocity.current = { x: 0, y: 0 };
    dragStart.current = { x: e.clientX, y: e.clientY };
    lastTime.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    rotation.current.y += dx * 0.007;
    rotation.current.x += dy * 0.007;

    const now = Date.now();
    const dt = now - lastTime.current || 1;
    
    // Store drag speeds as immediate momentum velocity
    velocity.current.y = (dx / dt) * 0.12;
    velocity.current.x = (dy / dt) * 0.12;

    dragStart.current = { x: e.clientX, y: e.clientY };
    lastTime.current = now;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      velocity.current = { x: 0, y: 0 };
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastTime.current = Date.now();
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;

    rotation.current.y += dx * 0.007;
    rotation.current.x += dy * 0.007;

    const now = Date.now();
    const dt = now - lastTime.current || 1;
    velocity.current.y = (dx / dt) * 0.12;
    velocity.current.x = (dy / dt) * 0.12;

    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    lastTime.current = now;
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      
      {/* Outer Aesthetic Halo frame */}
      <div className="absolute top-[28px] w-[184px] h-[184px] sm:w-[224px] sm:h-[224px] rounded-full border border-stone-200/40 pointer-events-none flex items-center justify-center animate-[pulse_5s_infinite_alternate]">
        <div className="w-[150px] h-[150px] sm:w-[190px] sm:h-[190px] rounded-full border border-dashed border-stone-300/30" />
      </div>

      {/* Main Dynamic Lighting Background Glow */}
      <div className="absolute -inset-1 blur-2xl rounded-full opacity-45 pointer-events-none transition-all duration-700 bg-gradient-to-tr from-[#0abab5]/15 to-[#d4b07a]/15" />

      {/* HTML5 Canvas viewport */}
      <canvas
        ref={canvasRef}
        width={240}
        height={240}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="relative z-10 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] cursor-grab active:cursor-grabbing hover:scale-[1.03] transition-transform duration-300"
        title="Solid 3D Tooth Model - Drag to throw and rotate!"
      />

      {/* Spacer for pristine layouts */}
      <div className="mt-2" />

      <span className="text-[9px] font-sans text-stone-400 mt-2.5 opacity-60">
        ✨ Grab and throw to spin the 3D model
      </span>
    </div>
  );
}
