const properties = [
  {
    id: 1,
    title: "லட்சுமி நகர்",
    location: "ஓச்சேரி டு பனப்பாக்கம், புதூர் மோட்டுர், தேசிய நெடுஞ்சாலையிலிருந்து 1.5 கி.மீ",
    type: "Residential",
    price: 320000,
    pricePerSqft: 267,
    size: 1200,
    image: "/img/lakshmi_nagar.jpg",
    features: ["DTCP Approved", "Clear Title", "Ready to Register", "Main Road Access"],
    status: "Available",
    dtcpNumber: "DTCP/115/2022",
    mapUrl: "https://www.google.com/maps/embed?...", // paste your Lakshmi Nagar Google Maps embed link
    reviews: [
      { user: "Ravi K.", rating: 5, comment: "Very peaceful area, close to highway." },
      { user: "Meena P.", rating: 4, comment: "Good investment for future, well connected." },
    ],
  },
  {
    id: 2,
    title: "செல்லியம்மன் நகர்",
    location: "வாலாஜா அனந்தலை, செங்காடு ஊராட்சி, ரிஜிஸ்டர் ஆபிஸ் அருகில்",
    type: "Residential",
    price: 450000,
    pricePerSqft: 280,
    size: 1500,
    image: "",
    features: ["Near Register Office", "DTCP Approved", "Clear Title"],
    status: "Hot Deal",
    dtcpNumber: "DTCP/2023/055",
    mapUrl: "https://www.google.com/maps/embed?...", // Selliyamman Nagar Google Maps link
    reviews: [
      { user: "Arun M.", rating: 5, comment: "Prime location near town, good transport." },
      { user: "Priya S.", rating: 4, comment: "Decent water supply, safe environment." },
    ],
  },
  {
    id: 3,
    title: "Walaja City",
    location: "Anandhalai next Sengadu Village, near TATA Car Factory, Panapakkam",
    type: "Residential",
    price: 550000,
    pricePerSqft: 300,
    size: 1800,
    image: "",
    features: ["Near TATA Car Factory", "Prime Location", "DTCP Approved"],
    status: "Limited",
    dtcpNumber: "DTCP/2023/078",
    mapUrl: "https://www.google.com/maps/embed?...", // Walaja city Google Maps link
    reviews: [
      { user: "Vijay K.", rating: 5, comment: "Best for rental income, close to industries." },
      { user: "Sangeetha R.", rating: 4, comment: "Upcoming area, price will rise soon." },
    ],
  },
];

export default properties;
