import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import BookingSection from "../components/BookingSection";
import AdditionalServices from "../components/AdditionalServices";
import PremiumExperience from "../components/PremiumExperience";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import "../styles/home.css";
import Chatbot from "../components/Chatbot";
import CookieBanner from "../components/CookieBanner";

export default function Home() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [petType, setPetType] = useState("Perro");
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [mainService, setMainService] = useState("Estancia premium");

  const addService = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((item) => item.id === service.id);
      if (exists) return prev;
      return [...prev, service];
    });
  };

  const removeService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.filter((service) => service.id !== serviceId),
    );
  };

  return (
    <div className="home-page">
      <Navbar />
      <Hero />

      <HowItWorks />

      <AdditionalServices
        selectedServices={selectedServices}
        onAddService={addService}
      />

      <PremiumExperience />
      <CTA />
      <Footer />
      <Chatbot />
      <CookieBanner />
    </div>
  );
}
