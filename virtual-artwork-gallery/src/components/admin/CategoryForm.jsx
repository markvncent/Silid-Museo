import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function CategoryForm() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', description: '', file: null });

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('display_order');
    setCategories(data || []);
  };

  useEffect(() => { fetchCategories(); }, []);

  const uploadCover = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('category-covers').upload(fileName, file);
    if (error) throw error;
    return supabase.storage.from('category-covers').getPublicUrl(fileName).data.publicUrl;
  };

  const handleSave = async () => {
    let cover_image_url;
    if (form.file) cover_image_url = await uploadCover(form.file);

    const payload = { name: form.name, description: form.description, ...(cover_image_url && { cover_image_url }) };

    if (form.id) {
      // UPDATE
      await supabase.from('categories').update(payload).eq('id', form.id);
    } else {
      // CREATE
      await supabase.from('categories').insert(payload);
    }
    setForm({ id: null, name: '', description: '', file: null });
    fetchCategories();
  };

  const handleDelete = async (id) => {
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setForm({ id: cat.id, name: cat.name, description: cat.description, file: null });
  };

  return (
    <div>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <input type="file" onChange={e => setForm({ ...form, file: e.target.files[0] })} />
      <button onClick={handleSave}>{form.id ? 'Update' : 'Add'} Category</button>

      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            {cat.name}
            <button onClick={() => handleEdit(cat)}>Edit</button>
            <button onClick={() => handleDelete(cat.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}