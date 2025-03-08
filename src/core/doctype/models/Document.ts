import { DocTypeDefinition } from '../schema/types';
import { registry } from '../registry';
import { validateDocument } from '../utils/validation';
import db from '../../db/index';

export class Document {
  [key: string]: any;
  
  private doctype: string;
  private isNew: boolean = true;
  private isDirty: boolean = false;
  
  constructor(doctype: string, name?: string) {
    this.doctype = doctype;
    
    if (name) {
      this.isNew = false;
      this.loadDocument(name);
    }
  }
  
  async loadDocument(name: string): Promise<void> {
    const data = await db.getDoc(this.doctype, name);
    if (!data) {
      throw new Error(`${this.doctype} "${name}" not found`);
    }
    
    Object.assign(this, data);
    this.isDirty = false;
  }
  
  async save(): Promise<void> {
    // Get the doctype definition
    const doctypeDef = registry.get(this.doctype);
    if (!doctypeDef) {
      throw new Error(`DocType ${this.doctype} not found in registry`);
    }
    
    // Validate
    const validationErrors = validateDocument(this, doctypeDef);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    // Save to database
    if (this.isNew) {
      // Generate name if needed
      if (!this.name && doctypeDef.naming) {
        this.name = await this.generateName(doctypeDef);
      }
      
      await db.insertDoc(this.doctype, this);
      this.isNew = false;
    } else {
      await db.updateDoc(this.doctype, this);
    }
    
    this.isDirty = false;
  }
  
  private async generateName(doctypeDef: DocTypeDefinition): Promise<string> {
    // Implementation of naming rule based on doctypeDef.naming
    // This is a simplified version
    switch (doctypeDef.naming?.rule) {
      case 'autoincrement':
        return `${this.doctype}-${Date.now()}`;
      case 'field':
        return this[doctypeDef.naming.options];
      case 'format':
        // Replace placeholders like {field} with actual values
        let name = doctypeDef.naming.options;
        const matches = name.match(/\{(.*?)\}/g) || [];
        for (const match of matches) {
          const field = match.replace(/\{|\}/g, '');
          name = name.replace(match, this[field] || '');
        }
        return name;
      default:
        return `${this.doctype}-${Date.now()}`;
    }
  }
  
  // Other methods...
  reload(): Promise<void> {
    return this.loadDocument(this.name);
  }
  
  delete(): Promise<void> {
    return db.deleteDoc(this.doctype, this.name);
  }
}
