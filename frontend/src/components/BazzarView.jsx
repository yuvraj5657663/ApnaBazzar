import { useEffect, useState } from 'react';
import { fetchProducts } from '../utils/api';

function BazaarView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Products fetch error:', err);
        setError('Could not load products. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <h3 style={{ textAlign: 'center', color: '#666' }}>Loading products...</h3>;
  }

  if (error) {
    return <h4 style={{ textAlign: 'center', color: '#dc2626' }}>{error}</h4>;
  }

  return (
    <div style={{ padding: '10px' }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '30px',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>ApnaBazzar 🛍️</h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>Aapki apni online dukan</p>
      </header>

      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {products.length === 0 ? (
          <h4 style={{ color: '#999' }}>No products available yet.</h4>
        ) : (
          products.map((p) => (
            <div key={p.id || p._id} style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '8px',
              width: '190px',
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.08)'
            }}>
              <img
                src={p.image}
                alt={p.name}
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <h4 style={{ margin: '10px 0 5px 0', fontSize: '16px', color: '#333' }}>{p.name}</h4>
              <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '16px', margin: '0 0 10px 0' }}>₹{p.price}</p>
              <button style={{
                backgroundColor: '#ff9900',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%'
              }}>
                Buy Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BazaarView;
