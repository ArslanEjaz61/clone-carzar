import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { carsAPI, getImageUrl } from '../../services/api';
import { FaCar, FaUpload, FaTimes, FaCheck } from 'react-icons/fa';
import './AddCar.css';

const EditCar = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        make: '',
        model: '',
        variant: '',
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        engineCapacity: '',
        color: '',
        bodyType: 'Sedan',
        city: '',
        registrationCity: '',
        assembly: 'Local',
        condition: 'Used',
        description: '',
        features: [],
        contactPhone: '',
        isFeatured: false
    });

    const makes = ['Toyota', 'Honda', 'Suzuki', 'KIA', 'Hyundai', 'Changan', 'MG', 'Haval', 'BAIC', 'Proton', 'BMW', 'Mercedes', 'Audi', 'Other'];
    const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'];
    const colors = ['White', 'Black', 'Silver', 'Grey', 'Red', 'Blue', 'Brown', 'Beige', 'Green', 'Other'];
    const bodyTypes = ['Sedan', 'Hatchback', 'SUV', 'Crossover', 'Pickup', 'Van', 'Coupe', 'Wagon', 'Other'];
    const featuresList = [
        'Air Conditioning', 'Power Steering', 'Power Windows', 'Power Mirrors',
        'ABS', 'Airbags', 'Sunroof', 'Leather Seats', 'Navigation', 'Rear Camera',
        'Cruise Control', 'Push Start', 'Alloy Rims', 'Fog Lights', 'Keyless Entry'
    ];

    useEffect(() => {
        fetchCarDetails();
    }, [id]);

    const fetchCarDetails = async () => {
        try {
            const response = await carsAPI.getById(id);
            if (response.data?.data) {
                const car = response.data.data;
                setFormData({
                    title: car.title || '',
                    make: car.make || '',
                    model: car.model || '',
                    variant: car.variant || '',
                    year: car.year || new Date().getFullYear(),
                    price: car.price || '',
                    mileage: car.mileage || '',
                    fuelType: car.fuelType || 'Petrol',
                    transmission: car.transmission || 'Automatic',
                    engineCapacity: car.engineCapacity || '',
                    color: car.color || '',
                    bodyType: car.bodyType || 'Sedan',
                    city: car.city || '',
                    registrationCity: car.registrationCity || '',
                    assembly: car.assembly || 'Local',
                    condition: car.condition || 'Used',
                    description: car.description || '',
                    features: car.features || [],
                    contactPhone: car.contactPhone || '',
                    isFeatured: car.isFeatured || false
                });
                setExistingImages(car.images || []);
            }
        } catch (err) {
            console.error('Error fetching car:', err);
            setError('Failed to load car details.');
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

    const handleFeatureToggle = (feature) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + existingImages.length + files.length > 10) {
            setError('Maximum 10 images allowed');
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
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.make || !formData.model || !formData.price || !formData.city) {
            setError('Please fill all required fields');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'features') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Keep track of remaining existing images
            formDataToSend.append('existingImages', JSON.stringify(existingImages));

            // Add new images
            images.forEach((img) => {
                if (img.file) {
                    formDataToSend.append('images', img.file);
                }
            });

            await carsAPI.updateWithImages(id, formDataToSend);
            setSuccess(true);

            setTimeout(() => {
                navigate('/admin/cars');
            }, 2000);
        } catch (err) {
            console.error('Update car error:', err);
            setError(err.response?.data?.message || 'Failed to update car.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Loading car details...</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="success-message">
                <FaCheck className="success-icon" />
                <h2>Car Updated Successfully!</h2>
                <p>Redirecting to cars list...</p>
            </div>
        );
    }

    return (
        <div className="add-car-page">
            <div className="page-header">
                <h1>
                    <FaCar /> Edit {formData.condition} Car
                </h1>
                <p>Update the details of your car listing</p>
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
                        Used Car
                    </button>
                    <button
                        type="button"
                        className={`toggle-btn ${formData.condition === 'New' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, condition: 'New' }))}
                    >
                        New Car
                    </button>
                </div>

                {/* Basic Info */}
                <section className="form-section">
                    <h3>Basic Information</h3>
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
                            <label>Make *</label>
                            <select name="make" value={formData.make} onChange={handleChange} required>
                                <option value="">Select Make</option>
                                {makes.map(make => (
                                    <option key={make} value={make}>{make}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Model *</label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Variant</label>
                            <input
                                type="text"
                                name="variant"
                                value={formData.variant}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Year *</label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Price & Specs */}
                <section className="form-section">
                    <h3>Price & Specifications</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Price (PKR) *</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Mileage (km)</label>
                            <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Fuel Type</label>
                            <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Electric">Electric</option>
                                <option value="CNG">CNG</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Transmission</label>
                            <select name="transmission" value={formData.transmission} onChange={handleChange}>
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Engine (cc)</label>
                            <input type="number" name="engineCapacity" value={formData.engineCapacity} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Color</label>
                            <select name="color" value={formData.color} onChange={handleChange}>
                                {colors.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="form-section">
                    <h3>Features</h3>
                    <div className="features-grid">
                        {featuresList.map(feature => (
                            <label key={feature} className="feature-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.features.includes(feature)}
                                    onChange={() => handleFeatureToggle(feature)}
                                />
                                {feature}
                            </label>
                        ))}
                    </div>
                </section>

                {/* Images */}
                <section className="form-section">
                    <h3>Images</h3>
                    <div className="images-grid">
                        {existingImages.map((img, index) => (
                            <div key={`existing-${index}`} className="image-preview">
                                <img src={getImageUrl(img.url)} alt={`Existing ${index + 1}`} />
                                <button type="button" className="remove-btn" onClick={() => removeExistingImage(index)}>
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                        {images.map((img, index) => (
                            <div key={`new-${index}`} className="image-preview">
                                <img src={img.preview} alt={`Preview ${index + 1}`} />
                                <button type="button" className="remove-btn" onClick={() => removeNewImage(index)}>
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                        {existingImages.length + images.length < 10 && (
                            <label className="upload-box">
                                <FaUpload />
                                <span>Add Image</span>
                                <input type="file" accept="image/*" multiple onChange={handleImageChange} hidden />
                            </label>
                        )}
                    </div>
                </section>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/cars')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Updating...' : 'Update Car'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCar;
