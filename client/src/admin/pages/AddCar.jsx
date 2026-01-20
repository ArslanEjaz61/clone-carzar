import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { carsAPI } from '../../services/api';
import { FaCar, FaUpload, FaTimes, FaCheck } from 'react-icons/fa';
import './AddCar.css';

const AddCar = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const conditionParam = searchParams.get('condition') || 'Used';

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);

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
        condition: conditionParam,
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
        setFormData(prev => ({ ...prev, condition: conditionParam }));
    }, [conditionParam]);

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
        if (images.length + files.length > 10) {
            setError('Maximum 10 images allowed');
            return;
        }

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation - check all required fields
        if (!formData.title) {
            setError('Title is required');
            return;
        }
        if (!formData.make) {
            setError('Make is required');
            return;
        }
        if (!formData.model) {
            setError('Model is required');
            return;
        }
        if (!formData.price) {
            setError('Price is required');
            return;
        }
        if (!formData.city) {
            setError('City is required');
            return;
        }
        if (!formData.color) {
            setError('Color is required');
            return;
        }
        if (!formData.mileage && formData.mileage !== 0) {
            setError('Mileage is required');
            return;
        }
        if (!formData.engineCapacity) {
            setError('Engine Capacity is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Create FormData for multipart upload
            const formDataToSend = new FormData();

            // Add all form fields
            formDataToSend.append('title', formData.title);
            formDataToSend.append('make', formData.make);
            formDataToSend.append('model', formData.model);
            formDataToSend.append('variant', formData.variant);
            formDataToSend.append('year', formData.year);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('mileage', formData.mileage || 0);
            formDataToSend.append('fuelType', formData.fuelType);
            formDataToSend.append('transmission', formData.transmission);
            formDataToSend.append('engineCapacity', formData.engineCapacity || 1000);
            formDataToSend.append('color', formData.color);
            formDataToSend.append('bodyType', formData.bodyType);
            formDataToSend.append('city', formData.city);
            formDataToSend.append('registrationCity', formData.registrationCity || formData.city);
            formDataToSend.append('assembly', formData.assembly);
            formDataToSend.append('condition', formData.condition);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('contactPhone', formData.contactPhone || '0300-0000000');
            formDataToSend.append('isFeatured', formData.isFeatured);

            // Add features as JSON string
            formDataToSend.append('features', JSON.stringify(formData.features));

            // Add image files
            images.forEach((img) => {
                if (img.file) {
                    formDataToSend.append('images', img.file);
                }
            });

            console.log('Submitting car data...');
            const response = await carsAPI.createWithImages(formDataToSend);
            console.log('Car added:', response.data);
            setSuccess(true);

            // Reset form after 2 seconds
            setTimeout(() => {
                navigate('/admin/cars');
            }, 2000);
        } catch (err) {
            console.error('Add car error:', err);
            console.error('Error response:', err.response?.data);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to add car';
            setError(errorMsg);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="success-message">
                <FaCheck className="success-icon" />
                <h2>Car Added Successfully!</h2>
                <p>Redirecting to cars list...</p>
            </div>
        );
    }

    return (
        <div className="add-car-page">
            <div className="page-header">
                <h1>
                    <FaCar /> Add {formData.condition} Car
                </h1>
                <p>Fill in the details to add a new car listing</p>
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
                                placeholder="e.g. Toyota Corolla GLi 1.3 VVTi"
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
                                placeholder="e.g. Corolla"
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
                                placeholder="e.g. GLi, Altis Grande"
                            />
                        </div>

                        <div className="form-group">
                            <label>Year *</label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                min="1990"
                                max={new Date().getFullYear() + 1}
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
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="e.g. 4500000"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Mileage (km)</label>
                            <input
                                type="number"
                                name="mileage"
                                value={formData.mileage}
                                onChange={handleChange}
                                placeholder="e.g. 50000"
                            />
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
                            <input
                                type="number"
                                name="engineCapacity"
                                value={formData.engineCapacity}
                                onChange={handleChange}
                                placeholder="e.g. 1300"
                            />
                        </div>

                        <div className="form-group">
                            <label>Color</label>
                            <select name="color" value={formData.color} onChange={handleChange}>
                                <option value="">Select Color</option>
                                {colors.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Body Type</label>
                            <select name="bodyType" value={formData.bodyType} onChange={handleChange}>
                                {bodyTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Assembly</label>
                            <select name="assembly" value={formData.assembly} onChange={handleChange}>
                                <option value="Local">Local</option>
                                <option value="Imported">Imported</option>
                            </select>
                        </div>
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
                            <label>Registration City</label>
                            <select name="registrationCity" value={formData.registrationCity} onChange={handleChange}>
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
                            placeholder="Describe the car condition, features, history..."
                        ></textarea>
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
                        {images.map((img, index) => (
                            <div key={index} className="image-preview">
                                <img src={img.preview} alt={`Preview ${index + 1}`} />
                                <button type="button" className="remove-btn" onClick={() => removeImage(index)}>
                                    <FaTimes />
                                </button>
                                {index === 0 && <span className="main-badge">Main</span>}
                            </div>
                        ))}
                        {images.length < 10 && (
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
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/cars')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Car'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCar;
