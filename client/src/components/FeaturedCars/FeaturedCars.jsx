import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import CarCard from '../CarCard/CarCard';
import { carsAPI } from '../../services/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './FeaturedCars.css';

// Sample data for when backend is not available
const sampleUsedCars = [
    {
        id: 1,
        title: 'Toyota Corolla GLi 1.3 VVTi',
        price: 4500000,
        year: 2022,
        mileage: 25000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Lahore',
        engineCapacity: 1300,
        image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400'
    },
    {
        id: 2,
        title: 'Honda Civic Oriel 1.8 i-VTEC',
        price: 6200000,
        year: 2021,
        mileage: 35000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Karachi',
        engineCapacity: 1800,
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'
    },
    {
        id: 3,
        title: 'Suzuki Alto VXR 660cc',
        price: 2100000,
        year: 2023,
        mileage: 15000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        city: 'Islamabad',
        engineCapacity: 660,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'
    },
    {
        id: 4,
        title: 'KIA Sportage Alpha AWD',
        price: 8500000,
        year: 2022,
        mileage: 20000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Rawalpindi',
        engineCapacity: 2000,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400'
    },
    {
        id: 5,
        title: 'Hyundai Tucson GLS Sport',
        price: 9200000,
        year: 2023,
        mileage: 10000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Lahore',
        engineCapacity: 2000,
        image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400'
    },
    {
        id: 6,
        title: 'Toyota Yaris ATIV X CVT',
        price: 4800000,
        year: 2022,
        mileage: 18000,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Multan',
        engineCapacity: 1500,
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400'
    }
];

const sampleNewCars = [
    {
        id: 'new-1',
        title: 'Toyota Corolla Cross 2024',
        price: 9500000,
        year: 2024,
        mileage: 0,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Lahore',
        engineCapacity: 1800,
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400'
    },
    {
        id: 'new-2',
        title: 'Honda HR-V 2024',
        price: 8900000,
        year: 2024,
        mileage: 0,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Karachi',
        engineCapacity: 1500,
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'
    },
    {
        id: 'new-3',
        title: 'KIA Sportage 2024',
        price: 10500000,
        year: 2024,
        mileage: 0,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Islamabad',
        engineCapacity: 2000,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400'
    },
    {
        id: 'new-4',
        title: 'Hyundai Tucson 2024',
        price: 11200000,
        year: 2024,
        mileage: 0,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Lahore',
        engineCapacity: 2000,
        image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400'
    },
    {
        id: 'new-5',
        title: 'MG HS 2024',
        price: 7800000,
        year: 2024,
        mileage: 0,
        fuelType: 'Petrol',
        transmission: 'Auto',
        city: 'Rawalpindi',
        engineCapacity: 1500,
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400'
    }
];

// Custom arrow components
const NextArrow = ({ onClick }) => (
    <button className="slider-arrow slider-next" onClick={onClick}>
        <FaChevronRight />
    </button>
);

const PrevArrow = ({ onClick }) => (
    <button className="slider-arrow slider-prev" onClick={onClick}>
        <FaChevronLeft />
    </button>
);

const FeaturedCars = ({ title = "Featured Used Cars", type = "used", cars: propCars }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedCars();
    }, [type]);

    const fetchFeaturedCars = async () => {
        setLoading(true);
        try {
            // Try to fetch from backend
            const response = await carsAPI.getFeatured({
                limit: 10,
                condition: type === 'new' ? 'New' : 'Used'
            });

            if (response.data?.data?.length > 0) {
                setCars(response.data.data);
            } else {
                // Use sample data if no backend data
                setCars(propCars || (type === 'new' ? sampleNewCars : sampleUsedCars));
            }
        } catch (error) {
            // Backend not available, use sample/prop data
            console.log('Using sample data - backend not available');
            setCars(propCars || (type === 'new' ? sampleNewCars : sampleUsedCars));
        }
        setLoading(false);
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: true,
                    centerMode: false,
                    variableWidth: false
                }
            }
        ]
    };

    return (
        <section className="featured-cars section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{title}</h2>
                    <Link to={type === 'new' ? '/new-cars' : '/used-cars?featured=true'} className="view-all-link">
                        View All
                        <FaArrowRight />
                    </Link>
                </div>

                {loading ? (
                    <div className="featured-loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="featured-slider">
                        <Slider {...settings}>
                            {cars.map((car, index) => (
                                <div key={car.id || car._id || index} className="slider-item">
                                    <CarCard car={car} featured={true} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedCars;
