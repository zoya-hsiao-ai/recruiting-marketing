"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import type { Conference } from "./types";
import { loadConferences, saveConferences } from "./storage";
import { createDefaultConference } from "./defaults";

interface ConferenceContextValue {
  conferences: Conference[];
  addConference: (name: string) => Conference;
  updateConference: (id: string, updates: Partial<Conference>) => void;
  deleteConference: (id: string) => void;
  getConference: (id: string) => Conference | undefined;
}

const ConferenceContext = createContext<ConferenceContextValue | null>(null);

export function ConferenceProvider({ children }: { children: ReactNode }) {
  const [conferences, setConferences] = useState<Conference[]>(() => loadConferences());
  const loaded = useRef(false);

  useEffect(() => {
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (loaded.current) saveConferences(conferences);
  }, [conferences]);

  const addConference = useCallback((name: string) => {
    const conf = createDefaultConference(name);
    setConferences((prev) => [...prev, conf]);
    return conf;
  }, []);

  const updateConference = useCallback((id: string, updates: Partial<Conference>) => {
    setConferences((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteConference = useCallback((id: string) => {
    setConferences((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getConference = useCallback(
    (id: string) => conferences.find((c) => c.id === id),
    [conferences]
  );

  return (
    <ConferenceContext.Provider value={{ conferences, addConference, updateConference, deleteConference, getConference }}>
      {children}
    </ConferenceContext.Provider>
  );
}

export function useConferences() {
  const ctx = useContext(ConferenceContext);
  if (!ctx) throw new Error("useConferences must be used within ConferenceProvider");
  return ctx;
}
