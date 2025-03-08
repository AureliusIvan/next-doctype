import { DocTypeDefinition, FieldDefinition } from '../schema/types';

export function validateDocument(doc: any, doctype: DocTypeDefinition): string[] {
  const errors: string[] = [];
  
  for (const field of doctype.fields) {
    const value = doc[field.fieldname];
    
    // Check required fields
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field.label || field.fieldname} is required`);
      continue;
    }
    
    // Skip validation for empty optional fields
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    // Type validation
    const typeError = validateFieldType(value, field);
    if (typeError) {
      errors.push(typeError);
    }
  }
  
  return errors;
}

function validateFieldType(value: any, field: FieldDefinition): string | null {
  switch (field.fieldtype) {
    case 'Int':
      if (!Number.isInteger(Number(value))) {
        return `${field.label || field.fieldname} must be an integer`;
      }
      break;
    case 'Float':
      if (isNaN(Number(value))) {
        return `${field.label || field.fieldname} must be a number`;
      }
      break;
    case 'Date':
      if (!(value instanceof Date) && isNaN(Date.parse(value))) {
        return `${field.label || field.fieldname} must be a valid date`;
      }
      break;
    case 'Select':
      if (Array.isArray(field.options) && !field.options.includes(value)) {
        return `${field.label || field.fieldname} must be one of ${field.options.join(', ')}`;
      }
      break;
    // Add other validations as needed
  }
  
  return null;
}
