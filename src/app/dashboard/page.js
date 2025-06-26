'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { apiConfig } from '../../lib/api-config';

// Helper: get reading progress from localStorage
function getProgress(seriesId) {
    const progress = localStorage.getItem(`progress_${seriesId}`);
    return progress ? parseInt(progress, 10) : 0;
}

async function getSeries() {
    try {
        const jwt = localStorage.getItem('jwt');
        const res = await fetch(apiConfig.endpoints.series, {
            headers: { 'Authorization': `Bearer ${jwt}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch series');
        return data.series;
    } catch (err) {
        return [];
    }
}

async function deleteSeries(id) {
    try {
        const jwt = localStorage.getItem('jwt');
        const res = await fetch(`${apiConfig.endpoints.series}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${jwt}` }
        });
        return res.ok;
    } catch {
        return false;
    }
}

function FileUpload({ onUpload }) {
    const fileInput = useRef();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    const handleUpload = async (file) => {
        setMessage('');
        setLoading(true);
        setProgress(0);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const jwt = localStorage.getItem('jwt');
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${apiConfig.endpoints.series}/upload`);
            xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
            };
            xhr.onload = () => {
                setLoading(false);
                if (xhr.status >= 200 && xhr.status < 300) {
                    setMessage('Upload successful!');
                    setProgress(100);
                    if (onUpload) onUpload();
                } else {
                    setMessage('Upload failed: ' + (xhr.responseText || xhr.statusText));
                }
            };
            xhr.onerror = () => {
                setLoading(false);
                setMessage('Upload failed');
            };
            xhr.send(formData);
        } catch (err) {
            setMessage(err.message);
            setLoading(false);
        }
    };

    const handleForm = (e) => {
        e.preventDefault();
        const file = fileInput.current.files[0];
        if (!file) {
            setMessage('No file selected');
            return;
        }
        handleUpload(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    return (
        <form onSubmit={handleForm} style={{ marginTop: 20, marginBottom: 20 }}>
            <div
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                onDrop={handleDrop}
                style={{ border: dragActive ? '2px dashed #0070f3' : '2px dashed #ccc', padding: 16, borderRadius: 8, background: dragActive ? '#f0f8ff' : '#fafafa', marginBottom: 8 }}
            >
                <input type="file" ref={fileInput} accept=".cbz,.zip" style={{ display: 'inline-block', marginBottom: 8 }} />
                <div>Drag & drop a .cbz/.zip file here, or choose a file</div>
            </div>
            <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload Series'}</button>
            {progress > 0 && loading && <div>Uploading: {progress}%</div>}
            {message && <div>{message}</div>}
        </form>
    );
}

function EditModal({ open, onClose, series, onSave }) {
    const [title, setTitle] = useState(series?.title || '');
    useEffect(() => { setTitle(series?.title || ''); }, [series]);
    if (!open) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 300 }}>
                <h2>Edit Series</h2>
                <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', marginBottom: 12 }} />
                <button onClick={() => onSave(title)} style={{ marginRight: 8 }}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [seriesList, setSeriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('title');
    const [editSeries, setEditSeries] = useState(null);
    const [showEdit, setShowEdit] = useState(false);

    const refreshSeries = async () => {
        setLoading(true);
        setError('');
        try {
            const series = await getSeries();
            setSeriesList(series);
        } catch (err) {
            setError('Failed to load series');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshSeries();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this series?')) return;
        const ok = await deleteSeries(id);
        if (ok) refreshSeries();
        else alert('Failed to delete');
    };

    const handleEdit = (series) => {
        setEditSeries(series);
        setShowEdit(true);
    };
    const handleSaveEdit = async (title) => {
        setShowEdit(false);
        if (!editSeries) return;
        try {
            const jwt = localStorage.getItem('jwt');
            await fetch(`${apiConfig.endpoints.series}/${editSeries.id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${jwt}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });
            refreshSeries();
        } catch {}
    };

    // Filter and sort
    const filtered = seriesList.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));
    filtered.sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : 0);

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
            <h1>My Collection</h1>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="title">Sort by Title</option>
                </select>
            </div>
            <FileUpload onUpload={refreshSeries} />
            {loading ? <div>Loading...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'flex-start' }}>
                    {filtered.length === 0 && <div>No series yet.</div>}
                    {filtered.map(series => {
                        const progress = getProgress(series.id);
                        return (
                            <div key={series.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, width: 180, textAlign: 'center', position: 'relative', background: '#fff', boxShadow: '0 2px 8px #0001' }}>
                                <Link href={`/reader/${series.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {series.cover_path ? (
                                        <Image 
                                            src={`${apiConfig.baseUrl}${series.cover_path.replace('/workspaces/Project-Myriad','')}`} 
                                            alt={series.title} 
                                            width={120}
                                            height={180}
                                            style={{ maxWidth: 120, maxHeight: 180, marginBottom: 8, borderRadius: 4 }} 
                                        />
                                    ) : (
                                        <div style={{ width: 120, height: 180, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', borderRadius: 4 }}>No Cover</div>
                                    )}
                                    <h3 style={{ fontSize: 16, margin: 0 }}>{series.title}</h3>
                                </Link>
                                <div style={{ height: 8, background: '#eee', borderRadius: 4, margin: '8px 0' }}>
                                    <div style={{ width: `${progress}%`, height: 8, background: '#0070f3', borderRadius: 4, transition: 'width 0.3s' }} />
                                </div>
                                <button onClick={() => handleEdit(series)} style={{ position: 'absolute', top: 8, left: 8, background: '#09f', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleDelete(series.id)} style={{ position: 'absolute', top: 8, right: 8, background: '#f44', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Delete</button>
                                <Link href={`/reader/${series.id}`} style={{ textDecoration: 'none' }}>
                                    <button style={{ marginTop: 8, width: '100%' }}>Continue Reading</button>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
            <EditModal open={showEdit} onClose={() => setShowEdit(false)} series={editSeries} onSave={handleSaveEdit} />
        </div>
    );
}
