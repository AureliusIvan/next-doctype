export interface FieldDefinition {
    fieldname: string;
    label: string;
    fieldtype: 'Data' | 'Text' | 'Int' | 'Float' | 'Date' | 'DateTime' | 'Select' | 'Link' | 'Table';
    required?: boolean;
    options?: string | string[];
    default?: any;
    unique?: boolean;
    hidden?: boolean;
    readOnly?: boolean;
    description?: string;
    // For Link field type
    reference?: string;
    // For Table field type
    childtype?: string;
  }
  
  export interface DocTypeDefinition {
    name: string;
    module: string;
    isSingle?: boolean;
    isSubmittable?: boolean;
    keywordFields?: string[];
    fields: FieldDefinition[];
    permissions?: Permission[];
    naming?: {
      rule: 'autoincrement' | 'field' | 'format' | 'expression';
      options?: any;
    };
    events?: {
      beforeSave?: string;
      afterSave?: string;
      beforeSubmit?: string;
      afterSubmit?: string;
      // Add other events as needed
    };
  }
  
  export interface Permission {
    role: string;
    level: 'None' | 'Read' | 'Write' | 'Create' | 'Delete' | 'Submit' | 'Cancel' | 'Amend';
  }