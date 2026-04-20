export const MEETUPS = [
    {
        id: 1,
        title: "Sunday Run Club",
        location: "Central Park, NY",
        address: "Columbus Circle Entrance, NY 10019",
        time: "Sun, 8:00 AM",
        attendees: 24,
        image: "https://images.unsplash.com/photo-1452626038306-9aae5e0fd165?q=80&w=1000&auto=format&fit=crop",
        tags: ["Fitness", "Morning"],
        description: "Join us for a 5k run through Central Park followed by coffee and bagels. All paces welcome! This is a great way to start your Sunday with some fresh air and good company.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12084.153721389233!2d-73.9749968412891!3d40.78121990000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2589a018531e3%3A0xb9df1f7387a94119!2sCentral%20Park!5e0!3m2!1sen!2sus!4v1689617349999!5m2!1sen!2sus",
        distance: 2.5,
        isTrending: true
    },
    {
        id: 2,
        title: "Founders Coffee",
        location: "Blue Bottle, Downtown",
        address: "100 Broadway, New York, NY 10005",
        time: "Tue, 10:30 AM",
        attendees: 12,
        image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1000&auto=format&fit=crop",
        tags: ["Networking", "Tech"],
        description: "Casual meetup for founders and indie hackers. No agenda, just coffee and conversation. Share what you're working on, get feedback, and meet potential collaborators.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.5385635338085!2d-74.0139402845952!3d40.71277637933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1714fc2eaf%3A0xe5f8e5b4c16d00e5!2sBlue%20Bottle%20Coffee!5e0!3m2!1sen!2sus!4v1689617456789!5m2!1sen!2sus",
        distance: 5.1,
        isTrending: false
    },
    {
        id: 3,
        title: "Indie Movie Night",
        location: "The Roxy Theater",
        address: "2 Avenue of the Americas, NY 10013",
        time: "Fri, 7:00 PM",
        attendees: 18,
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop",
        tags: ["Cinema", "Chill"],
        description: "Watching the latest indie release followed by drinks at the bar next door. Perfect for film buffs and anyone looking for a relaxed Friday night out.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.956787688326!2d-74.00808568459424!3d40.74100297932822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf6b3068e3%3A0xf6573c09193d25d!2sRoxy%20Cinema%20New%20York!5e0!3m2!1sen!2sus!4v1689617534567!5m2!1sen!2sus",
        distance: 1.2,
        isTrending: true
    },
    {
        id: 4,
        title: "Analog Photography",
        location: "SoHo Walk",
        address: "Prince St & Broadway, NY 10012",
        time: "Sat, 2:00 PM",
        attendees: 30,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
        tags: ["Art", "Walk"],
        description: "Bring your film camera! We'll walk around SoHo capturing the architecture and street style. Beginners welcome. We'll end at a lab to drop off rolls.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.235548987456!2d-74.0049282845944!3d40.7237077793306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2598d1a12345b%3A0x1234567890abcdef!2sSoHo%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1689617612345!5m2!1sen!2sus",
        distance: 0.8,
        isTrending: true
    },
];

export const CITIES = [
    "Mumbai, MH",
    "Delhi, DL",
    "Bengaluru, KA",
    "Chennai, TN",
    "Hyderabad, TS",
    "Kolkata, WB",
    "Pune, MH",
    "Ahmedabad, GJ",
    "Jaipur, RJ",
    "Chandigarh, CH",
    "Indore, MP",
    "Bhopal, MP",
    "Surat, GJ",
    "Vadodara, GJ",
    "Nagpur, MH",
    "Noida, UP",
    "Gurugram, HR",
    "Faridabad, HR",
    "Ghaziabad, UP",
    "Lucknow, UP",
    "Kanpur, UP",
    "Patna, BR",
    "Ranchi, JH",
    "Bhubaneswar, OD",
    "Visakhapatnam, AP",
    "Vijayawada, AP",
    "Coimbatore, TN",
    "Madurai, TN",
    "Trichy, TN",
    "Kochi, KL",
    "Trivandrum, KL",
    "Thiruvananthapuram, KL",
    "Kozhikode, KL",
    "Thrissur, KL",
    "Mangaluru, KA",
    "Mysuru, KA",
    "Hubballi, KA",
    "Belagavi, KA",
    "Udaipur, RJ",
    "Jodhpur, RJ",
    "Ajmer, RJ",
    "Amritsar, PB",
    "Ludhiana, PB",
    "Jalandhar, PB",
    "Dehradun, UK",
    "Haridwar, UK",
    "Shimla, HP",
    "Jammu, JK",
    "Srinagar, JK",
    "Guwahati, AS",
    "Shillong, ML",
    "Agartala, TR",
    "Imphal, MN",
    "Aizawl, MZ",
    "Itanagar, AR"
];

export interface Spot {
    id: number;
    name: string;
    type: string;
    rating: number;
    image: string;
    vibe: string[];
    location?: string;
    distance?: number;
    mapUrl?: string;
    address?: string;
}

