import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit3, Trash2, Eye, LogOut,
  Save, X, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import { Content, ContentInput, ContentType, ContentStatus } from '../../types/content';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

type TabType = 'all' | ContentType;

const tabs: { label: string; value: TabType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Blog', value: 'blog' },
  { label: 'Press', value: 'press' },
  { label: 'Pages', value: 'page' },
];

const emptyForm: ContentInput = {
  type: 'blog',
  title: '',
  custom_slug: '',
  image: '',
  body: '',
  metadata: { 
    description: '', 
    keywords: [], 
    external_url: '',
    h1: '',
    meta_title: '',
    meta_description: '',
    meta_tags: [],
    schema: ''
  },
  status: 'draft',
};

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { items, loading, error, fetchAll, create, update, remove } = useAdmin();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [editing, setEditing] = useState<Content | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<ContentInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [keywordsInput, setKeywordsInput] = useState('');
  const [metaTagsInput, setMetaTagsInput] = useState('');

  // Fetch content when tab changes
  useEffect(() => {
    const type = activeTab === 'all' ? undefined : activeTab;
    fetchAll(type);
  }, [activeTab, fetchAll]);

  // Populate form when editing
  useEffect(() => {
    if (editing) {
      setForm({
        type: editing.type,
        title: editing.title,
        custom_slug: editing.custom_slug,
        image: editing.image || '',
        body: editing.body,
        metadata: editing.metadata || { 
          description: '', 
          keywords: [], 
          external_url: '',
          h1: '',
          meta_title: '',
          meta_description: '',
          meta_tags: [],
          schema: ''
        },
        status: editing.status,
      });
      setKeywordsInput(editing.metadata?.keywords?.join(', ') || '');
      setMetaTagsInput(editing.metadata?.meta_tags?.join(', ') || '');
    }
  }, [editing]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setKeywordsInput('');
    setMetaTagsInput('');
    setIsCreating(true);
  };

  const handleEdit = (content: Content) => {
    setIsCreating(false);
    setEditing(content);
  };

  const handleCancel = () => {
    setEditing(null);
    setIsCreating(false);
    setForm(emptyForm);
    setKeywordsInput('');
    setMetaTagsInput('');
  };

  const handleSave = async () => {
    setSaving(true);

    const keywords = keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const metaTags = metaTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: ContentInput = {
      ...form,
      image: form.image || null,
      metadata: {
        ...form.metadata,
        keywords,
        meta_tags: metaTags,
        // Set default article schema if empty
        schema: form.metadata?.schema || `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${form.title}",
  "description": "${form.metadata?.meta_description || form.metadata?.description || ''}",
  "image": "${form.image || ''}",
  "datePublished": "${new Date().toISOString()}",
  "dateModified": "${new Date().toISOString()}"
}`
      },
    };

    if (isCreating) {
      const result = await create(payload);
      if (result) {
        setIsCreating(false);
        setForm(emptyForm);
        setKeywordsInput('');
        setMetaTagsInput('');
        fetchAll(activeTab === 'all' ? undefined : activeTab);
      }
    } else if (editing) {
      const result = await update(editing.id, payload);
      if (result) {
        setEditing(null);
        setForm(emptyForm);
        setKeywordsInput('');
        setMetaTagsInput('');
        fetchAll(activeTab === 'all' ? undefined : activeTab);
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    const success = await remove(id);
    if (success) {
      setEditing(null);
      setIsCreating(false);
      fetchAll(activeTab === 'all' ? undefined : activeTab);
    }
  };

  const handleSlugFromTitle = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setForm((prev) => ({ ...prev, title, custom_slug: slug }));
  };

  const filteredItems = items;

  const showEditor = isCreating || editing;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img 
                src="https://ingood.in/wp-content/uploads/2025/07/ingood-new-logo.png" 
                alt="InGood Logo" 
                className="h-8 w-auto"
              />
              <span className="text-lg font-bold text-black">InGood Admin</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Content Browser */}
          <div className={`flex-1 ${showEditor ? 'lg:w-1/2' : 'w-full'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Content</h2>
              <button
                onClick={handleNew}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> New Content
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.value
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content List */}
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-red-600 text-center py-8">{error}</div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500">No content found. Create your first piece!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer ${
                      editing?.id === item.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleEdit(item)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-black font-medium truncate">{item.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          item.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1 truncate">
                        /{item.custom_slug} · {new Date(item.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Editor Panel */}
          <AnimatePresence>
            {showEditor && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:w-1/2"
              >
                <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-black">
                      {isCreating ? 'Create New Content' : 'Edit Content'}
                    </h3>
                    <button onClick={handleCancel} className="text-gray-400 hover:text-black">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => handleSlugFromTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50"
                        placeholder="Enter title..."
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                      <input
                        type="text"
                        value={form.custom_slug}
                        onChange={(e) => setForm((prev) => ({ ...prev, custom_slug: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50"
                        placeholder="custom-slug"
                      />
                    </div>

                    {/* Type & Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={form.type}
                          onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as ContentType }))}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50"
                        >
                          <option value="blog">Blog</option>
                          <option value="press">Press</option>
                          <option value="page">Page</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={form.status}
                          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as ContentStatus }))}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={form.image || ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Body */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Body (HTML)</label>
                      <textarea
                        value={form.body}
                        onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
                        rows={10}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50 font-mono text-sm"
                        placeholder="<p>Your content here...</p>"
                      />
                    </div>

                    {/* SEO Section */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="text-md font-semibold text-black mb-4">SEO Settings</h4>
                      
                      {/* H1 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">H1 Heading</label>
                        <input
                          type="text"
                          value={form.metadata?.h1 || ''}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              metadata: { ...prev.metadata, h1: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50"
                          placeholder="Main heading for SEO..."
                        />
                      </div>

                      {/* Meta Title */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                        <input
                          type="text"
                          value={form.metadata?.meta_title || ''}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              metadata: { ...prev.metadata, meta_title: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50"
                          placeholder="Title for search engines..."
                        />
                      </div>

                      {/* Meta Description */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                        <textarea
                          value={form.metadata?.meta_description || ''}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              metadata: { ...prev.metadata, meta_description: e.target.value },
                            }))
                          }
                          rows={3}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50"
                          placeholder="Description for search engines..."
                        />
                      </div>

                      {/* Meta Tags */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={metaTagsInput}
                          onChange={(e) => setMetaTagsInput(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50"
                          placeholder="tag1, tag2, tag3"
                        />
                      </div>

                      {/* Schema */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Schema (JSON-LD)</label>
                        <textarea
                          value={form.metadata?.schema || ''}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              metadata: { ...prev.metadata, schema: e.target.value },
                            }))
                          }
                          rows={6}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50 font-mono text-sm"
                          placeholder='{"@context": "https://schema.org", "@type": "Article", ...}'
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave blank to use default Article schema</p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={form.metadata?.description || ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            metadata: { ...prev.metadata, description: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50"
                        placeholder="Brief description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma-separated)</label>
                      <input
                        type="text"
                        value={keywordsInput}
                        onChange={(e) => setKeywordsInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50"
                        placeholder="tech, ai, innovation"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">External URL (for press)</label>
                      <input
                        type="text"
                        value={form.metadata?.external_url || ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            metadata: { ...prev.metadata, external_url: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500/50"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      disabled={saving || !form.title || !form.custom_slug}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isCreating ? 'Create' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 text-gray-600 hover:text-black rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    {!isCreating && editing && (
                      <button
                        onClick={() => handleDelete(editing.id)}
                        className="ml-auto flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
