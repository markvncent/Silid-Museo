// key differences from CategoryForm:
const [categories, setCategories] = useState([]); // for the dropdown
useEffect(() => {
  supabase.from('categories').select('id, name').then(({ data }) => setCategories(data || []));
}, []);

// in the form JSX:
<select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
  <option value="">Select category</option>
  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
</select>

// upload target bucket: 'artwork-media' instead of 'category-covers'
// table target: 'artworks' instead of 'categories'