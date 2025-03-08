import { DocTypeDefinition } from './schema/types';

class DocTypeRegistry {
  private doctypes: Map<string, DocTypeDefinition> = new Map();

  register(doctype: DocTypeDefinition): void {
    this.doctypes.set(doctype.name, doctype);
    console.log(`DocType ${doctype.name} registered successfully`);
  }

  get(name: string): DocTypeDefinition | undefined {
    return this.doctypes.get(name);
  }

  list(): string[] {
    return Array.from(this.doctypes.keys());
  }

  getAllDoctypes(): DocTypeDefinition[] {
    return Array.from(this.doctypes.values());
  }
}

// Singleton instance
export const registry = new DocTypeRegistry();

// Helper function to register multiple doctypes at once
export function registerDoctypes(doctypes: DocTypeDefinition[]): void {
  doctypes.forEach(dt => registry.register(dt));
}