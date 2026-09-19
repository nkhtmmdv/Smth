/**
 * Client-side display copy for the "Try Demo" picker + the analysis screen's
 * paper preview. This is presentation-only text (kept in sync with
 * server/services/demoData.ts) — the actual form SCHEMA always comes from
 * the server via POST /api/demo/:id, so the universal DynamicForm renderer
 * still never receives a hardcoded, document-specific form.
 */
export interface DemoScenarioPreview {
  id: string;
  icon: "warehouse" | "wrench" | "clipboard-check";
  paperLines: string[];
}

export const DEMO_SCENARIO_PREVIEWS: DemoScenarioPreview[] = [
  {
    id: "warehouse-delivery",
    icon: "warehouse",
    paperLines: [
      "WAREHOUSE DELIVERY",
      "",
      "Supplier: __________________",
      "Product: ___________________",
      "Quantity: __________________",
      "Delivery Date: _____________",
      "",
      "Damaged?",
      "[ ] Yes      [ ] No"
    ]
  },
  {
    id: "repair-request",
    icon: "wrench",
    paperLines: [
      "REPAIR REQUEST",
      "",
      "Customer Name: _____________",
      "Phone: ______________________",
      "",
      "Device:",
      "[ ] iPhone   [ ] Android   [ ] Laptop",
      "",
      "Problem Description:",
      "_____________________________",
      "",
      "Urgent?",
      "[ ] Yes      [ ] No"
    ]
  },
  {
    id: "kitchen-checklist",
    icon: "clipboard-check",
    paperLines: [
      "KITCHEN OPENING CHECKLIST",
      "",
      "Employee: __________________",
      "Date: _______________________",
      "",
      "Refrigerator Checked?",
      "[ ] Yes      [ ] No",
      "",
      "Cleaning Completed?",
      "[ ] Yes      [ ] No",
      "",
      "Problems Found:",
      "_____________________________"
    ]
  }
];
