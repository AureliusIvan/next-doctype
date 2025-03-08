import type { NextApiRequest, NextApiResponse } from 'next';
import { registry } from '../../../../core/doctype/registry';
import { Document } from '../../../../core/doctype/models/Document';
import db from '../../../../core/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { doctype, action } = req.query;
  
  if (typeof doctype !== 'string') {
    return res.status(400).json({ error: 'DocType must be a string' });
  }
  
  // Check if doctype exists
  const doctypeDefinition = registry.get(doctype);
  if (!doctypeDefinition) {
    return res.status(404).json({ error: `DocType ${doctype} not found` });
  }
  
  try {
    switch (action) {
      case 'list':
        const filters = req.body?.filters || {};
        const options = req.body?.options || {};
        const docs = await db.listDocs(doctype, filters, options);
        return res.status(200).json(docs);
        
      case 'get':
        const { name } = req.query;
        if (typeof name !== 'string') {
          return res.status(400).json({ error: 'Document name is required' });
        }
        const doc = await db.getDoc(doctype, name);
        if (!doc) {
          return res.status(404).json({ error: `${doctype} "${name}" not found` });
        }
        return res.status(200).json(doc);
        
      case 'create':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        
        const newDoc = new Document(doctype);
        Object.assign(newDoc, req.body);
        await newDoc.save();
        return res.status(201).json(newDoc);
        
      case 'update':
        if (req.method !== 'PUT' && req.method !== 'PATCH') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        
        const { name: docName } = req.body;
        if (!docName) {
          return res.status(400).json({ error: 'Document name is required' });
        }
        
        const existingDoc = new Document(doctype, docName);
        await existingDoc.loadDocument(docName);
        Object.assign(existingDoc, req.body);
        await existingDoc.save();
        return res.status(200).json(existingDoc);
        
      case 'delete':
        if (req.method !== 'DELETE') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        
        const { name: deleteName } = req.query;
        if (typeof deleteName !== 'string') {
          return res.status(400).json({ error: 'Document name is required' });
        }
        
        await db.deleteDoc(doctype, deleteName);
        return res.status(200).json({ message: `${doctype} "${deleteName}" deleted successfully` });
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
