import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { partsAPI, getImageUrl } from '../../services/api';
import { FaCogs, FaUpload, FaTimes, FaCheck } from 'react-icons/fa';
import './AddCar.css'; // Reuse same styles

const EditPart = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        condition: 'Used',
        price: '',
        compatibleMakes: [],
        description: '',
        city: '',
        contactPhone: '',
        isFeatured: false
    });

    const categories = [
        'Engine Parts', 'Body Parts', 'Electrical', 'Suspension',
        'Brakes', 'Interior', 'Exterior', 'Wheels & Tires',
        'Accessories', 'Other'
    ];
    const makes = ['Toyota', 'Honda', 'Suzuki', 'KIA', 'Hyundai', 'Changan', 'MG', 'BMW', 'Mercedes', 'Universal'];
    const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];

    useEffect(() => {
        fetchPartDetails();
    }, [id]);

    const fetchPartDetails = async () => {
        try {
            const response = await partsAPI.getById(id);
            if (response.data?.data) {
                const part = response.data.data;
                setFormData({
                    title: part.title || '',
                    category: part.category || '',
                    condition: part.condition || 'Used',
                    price: part.price || '',
                    compatibleMakes: part.compatibleMakes || [],
                    description: part.description || '',
                    city: part.city || '',
                    contactPhone: part.contactPhone || '',
                    isFeatured: part.isFeatured || false
                });
                setExistingImages(part.images || []);
            }
        } catch (err) {
            console.error('Error fetching part:', err);
            setError('Failed to load part details.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError('');
    };

    const handleMakeToggle = (make) => {
        setFormData(prev => ({
            ...prev,
            compatibleMakes: prev.compatibleMakes.includes(make)
                ? prev.compatibleMakes.filter(m => m !== make)
                : [...prev.compatibleMakes, make]
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + existingImages.length + files.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeNewImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        const imgToRemove = existingImages[index];
        setRemovedImages(prev => [...prev, imgToRemove]);
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.category || !formData.price || !formData.city) {
            setError('Please fill all required fields');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('condition', formData.condition);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('city', formData.city);
            formDataToSend.append('contactPhone', formData.contactPhone);
            formDataToSend.append('isFeatured', formData.isFeatured);
            formDataToSend.append('compatibleMakes', JSON.stringify(formData.compatibleMakes));

            // Keep track of remaining existing images
            formDataToSend.append('existingImages', JSON.stringify(existingImages));

            // Add new images
            images.forEach((img) => {
                if (img.file) {
                    formDataToSend.append('images', img.file);
                }
            });

            await partsAPI.updateWithImages(id, formDataToSend);
            setSuccess(true);

            setTimeout(() => {
                navigate('/admin/parts');
            }, 2000);
        } catch (err) {
            console.error('Update part error:', err);
            setError(err.response?.data?.message || 'Failed to update part.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Loading part details...</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="success-message">
                <FaCheck className="success-icon" />
                <h2>Part Updated Successfully!</h2>
                <p>Redirecting to parts list...</p>
            </div>
        );
    }

    return (
        <div className="add-car-page">
            <div className="page-header">
                <h1>
                    <FaCogs /> Edit Auto Part
                </h1>
                <p>Update the details of your auto part listing</p>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="car-form">
                {/* Condition Toggle */}
                <div className="condition-toggle">
                    <button
                        type="button"
                        className={`toggle-btn ${formData.condition === 'Used' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, condition: 'Used' }))}
                    >
                        Used Part
                    </button>
                    <button
                        type="button"
                        className={`toggle-btn ${formData.condition === 'New' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, condition: 'New' }))}
                    >
                        New Part
                    </button>
                </div>

                {/* Basic Info */}
                <section className="form-section">
                    <h3>Part Information</h3>
                    <div className="form-grid">
                        <div className="form-group full">
                            <label>Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category *</label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Price (PKR) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Compatible Makes */}
                <section className="form-section">
                    <h3>Compatible With</h3>
                    <div className="features-grid">
                        {makes.map(make => (
                            <label key={make} className="feature-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.compatibleMakes.includes(make)}
                                    onChange={() => handleMakeToggle(make)}
                                />
                                {make}
                            </label>
                        ))}
                    </div>
                </section>

                {/* Location */}
                <section className="form-section">
                    <h3>Location & Contact</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>City *</label>
                            <select name="city" value={formData.city} onChange={handleChange} required>
                                <option value="">Select City</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Contact Phone</label>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="03XX-XXXXXXX"
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                />
                                Featured Listing
                            </label>
                        </div>
                    </div>
                </section>

                {/* Description */}
                <section className="form-section">
                    <h3>Description</h3>
                    <div className="form-group">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                        ></textarea>
                    </div>
                </section>

                {/* Images */}
                <section className="form-section">
                    <h3>Images</h3>
                    <div className="images-grid">
                        {/* Existing Images */}
                        {existingImages.map((img, index) => (
                            <div key={`existing-${index}`} className="image-preview">
                                <img src={getImageUrl(img.url)} alt={`Existing ${index + 1}`} />
                                <button type="button" className="remove-btn" onClick={() => removeExistingImage(index)}>
                                    <FaTimes />
                                </button>
                            </div>
                        ))}

                        {/* New Images */}
                        {images.map((img, index) => (
                            <div key={`new-${index}`} className="image-preview">
                                <img src={img.preview} alt={`Preview ${index + 1}`} />
                                <button type="button" className="remove-btn" onClick={() => removeNewImage(index)}>
                                    <FaTimes />
                                </button>
                            </div>
                        ))}

                        {existingImages.length + images.length < 5 && (
                            <label className="upload-box">
                                <FaUpload />
                                <span>Add Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    hidden
                                />
                            </label>
                        )}
                    </div>
                </section>

                {/* Submit */}
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/parts')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Updating...' : 'Update Part'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPart;
