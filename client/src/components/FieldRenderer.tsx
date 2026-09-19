import type { GeneratedField } from "@shared/schema";
import { TextField } from "./fields/TextField";
import { NumberField } from "./fields/NumberField";
import { TextareaField } from "./fields/TextareaField";
import { BooleanField } from "./fields/BooleanField";
import { SelectField } from "./fields/SelectField";
import { CheckboxGroupField } from "./fields/CheckboxGroupField";
import { DateField } from "./fields/DateField";
import { EmailField } from "./fields/EmailField";
import { PhoneField } from "./fields/PhoneField";
import type { FieldComponentProps } from "./fields/types";

/**
 * The single point of truth mapping a field's declared `type` to its input
 * component. No document-specific forms are ever hardcoded — every form the
 * app renders, AI-generated or demo, flows through this switch.
 */
const FIELD_COMPONENTS: Record<GeneratedField["type"], React.ComponentType<FieldComponentProps>> = {
  text: TextField,
  number: NumberField,
  textarea: TextareaField,
  boolean: BooleanField,
  select: SelectField,
  "checkbox-group": CheckboxGroupField,
  date: DateField,
  email: EmailField,
  phone: PhoneField
};

interface FieldRendererProps {
  field: GeneratedField;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export function FieldRenderer({ field, value, onChange, error }: FieldRendererProps) {
  const Component = FIELD_COMPONENTS[field.type];
  const inputId = `field-${field.id}`;

  if (!Component) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-800">
        {field.label}
        {field.required && <span className="ml-1 text-brand-600">*</span>}
      </label>
      <Component field={field} value={value} onChange={onChange} error={error} inputId={inputId} />
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
