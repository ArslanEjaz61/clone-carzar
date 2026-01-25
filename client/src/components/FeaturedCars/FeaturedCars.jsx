import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import CarCard from '../CarCard/CarCard';
import { carsAPI } from '../../services/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './FeaturedCars.css';



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
                setCars([]);
            }
        } catch (error) {
            console.error('Error fetching featured cars:', error);
            setCars([]);
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
