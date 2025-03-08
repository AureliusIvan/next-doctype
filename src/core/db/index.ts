import { prisma } from './prisma'; // Assuming you use Prisma

class Database {
  async getDoc(doctype: string, name: string): Promise<any> {
    try {
      const result = await prisma[doctype.toLowerCase()].findUnique({
        where: { name },
      });
      return result;
    } catch (error) {
      console.error(`Error fetching ${doctype} "${name}":`, error);
      throw error;
    }
  }
  
  async insertDoc(doctype: string, doc: any): Promise<any> {
    try {
      return await prisma[doctype.toLowerCase()].create({
        data: doc,
      });
    } catch (error) {
      console.error(`Error creating ${doctype}:`, error);
      throw error;
    }
  }
  
  async updateDoc(doctype: string, doc: any): Promise<any> {
    try {
      return await prisma[doctype.toLowerCase()].update({
        where: { name: doc.name },
        data: doc,
      });
    } catch (error) {
      console.error(`Error updating ${doctype} "${doc.name}":`, error);
      throw error;
    }
  }
  
  async deleteDoc(doctype: string, name: string): Promise<any> {
    try {
      return await prisma[doctype.toLowerCase()].delete({
        where: { name },
      });
    } catch (error) {
      console.error(`Error deleting ${doctype} "${name}":`, error);
      throw error;
    }
  }
  
  async listDocs(doctype: string, filters = {}, options = {}): Promise<any[]> {
    try {
      return await prisma[doctype.toLowerCase()].findMany({
        where: filters,
        ...options,
      });
    } catch (error) {
      console.error(`Error listing ${doctype}:`, error);
      throw error;
    }
  }
}

export default new Database();
