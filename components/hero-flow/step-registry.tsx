import type { ComponentType } from "react";
import type { HeroFlowStepId } from "./hero-flow.config";
import { IntakeStep } from "./steps/intake-step";
import { AnalysisStep } from "./steps/analysis-step";
import { ExtractionStep } from "./steps/extraction-step";
import { ValidationStep } from "./steps/validation-step";
import { ApprovalStep } from "./steps/approval-step";
import { SyncStep } from "./steps/sync-step";
import { SuccessStep } from "./steps/success-step";

export const STEP_COMPONENTS: Record<
  HeroFlowStepId,
  ComponentType<{ staticMode?: boolean }>
> = {
  intake: IntakeStep,
  analysis: AnalysisStep,
  extraction: ExtractionStep,
  validation: ValidationStep,
  approval: ApprovalStep,
  sync: SyncStep,
  success: SuccessStep,
};
