"use client";

import { useState, useEffect } from 'react';
import { Star, Edit, Trash2, X } from 'lucide-react';

type Review = {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function AdminReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  
  // Edit form state
  const [editName, setEditName] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const json = await res.json();
      if (json.success) {
        setReviews(json.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar la reseña de ${name}?`)) {
      try {
        const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          setReviews(reviews.filter(r => r._id !== id));
        } else {
          alert('Error al eliminar la reseña');
        }
      } catch (err) {
        console.error('Error deleting review:', err);
      }
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setEditName(review.name);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      const res = await fetch(`/api/reviews/${editingReview._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, rating: editRating, comment: editComment }),
      });
      const json = await res.json();

      if (json.success) {
        setReviews(reviews.map(r => r._id === editingReview._id ? json.data : r));
        setEditingReview(null);
      } else {
        alert('Error al actualizar la reseña');
      }
    } catch (err) {
      console.error('Error updating review:', err);
    }
  };

  if (loading) {
    return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Cargando opiniones...</p>;
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontWeight: 800 }}>Gestión de Opiniones</h2>
      
      {reviews.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No hay opiniones registradas en la tienda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((review) => (
            <div key={review._id} style={{ 
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', 
              padding: '1.5rem', background: 'var(--search-bg)', borderRadius: '12px', border: '1px solid var(--border)', gap: '1rem' 
            }}>
              {/* Info principal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1 1 300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.1rem' }}>{review.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < review.rating ? '#FFB800' : 'none'} color={i < review.rating ? '#FFB800' : '#cbd5e1'} />
                  ))}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic', margin: '0.5rem 0 0 0' }}>
                  "{review.comment}"
                </p>
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 100%', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button 
                  onClick={() => handleEditClick(review)}
                  style={{ background: '#dbeafe', color: '#2563eb', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', flex: 1, maxWidth: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Edit size={16} /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(review._id, review.name)}
                  style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', flex: 1, maxWidth: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Trash2 size={16} /> Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Edición */}
      {editingReview && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
        }}>
          <div style={{
            background: 'var(--card-bg)', padding: '2rem', borderRadius: '24px',
            width: '100%', maxWidth: '500px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>Editar Reseña</h3>
              <button onClick={() => setEditingReview(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
            </div>

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nombre del Cliente</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)', fontSize: '1rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Calificación</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={28} 
                      fill={star <= editRating ? '#FFB800' : 'none'} 
                      color={star <= editRating ? '#FFB800' : '#cbd5e1'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setEditRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comentario</label>
                <textarea 
                  value={editComment} 
                  onChange={e => setEditComment(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--search-bg)', color: 'var(--text-main)', fontSize: '1rem', minHeight: '100px', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setEditingReview(null)} style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '1rem', background: 'var(--primary)', color: '#1C5F5C', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
