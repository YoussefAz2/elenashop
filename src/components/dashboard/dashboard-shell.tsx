"use client";

import { motion } from "framer-motion";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-4 lg:p-8 max-w-7xl mx-auto"
        >
            {children}
        </motion.div>
    );
}
