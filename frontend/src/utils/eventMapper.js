/**
 * Maps an EventDto returned from the ASP.NET Core backend to the exact structure
 * expected by the React frontend components (like AttendeePortal, EventCard, etc.)
 * 
 * The backend returns:
 * { id, title, description, date, location, totalCapacity, organizerId, organizerName }
 * 
 * The frontend requires extra fields (image, price, category, time, etc.) that 
 * the backend does not store natively. This mapper enriches the DTO with default/mock 
 * values deterministically based on the event's ID so it remains consistent across renders.
 */

// Image Presets mapping
const presets = {
  music: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
  tech: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
  food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
  sports: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
  comedy: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&q=80&w=800",
  workshop: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800"
};

const categories = ["Music", "Tech", "Food", "Sports", "Workshop", "Comedy", "Festival", "Education"];
const prices = ["₹499", "₹999", "₹1500", "₹2500", "Free", "₹3000", "₹750"];

export function mapEventDtoToFrontend(dto) {
  // Deterministic mocking based on ID so the UI doesn't jump randomly on every re-render
  const idHash = typeof dto.id === 'number' ? dto.id : 1;
  const category = categories[idHash % categories.length];
  const price = (dto.price === undefined || dto.price === null) 
    ? prices[idHash % prices.length] 
    : (dto.price === 0 ? "Free" : `₹${dto.price}`);
  
  // Try to pick an image preset based on the category name
  const presetKey = Object.keys(presets).find(k => category.toLowerCase().includes(k)) || "tech";
  const image = dto.imageUrl || presets[presetKey];

  // Calculate startsInDays
  const eventDate = new Date(dto.date);
  const now = new Date();
  const diffTime = eventDate - now;
  const startsInDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return {
    id:          dto.id,
    title:       dto.title,
    description: dto.description,
    image:       image,
    date:        eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    time:        "19:00 - 22:00", // Default mock time
    location:    dto.location,
    category:    category,
    price:       price,
    seatsLeft:   dto.availableSeats ?? dto.totalCapacity, // Remaining seats (decreases with bookings)
    totalSeats:  dto.totalCapacity,                        // Original event capacity (immutable)
    rating:      (4.0 + (idHash % 10) / 10).toFixed(1), // E.g., 4.5, 4.8
    organizer:   dto.organizerName || "GoLoco Organizer",
    type:        dto.location && dto.location.toLowerCase() === 'remote' ? 'Online' : 'In-Person',
    trending:    idHash % 3 === 0,
    startsInDays: startsInDays,
    _rawDate:    dto.date // Keep raw ISO date for precise sorting if needed
  };
}

/**
 * Maps an array of DTOs to the frontend shape.
 */
export function mapEventDtos(dtos) {
  if (!Array.isArray(dtos)) return [];
  return dtos.map(mapEventDtoToFrontend);
}
