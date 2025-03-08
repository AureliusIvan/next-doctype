import React, { useState, useEffect } from 'react';
import { useDocument } from '@/core/hooks/useDocument';
import { registry } from '@/core/doctype/registry';
import { FieldDefinition } from '@/core/doctype/schema/types';

interface DocTypeFormProps {
  doctype: string;
  name?: string;
  onSave?: (doc: any) => void;
}

export default function DocTypeForm({ doctype, name, onSave }: DocTypeFormProps) {
  const { document, loading, error, saveDocument, setDocument } = useDocument(doctype, name);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!document) return <div>Document not found</div>;
  
  const doctypeDefinition = registry.get(doctype);
  if (!doctypeDefinition) return <div>DocType not found</div>;
  
  const handleChange = (fieldname: string, value: any) => {
    setDocument({
      ...document,
      [fieldname]: value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveDocument();
      if (onSave) onSave(document);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };
  
  const renderField = (field: FieldDefinition) => {
    const value = document[field.fieldname] || '';
    
    switch (field.fieldtype) {
      case 'Data':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.fieldname, e.target.value)}
            disabled={field.readOnly}
          />
        );
      case 'Text':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.fieldname, e.target.value)}
            disabled={field.readOnly}
          />
        );
      case 'Int':
      case 'Float':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(field.fieldname, field.fieldtype === 'Int' ? parseInt(e.target.value) : parseFloat(e.target.value))}
            disabled={field.readOnly}
          />
        );
      case 'Select':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(field.fieldname, e.target.value)}
            disabled={field.readOnly}
          >
            {Array.isArray(field.options) && field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'Date':
        return (
          <input
            type="date"
            value={value instanceof Date ? value.toISOString().split('T')[0] : value}
            onChange={(e) => handleChange(field.fieldname, e.target.value)}
            disabled={field.readOnly}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.fieldname, e.target.value)}
            disabled={field.readOnly}
          />
        );
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {doctypeDefinition.fields.map((field) => (
        <div key={field.fieldname} className="form-field">
          <label htmlFor={field.fieldname}>
            {field.label || field.fieldname}
            {field.required && <span className="required">*</span>}
          </label>
          {renderField(field)}
          {field.description && <small>{field.description}</small>}
        </div>
      ))}
      <button type="submit">Save</button>
    </form>
  );
}
