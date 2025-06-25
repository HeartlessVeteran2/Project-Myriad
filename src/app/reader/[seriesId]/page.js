'use client';
import { useEffect, useState, useCallback } from 'react';
import { API_URL, API_BASE_URL } from '../../../lib/config';

export default function ReaderPage({ params }) {
    const { seriesId } = params;
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showThumbs, setShowThumbs] = useState(false);

    // Save progress to localStorage
    useEffect(() => {
        if (images.length > 0) {
            localStorage.setItem(`progress_${seriesId}`, Math.round(((page + 1) / images.length) * 100));
        }
    }, [page, images.length, seriesId]);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            setError('');
            try {
                const jwt = localStorage.getItem('jwt');
                const res = await fetch(`http://localhost:3001/api/series/${seriesId}/images`, {
                    headers: { 'Authorization': `Bearer ${jwt}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to fetch images');
                setImages(data.images);
                setPage(0);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (seriesId) fetchImages();
    }, [seriesId]);

    // Keyboard navigation
    const handleKey = useCallback((e) => {
        if (e.key === 'ArrowRight') setPage(p => Math.min(p + 1, images.length - 1));
        if (e.key === 'ArrowLeft') setPage(p => Math.max(p - 1, 0));
    }, [images.length]);
    useEffect(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleKey]);

    const nextPage = () => setPage(p => Math.min(p + 1, images.length - 1));
    const prevPage = () => setPage(p => Math.max(p - 1, 0));

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!images.length) return <div>No images found for this series.</div>;

    return (
        <div>
            <h1>Reader</h1>
            <div style={{ textAlign: 'center' }}>
                <img src={`http://localhost:3001${images[page]}`} alt={`Page ${page + 1}`} style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8, boxShadow: '0 2px 8px #0002' }} />
            </div>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
                <button onClick={prevPage} disabled={page === 0}>Previous</button>
                <span style={{ margin: '0 10px' }}>Page {page + 1} / {images.length}</span>
                <button onClick={nextPage} disabled={page === images.length - 1}>Next</button>
                <button style={{ marginLeft: 16 }} onClick={() => setShowThumbs(v => !v)}>{showThumbs ? 'Hide' : 'Show'} Thumbnails</button>
            </div>
            {showThumbs && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24, justifyContent: 'center' }}>
                    {images.map((img, idx) => (
                        <img
                            key={img}
                            src={`http://localhost:3001${img}`}
                            alt={`Thumb ${idx + 1}`}
                            style={{ width: 60, height: 80, objectFit: 'cover', border: idx === page ? '2px solid #0070f3' : '1px solid #ccc', borderRadius: 4, cursor: 'pointer' }}
                            onClick={() => setPage(idx)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
