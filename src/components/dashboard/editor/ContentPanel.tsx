"use client";

import { useState } from "react";
import type { ThemeConfig } from "@/types";
import { SidebarSectionList, SectionId } from "./SidebarSectionList";
import { SidebarSectionEditor } from "./SidebarSectionEditor";

interface ContentPanelProps {
    config: ThemeConfig;
    onUpdateConfig: (config: ThemeConfig) => void;
}

export function ContentPanel({ config, onUpdateConfig }: ContentPanelProps) {
    const [activeSection, setActiveSection] = useState<SectionId | null>(null);

    // If no active section, show the section list
    if (!activeSection) {
        return (
            <div className="p-4">
                <SidebarSectionList onSelectSection={setActiveSection} />
            </div>
        );
    }

    // Show the section editor with back button
    return (
        <div className="p-4 h-full">
            <SidebarSectionEditor
                activeSection={activeSection}
                config={config}
                onUpdateConfig={onUpdateConfig}
                onBack={() => setActiveSection(null)}
            />
        </div>
    );
}
