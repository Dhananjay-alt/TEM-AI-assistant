"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Sliders,
  BarChart2,
  Cpu,
  RefreshCw,
  Sparkles,
  Info,
  Maximize2,
  FileText,
} from "lucide-react";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { ParameterSlider } from "@/components/ui/ParameterSlider";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import { SAMPLE_MICROGRAPHS, SampleMicrograph } from "@/data/sample-micrographs";
import { analyzeMicrographAI, VisionAnalysisResult } from "@/lib/ai/vision";

export interface DetectedParticle {
  id: number;
  cx: number;
  cy: number;
  areaPixels: number;
  diameterNm: number;
  perimeterPixels: number;
  circularity: number;
}

export interface ParticleStats {
  count: number;
  meanDiameterNm: number;
  medianDiameterNm: number;
  stdDevNm: number;
  minDiameterNm: number;
  maxDiameterNm: number;
}

export function ParticleAnalyzer() {
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(
    SAMPLE_MICROGRAPHS[0].svgDataUri
  );
  const [scaleBarNm, setScaleBarNm] = useState<number>(100);
  const [scaleBarPixels, setScaleBarPixels] = useState<number>(80);
  const [threshold, setThreshold] = useState<number>(128);
  const [minParticleSize, setMinParticleSize] = useState<number>(15);
  const [filterMode, setFilterMode] = useState<"normal" | "threshold" | "edges" | "invert">("normal");

  const [particles, setParticles] = useState<DetectedParticle[]>([]);
  const [stats, setStats] = useState<ParticleStats>({
    count: 22,
    meanDiameterNm: 17.5,
    medianDiameterNm: 16.8,
    stdDevNm: 3.2,
    minDiameterNm: 11.2,
    maxDiameterNm: 24.1,
  });

  const [aiReport, setAiReport] = useState<VisionAnalysisResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [userVisionQuestion, setUserVisionQuestion] = useState<string>(
    "What am I looking at? Explain the contrast mechanisms and morphology."
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Run connected-component particle detection on canvas
  const processImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = 420;
      canvas.height = 420;
      ctx.drawImage(img, 0, 0, 420, 420);

      const imgData = ctx.getImageData(0, 0, 420, 420);
      const data = imgData.data;
      const width = 420;
      const height = 420;

      // 1. Convert to grayscale & apply threshold
      const binary = new Uint8Array(width * height);
      for (let i = 0; i < data.length; i += 4) {
        // Luminance
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const idx = i / 4;

        if (filterMode === "invert") {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }

        // Dark particles against light background
        binary[idx] = gray < threshold ? 1 : 0;

        if (filterMode === "threshold") {
          const val = binary[idx] ? 0 : 255;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        }
      }

      // Simple 2-pass connected-component labeling for particle segmentation
      const labels = new Int32Array(width * height);
      let nextLabel = 1;
      const parent: number[] = [0];

      function find(i: number): number {
        let root = i;
        while (parent[root] !== root) root = parent[root];
        let curr = i;
        while (curr !== root) {
          const nxt = parent[curr];
          parent[curr] = root;
          curr = nxt;
        }
        return root;
      }

      function union(i: number, j: number) {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) parent[rootI] = rootJ;
      }

      // Pass 1: Labeling with 4-connectivity
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x;
          if (binary[idx] === 1) {
            const up = (y - 1) * width + x;
            const left = y * width + (x - 1);
            const upLabel = labels[up];
            const leftLabel = labels[left];

            if (upLabel > 0 && leftLabel > 0) {
              labels[idx] = upLabel;
              if (upLabel !== leftLabel) union(upLabel, leftLabel);
            } else if (upLabel > 0) {
              labels[idx] = upLabel;
            } else if (leftLabel > 0) {
              labels[idx] = leftLabel;
            } else {
              labels[idx] = nextLabel;
              parent[nextLabel] = nextLabel;
              nextLabel++;
            }
          }
        }
      }

      // Pass 2: Aggregate blobs
      const blobPixels: Record<number, { count: number; sumX: number; sumY: number }> = {};
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x;
          if (labels[idx] > 0) {
            const root = find(labels[idx]);
            labels[idx] = root;
            if (!blobPixels[root]) {
              blobPixels[root] = { count: 0, sumX: 0, sumY: 0 };
            }
            blobPixels[root].count++;
            blobPixels[root].sumX += x;
            blobPixels[root].sumY += y;
          }
        }
      }

      // Calibration: nm per pixel
      const nmPerPixel = scaleBarNm / Math.max(1, scaleBarPixels);

      const detected: DetectedParticle[] = [];
      Object.keys(blobPixels).forEach((key) => {
        const root = parseInt(key, 10);
        const blob = blobPixels[root];
        // Filter out tiny noise and gigantic edge borders
        if (blob.count >= minParticleSize && blob.count < 12000) {
          const cx = blob.sumX / blob.count;
          const cy = blob.sumY / blob.count;

          // Exclude scale bar region (bottom left)
          if (cy > 360 && cx < 160) return;

          // Equivalent circular diameter: Area = pi * (d/2)^2 => d = 2 * sqrt(Area / pi)
          const diameterPixels = 2 * Math.sqrt(blob.count / Math.PI);
          const diameterNm = diameterPixels * nmPerPixel;

          detected.push({
            id: root,
            cx,
            cy,
            areaPixels: blob.count,
            diameterNm,
            perimeterPixels: Math.PI * diameterPixels,
            circularity: 0.85,
          });
        }
      });

      setParticles(detected);

      // Put filtered pixels back if mode modified
      if (filterMode !== "normal") {
        ctx.putImageData(imgData, 0, 0);
      }

      // Draw bounding circles & centroid markers on detected particles
      ctx.lineWidth = 1.5;
      detected.forEach((p, idx) => {
        ctx.strokeStyle = "#10B981";
        ctx.fillStyle = "#10B981";
        ctx.beginPath();
        const r = (p.diameterNm / nmPerPixel) / 2;
        ctx.arc(p.cx, p.cy, Math.max(4, r), 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.cx, p.cy, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 8px monospace";
        ctx.fillText(String(idx + 1), p.cx + 5, p.cy - 5);
      });

      // Calculate statistical distribution
      if (detected.length > 0) {
        const diameters = detected.map((d) => d.diameterNm).sort((a, b) => a - b);
        const sum = diameters.reduce((a, b) => a + b, 0);
        const mean = sum / diameters.length;
        const median = diameters[Math.floor(diameters.length / 2)];
        const variance =
          diameters.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / diameters.length;
        const stdDev = Math.sqrt(variance);

        setStats({
          count: detected.length,
          meanDiameterNm: mean,
          medianDiameterNm: median,
          stdDevNm: stdDev,
          minDiameterNm: diameters[0],
          maxDiameterNm: diameters[diameters.length - 1],
        });
      }
    };
    img.src = currentImageSrc;
  };

  useEffect(() => {
    processImage();
  }, [currentImageSrc, threshold, minParticleSize, scaleBarNm, scaleBarPixels, filterMode]);

  // Handle local user file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setCurrentImageSrc(result);
          setAiReport(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Vision analysis
  const handleRunAiVision = async () => {
    setIsAiLoading(true);
    try {
      const report = await analyzeMicrographAI(currentImageSrc, userVisionQuestion);
      setAiReport(report);
    } catch (err) {
      console.error("AI vision error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="border-b-2 border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-black font-sans uppercase">
            03 / TEM IMAGE & PARTICLE SIZE WORKSTATION
          </h3>
          <p className="text-xs font-mono text-slate-600">
            Computer Vision Blob Segmentation, Scale Bar Calibration & AI Micrograph Interpretation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ScientificBadge variant="green" hasDot>
            {particles.length} PARTICLES DETECTED
          </ScientificBadge>
        </div>
      </div>

      {/* Preset Micrographs Bar */}
      <div className="brutal-border bg-surface-warm p-3 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <span className="font-bold text-slate-800 uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
          Load Benchmark Sample Micrograph:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_MICROGRAPHS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => {
                setCurrentImageSrc(sample.svgDataUri);
                setScaleBarNm(sample.scaleBarNm);
                setScaleBarPixels(sample.scaleBarPixels);
                setUserVisionQuestion(sample.defaultPrompt);
                setAiReport(null);
              }}
              className="px-2.5 py-1 bg-white brutal-border hover:bg-slate-100 font-bold text-slate-800 text-[11px]"
            >
              {sample.title}
            </button>
          ))}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 bg-[#FF5722] text-white brutal-border hover:bg-[#E64A19] font-bold text-[11px] flex items-center gap-1"
          >
            <Upload className="w-3 h-3" />
            Upload Micrograph (PNG/JPG/TIFF)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Canvas & Filter Tools */}
        <div className="lg:col-span-7 space-y-4">
          <BrutalCard
            variant="dark"
            shadowSize="lg"
            titleBar="TEM MICROGRAPH VIEWER / SEGMENTATION OVERLAY"
            titleBarBadge={`${scaleBarNm} nm SCALE`}
            className="bg-[#0B0E14] text-white"
          >
            <div className="space-y-3">
              {/* Image Canvas with Particle Overlays */}
              <div className="border border-slate-800 bg-[#0B0E14] flex justify-center overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={420}
                  height={420}
                  className="w-full max-w-[420px] h-[340px] sm:h-[420px] block"
                />
              </div>

              {/* Filter Mode Buttons */}
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-slate-400">DISPLAY FILTER:</span>
                <div className="flex gap-1.5">
                  {(["normal", "threshold", "invert"] as const).map((fm) => (
                    <button
                      key={fm}
                      onClick={() => setFilterMode(fm)}
                      className={`px-2 py-0.5 border text-[11px] uppercase ${
                        filterMode === fm
                          ? "bg-phosphor-green text-black font-bold border-phosphor-green"
                          : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {fm}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </BrutalCard>

          {/* Particle Size Histogram / Distribution Card */}
          <BrutalCard variant="default" shadowSize="sm" className="bg-white">
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-[#FF5722]" />
                  Particle Size Statistics (Calibrated)
                </span>
                <span className="text-[10px] bg-surface-warm px-1.5 py-0.5 border">
                  APPROXIMATE ESTIMATE
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 brutal-border bg-slate-50">
                  <div className="text-[10px] text-slate-500 uppercase">Count</div>
                  <div className="text-xl font-bold text-foreground">{stats.count}</div>
                  <div className="text-[9px] text-slate-400">particles</div>
                </div>
                <div className="p-2 brutal-border bg-blue-50">
                  <div className="text-[10px] text-blue-600 uppercase">Mean Diameter</div>
                  <div className="text-xl font-bold text-blue-900">
                    {stats.meanDiameterNm.toFixed(1)} <span className="text-xs">nm</span>
                  </div>
                  <div className="text-[9px] text-blue-600">± {stats.stdDevNm.toFixed(1)} nm</div>
                </div>
                <div className="p-2 brutal-border bg-emerald-50">
                  <div className="text-[10px] text-emerald-600 uppercase">Median Diameter</div>
                  <div className="text-xl font-bold text-emerald-900">
                    {stats.medianDiameterNm.toFixed(1)} <span className="text-xs">nm</span>
                  </div>
                  <div className="text-[9px] text-emerald-600">50th percentile</div>
                </div>
                <div className="p-2 brutal-border bg-amber-50">
                  <div className="text-[10px] text-amber-600 uppercase">Range (Min-Max)</div>
                  <div className="text-sm font-bold text-amber-900 pt-1">
                    {stats.minDiameterNm.toFixed(1)} – {stats.maxDiameterNm.toFixed(1)} nm
                  </div>
                  <div className="text-[9px] text-amber-600">span</div>
                </div>
              </div>

              <div className="p-2 bg-amber-50 border border-amber-200 text-[10px] text-amber-900 font-sans">
                ⚠️ <strong>Scientific Accuracy Reminder:</strong> Threshold-based 2D projected measurements are educational estimates. Overlapping particles, agglomerates, and defocus Fresnel fringes can introduce systematic bias.
              </div>
            </div>
          </BrutalCard>
        </div>

        {/* Right Column: Calibration Controls & AI Vision Analysis */}
        <div className="lg:col-span-5 space-y-4">
          {/* Calibration & Threshold Controls */}
          <BrutalCard
            variant="default"
            shadowSize="md"
            titleBar="IMAGE PROCESSING CONTROLS"
            titleBarBadge="CALIBRATION"
            className="bg-white"
          >
            <div className="space-y-4">
              <ParameterSlider
                label="Binarization Threshold"
                value={threshold}
                min={30}
                max={220}
                step={2}
                unit=""
                onChange={setThreshold}
                helperText="Separates dark nanoparticles from the lighter support substrate."
              />

              <ParameterSlider
                label="Scale Bar Value"
                value={scaleBarNm}
                min={1}
                max={500}
                step={5}
                unit="nm"
                onChange={setScaleBarNm}
                helperText="Physical length denoted on the micrograph's scale bar legend."
              />

              <ParameterSlider
                label="Scale Bar Pixel Length"
                value={scaleBarPixels}
                min={20}
                max={250}
                step={2}
                unit="px"
                onChange={setScaleBarPixels}
                helperText="Measured pixel length corresponding to the scale bar legend."
              />

              <ParameterSlider
                label="Min Particle Size Cutoff"
                value={minParticleSize}
                min={4}
                max={100}
                step={2}
                unit="px"
                onChange={setMinParticleSize}
                helperText="Rejects tiny high-frequency carbon support noise."
              />
            </div>
          </BrutalCard>

          {/* AI Vision Interpretation Card */}
          <BrutalCard
            variant="warm"
            shadowSize="md"
            titleBar="AI MICROGRAPH INTERPRETATION"
            titleBarBadge="CARTER SCIENTIFIC VISION"
            className="bg-[#F4EFE6]"
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 uppercase block text-[11px]">
                  Ask AI About This Micrograph:
                </label>
                <textarea
                  value={userVisionQuestion}
                  onChange={(e) => setUserVisionQuestion(e.target.value)}
                  rows={2}
                  className="w-full p-2 brutal-border bg-white text-xs font-mono resize-none focus:outline-none"
                  placeholder="e.g., Explain contrast, morphology, and suggest follow-up techniques..."
                />
              </div>

              <BrutalButton
                variant="primary"
                size="md"
                className="w-full"
                onClick={handleRunAiVision}
                disabled={isAiLoading}
                icon={<Sparkles className="w-4 h-4" />}
              >
                {isAiLoading ? "ANALYZING MICROGRAPH..." : "ANALYZE WITH AI VISION"}
              </BrutalButton>

              {/* Structured AI Report with OBSERVED vs INTERPRETED vs UNCERTAIN */}
              {aiReport && (
                <div className="space-y-2.5 pt-2 border-t-2 border-border">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-bold text-slate-700">REPORT GENERATED</span>
                    <span className="bg-white px-1 border border-border">
                      {aiReport.provider}
                    </span>
                  </div>

                  {/* OBSERVED SECTION */}
                  <div className="bg-white p-2.5 brutal-border border-blue-900 space-y-1">
                    <div className="font-bold text-blue-900 uppercase text-[10px] flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-600"></span>
                      1. OBSERVED (DIRECTLY VISIBLE)
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] font-sans text-slate-800">
                      {aiReport.observed.map((obs, i) => (
                        <li key={i}>{obs}</li>
                      ))}
                    </ul>
                  </div>

                  {/* INTERPRETED SECTION */}
                  <div className="bg-white p-2.5 brutal-border border-amber-800 space-y-1">
                    <div className="font-bold text-amber-800 uppercase text-[10px] flex items-center gap-1">
                      <span className="w-2 h-2 bg-amber-500"></span>
                      2. INTERPRETED (PLAUSIBLE PHYSICS)
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] font-sans text-slate-800">
                      {aiReport.interpreted.map((int, i) => (
                        <li key={i}>{int}</li>
                      ))}
                    </ul>
                  </div>

                  {/* UNCERTAIN SECTION */}
                  <div className="bg-white p-2.5 brutal-border border-red-800 space-y-1">
                    <div className="font-bold text-red-800 uppercase text-[10px] flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500"></span>
                      3. UNCERTAIN (REQUIRES FOLLOW-UP)
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] font-sans text-slate-800">
                      {aiReport.uncertain.map((unc, i) => (
                        <li key={i}>{unc}</li>
                      ))}
                    </ul>
                  </div>

                  {/* RECOMMENDED FOLLOW-UP TECHNIQUES */}
                  <div className="bg-emerald-50 p-2 border border-emerald-300 text-[11px] font-sans text-emerald-950 space-y-1">
                    <span className="font-bold font-mono text-[10px] uppercase text-emerald-800 block">
                      Recommended Follow-up Techniques:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {aiReport.recommendedTechniques.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
