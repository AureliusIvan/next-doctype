import { useState, useEffect } from 'react';
import { Document } from '../doctype/models/Document';

interface UseDocumentOptions {
  autoload?: boolean;
}

export function useDocument(doctype: string, name?: string, options: UseDocumentOptions = {}) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const { autoload = true } = options;
    
    if (autoload && name) {
      loadDocument();
    } else if (!name) {
      const newDoc = new Document(doctype);
      setDocument(newDoc);
    }
  }, [doctype, name]);
  
  const loadDocument = async () => {
    if (!name) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const doc = new Document(doctype, name);
      await doc.loadDocument(name);
      setDocument(doc);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  const saveDocument = async () => {
    if (!document) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await document.save();
      // Create a new reference to trigger re-render
      setDocument({ ...document });
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    document,
    loading,
    error,
    loadDocument,
    saveDocument,
    setDocument,
  };
}
