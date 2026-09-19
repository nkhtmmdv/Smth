import type { GeneratedForm } from "../../shared/schema.js";

/**
 * Bundled fallback scenarios for "Try Demo". These never call the AI
 * provider — they exist so the hackathon demo survives flaky internet, a
 * slow API, or a bad photo. Each demo also carries a small text mockup of
 * the "original paper" so the client can render a paper-like preview
 * without needing a real photographed image asset.
 */

export interface DemoScenario {
  id: string;
  paperLines: string[];
  form: GeneratedForm;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "warehouse-delivery",
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
    ],
    form: {
      status: "success",
      title: "Warehouse Delivery",
      description: "Form for recording warehouse deliveries",
      detectedLanguage: "en",
      fields: [
        { id: "supplier", label: "Supplier", type: "text", required: true, placeholder: "Enter supplier" },
        { id: "product", label: "Product", type: "text", required: true, placeholder: "Enter product" },
        { id: "quantity", label: "Quantity", type: "number", required: true, placeholder: undefined, options: undefined },
        { id: "delivery_date", label: "Delivery Date", type: "date", required: false, placeholder: undefined, options: undefined },
        { id: "damaged", label: "Damaged?", type: "boolean", required: false, placeholder: undefined, options: undefined }
      ]
    }
  },
  {
    id: "repair-request",
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
    ],
    form: {
      status: "success",
      title: "Repair Request",
      description: "Form for logging device repair requests",
      detectedLanguage: "en",
      fields: [
        { id: "customer_name", label: "Customer Name", type: "text", required: true, placeholder: "Enter full name" },
        { id: "phone", label: "Phone", type: "phone", required: true, placeholder: "+1 555 000 0000" },
        { id: "device", label: "Device", type: "select", required: true, options: ["iPhone", "Android", "Laptop"] },
        {
          id: "problem_description",
          label: "Problem Description",
          type: "textarea",
          required: true,
          placeholder: "Describe the issue"
        },
        { id: "urgent", label: "Urgent?", type: "boolean", required: false }
      ]
    }
  },
  {
    id: "kitchen-checklist",
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
    ],
    form: {
      status: "success",
      title: "Kitchen Opening Checklist",
      description: "Daily opening checklist for kitchen staff",
      detectedLanguage: "en",
      fields: [
        { id: "employee", label: "Employee", type: "text", required: true, placeholder: "Enter employee name" },
        { id: "date", label: "Date", type: "date", required: true },
        { id: "refrigerator_checked", label: "Refrigerator Checked?", type: "boolean", required: false },
        { id: "cleaning_completed", label: "Cleaning Completed?", type: "boolean", required: false },
        { id: "problems_found", label: "Problems Found", type: "textarea", required: false, placeholder: "Describe any problems" }
      ]
    }
  }
];

export function getDemoScenario(id: string): DemoScenario | undefined {
  return DEMO_SCENARIOS.find((s) => s.id === id);
}
