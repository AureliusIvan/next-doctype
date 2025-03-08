import { useRouter } from 'next/router';
import DocTypeForm from '../components/DocTypeForm';

export default function CustomerPage() {
  const router = useRouter();
  const { name } = router.query;
  
  const handleSave = () => {
    router.push('/customers');
  };
  
  return (
    <div className="container">
      <h1>{name === 'new' ? 'New Customer' : `Edit Customer: ${name}`}</h1>
      <DocTypeForm 
        doctype="Customer" 
        name={name === 'new' ? undefined : String(name)}
        onSave={handleSave} 
      />
    </div>
  );
}
