import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import resources from "../../resource";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    id: 1,
    image: resources.Farmer_Hero_1.src,
    titleParts: {
      before: "Connecting Rural ",
      highlight: "Healthcare",
      after: "",
    },
    subtitle:
      "Bridging the gap between farmers, veterinary doctors, and medical stores for better livestock health management",
    primaryCta: "Who We Are",
    secondaryCta: "Get Started",
    primaryRoute: "/about",
    secondaryRoute: "/signup/farmer",
  },
  {
    id: 2,
    image: resources.Farmer_Hero_2.src,
    titleParts: {
      before: "Expert ",
      highlight: "Consultation",
      after: " at Your Fingertips",
    },
    subtitle:
      "Access verified veterinary doctors for real-time consultation and professional medical advice for your livestock",
    primaryCta: "Find Doctors",
    secondaryCta: "Learn More",
    primaryRoute: "/login",
    secondaryRoute: "/about",
  },
  {
    id: 3,
    image: resources.Farmer_Hero_3.src,
    titleParts: {
      before: "Smart ",
      highlight: "Medicine",
      after: " Delivery",
    },
    subtitle:
      "Efficient transport-based delivery system ensuring timely access to essential veterinary medicines",
    primaryCta: "Order Now",
    secondaryCta: "View Stores",
    primaryRoute: "/login",
    secondaryRoute: "/signup/farmer",
  },
];

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide
              ? "translate-x-0"
              : index < currentSlide
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
        >
          <div
            className="h-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className="max-w-4xl mx-auto text-white animate-fadeIn backdrop-blur-md bg-white/10 rounded-xl p-8">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  {slide.titleParts.before}
                  <span className="text-blue-600">
                    {slide.titleParts.highlight}
                  </span>
                  {slide.titleParts.after}
                </h1>
                <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="text-lg px-8 py-4 rounded-md bg-white text-blue-600 font-semibold hover:bg-gray-100 transition"
                    onClick={() => navigate(slide.primaryRoute)}
                  >
                    {slide.primaryCta}
                  </button>
                  <button
                    className="text-lg px-8 py-4 rounded-md border border-white bg-white/10 text-white hover:bg-white hover:text-blue-600 transition"
                    onClick={() => navigate(slide.secondaryRoute)}
                  >
                    {slide.secondaryCta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
