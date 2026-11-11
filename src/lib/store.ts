import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ActionRow } from "@/data/types";
import { ALL_CHOICES, type ListeningChoices } from "@/lib/metrics";

export interface Review {
  itemId: string;
  decision: "accept" | "edit" | "reject";
  editedCode: string;
  note: string;
}

interface VoiceState {
  choices: ListeningChoices;
  setChoice: (key: keyof ListeningChoices, value: string) => void;
  resetChoices: () => void;
  reviews: Review[];
  saveReview: (review: Review) => void;
  actionStatus: Record<string, ActionRow["status"]>;
  setActionStatus: (id: string, status: ActionRow["status"]) => void;
  leadOpen: boolean;
  setLeadOpen: (open: boolean) => void;
  caseStatus: Record<string, string>;
  auditExtra: Record<string, { at: string; actor: string; event: string }[]>;
  advanceCase: (id: string, status: string, event: string) => void;
}

export const useVoice = create<VoiceState>()(
  persist(
    (set) => ({
      choices: ALL_CHOICES,
      setChoice: (key, value) => set((state) => ({ choices: { ...state.choices, [key]: value } })),
      resetChoices: () => set({ choices: ALL_CHOICES }),
      reviews: [],
      saveReview: (review) =>
        set((state) => ({
          reviews: [review, ...state.reviews.filter((row) => row.itemId !== review.itemId)],
        })),
      actionStatus: {},
      setActionStatus: (id, status) =>
        set((state) => ({ actionStatus: { ...state.actionStatus, [id]: status } })),
      leadOpen: false,
      setLeadOpen: (leadOpen) => set({ leadOpen }),
      caseStatus: {},
      auditExtra: {},
      advanceCase: (id, status, event) =>
        set((state) => ({
          caseStatus: { ...state.caseStatus, [id]: status },
          auditExtra: {
            ...state.auditExtra,
            [id]: [
              ...(state.auditExtra[id] ?? []),
              {
                at: new Date().toISOString().slice(0, 16).replace("T", " "),
                actor: "Safeguarding lead",
                event,
              },
            ],
          },
        })),
    }),
    {
      name: "community-voice-demo",
      skipHydration: true,
      partialize: (state) => ({
        reviews: state.reviews,
        actionStatus: state.actionStatus,
        caseStatus: state.caseStatus,
        auditExtra: state.auditExtra,
      }),
    },
  ),
);