export const SPOTS: Spot[] = [
    {
        id: 1,
        name: "The Velvet Loft",
        type: "Jazz Lounge",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1000&auto=format&fit=crop",
        vibe: ["Chill", "Music", "Date Night"],
        location: "Downtown",
        distance: 1.2,
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.956787688326!2d-74.00808568459424!3d40.74100297932822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf6b3068e3%3A0xf6573c09193d25d!2sRoxy%20Cinema%20New%20York!5e0!3m2!1sen!2sus!4v1689617534567!5m2!1sen!2sus",
        address: "123 Jazz Ave, Downtown"
    },
    {
        id: 2,
        name: "Neon Arcade",
        type: "Gaming Bar",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1511882150382-421056c80347?q=80&w=1000&auto=format&fit=crop",
        vibe: ["Fun", "Gaming", "Group"],
        location: "West End",
        distance: 3.5,
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.235548987456!2d-74.0049282845944!3d40.7237077793306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2598d1a12345b%3A0x1234567890abcdef!2sSoHo%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1689617612345!5m2!1sen!2sus",
        address: "45 Flicker St, West End"
    },
    {
        id: 3,
        name: "Urban Garden",
        type: "Rooftop Cafe",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1621251910609-84382601287c?q=80&w=1000&auto=format&fit=crop",
        vibe: ["Scenic", "Coffee", "Work"],
        location: "Uptown",
        distance: 0.5,
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12084.153721389233!2d-73.9749968412891!3d40.78121990000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2589a018531e3%3A0xb9df1f7387a94119!2sCentral%20Park!5e0!3m2!1sen!2sus!4v1689617349999!5m2!1sen!2sus",
        address: "88 Skyline Blvd, Uptown"
    },
    {
        id: 4,
        name: "Vinyl & Brew",
        type: "Record Store Cafe",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1507494541700-1c5c4e40293c?q=80&w=1000&auto=format&fit=crop",
        vibe: ["Hipster", "Quiet", "Music"],
        location: "Arts District",
        distance: 2.1,
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.5385635338085!2d-74.0139402845952!3d40.71277637933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1714fc2eaf%3A0xe5f8e5b4c16d00e5!2sBlue%20Bottle%20Coffee!5e0!3m2!1sen!2sus!4v1689617456789!5m2!1sen!2sus",
        address: "77 Groove Ln, Arts District"
    },
    {
        id: 5,
        name: "Code & Coffee",
        type: "Co-working Cafe",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop",
        vibe: ["Work", "Focus", "Tech"],
        location: "Tech Park",
        distance: 5.0,
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.956787688326!2d-74.00808568459424!3d40.74100297932822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf6b3068e3%3A0xf6573c09193d25d!2sRoxy%20Cinema%20New%20York!5e0!3m2!1sen!2sus!4v1689617534567!5m2!1sen!2sus",
        address: "101 Beta Way, Tech Park"
    },
    {
        id: 6,
        name: "The Secret Garden",
        type: "Speakeasy",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1000&auto=format&fit=crop",
        vibe: ["Hidden", "Cocktails", "Intimate"],
        location: "Old Town",
        distance: 4.2,
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12084.153721389233!2d-73.9749968412891!3d40.78121990000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2589a018531e3%3A0xb9df1f7387a94119!2sCentral%20Park!5e0!3m2!1sen!2sus!4v1689617349999!5m2!1sen!2sus",
        address: "Unknown Door, Old Town"
    }
];

export interface Group {
    id: number;
    name: string;
    category: string;
    members: number;
    image: string;
    tags: string[];
    description: string;
    location: string;
    nextEvent?: string;
}

export const GROUPS: Group[] = [
    {
        id: 1,
        name: "NYC Tech Runners",
        category: "Fitness & Tech",
        members: 1240,
        image: "https://images.unsplash.com/photo-1552674605-6af24e6b189a?q=80&w=1000&auto=format&fit=crop",
        tags: ["Running", "Networking"],
        description: "A community of tech professionals who love to run. We meet every Tuesday for a 5k and coffee.",
        location: "Central Park, NY",
        nextEvent: "Tue, 7:00 AM"
    },
    {
        id: 2,
        name: "Brooklyn Bookworms",
        category: "Literature",
        members: 850,
        image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=1000&auto=format&fit=crop",
        tags: ["Reading", "Social"],
        description: "Monthly book club focusing on contemporary fiction and local authors.",
        location: "Brooklyn, NY",
        nextEvent: "Sat, 2:00 PM"
    },
    {
        id: 3,
        name: "Indie Hackers NYC",
        category: "Tech",
        members: 3200,
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
        tags: ["Startups", "SaaS"],
        description: "Support group for solo founders and bootstrapper building profitable businesses.",
        location: "Manhattan, NY",
        nextEvent: "Wed, 6:30 PM"
    },
    {
        id: 4,
        name: "Urban Photography",
        category: "Art",
        members: 1500,
        image: "https://images.unsplash.com/photo-1542038784409-43ed71d31988?q=80&w=1000&auto=format&fit=crop",
        tags: ["Photography", "Walks"],
        description: "Exploring the city through the lens. Weekly photo walks and quarterly gallery showcases.",
        location: "SoHo, NY",
        nextEvent: "Sun, 3:00 PM"
    }
];
