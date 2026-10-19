export interface TechnicalSpec {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}

export interface AnatomyChapter {
  id: string;
  number: string;
  componentId: string;
  title: string;
  subtitle: string;
  functionSummary: string;
  keyIdea: string;
  specs: TechnicalSpec[];
  systemStatus: {
    beam: "ACTIVE" | "COLLIMATING" | "INTERACTING" | "SPLITTING" | "FILTERED" | "MAGNIFIED" | "DETECTED" | "STANDBY";
    mode: string;
    subsystem: string;
    stageInfo?: string;
    signalCount?: string;
  };
  carterRef: {
    chapter: string;
    title: string;
    topic: string;
  };
  contrastMechanism?: string;
  pedagogicalTakeaway: string;
  buttonAction?: {
    label: string;
    href: string;
  };
}

export interface ComponentInspection {
  id: string;
  name: string;
  groupName: string;
  functionDesc: string;
  opticsRole: string;
  carterRef: string;
  typicalParams: string[];
}

export interface TelemetryData {
  beamStatus: string;
  voltageKV: number;
  wavelengthPm: number;
  velocityFractionC: number;
  currentMode: string;
  activeComponent: string;
  activeChapterIndex: number;
  vacuumTorr: string;
  resolutionNm: string;
}
