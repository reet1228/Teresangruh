/**
 * Wedding Information Data Store
 * Couple: Ruchika & Sanyam (#tereSAngRUh)
 * Dates: 10th - 11th December 2026
 * Venue: Dennisons Beach Resort, Kumta, Karnataka
 */

export interface WeddingEvent {
  id: string;
  title: string;
  subTitle?: string;
  ceremonyName: string;
  date: string;
  isoDate: string; // For calendar & countdown
  time: string;
  venue: string;
  dressCode?: string;
  description: string;
  artwork: string;
  bgArtwork?: string;
  themeColor: {
    primary: string;
    secondary: string;
    badge: string;
    bg: string;
    text: string;
  };
  schedule?: {
    time: string;
    activity: string;
    location: string;
  }[];
}

export interface RSVPContact {
  name: string;
  phone: string;
  relation?: string;
}

export const WEDDING_DATA = {
  couple: {
    bride: "Ruchika",
    brideFullName: "Sou.Ka. Ruchika",
    groom: "Sanyamji",
    groomFullName: "Chi. Sanyamji",
    hashtag: "#tereSAngRUh",
    tagline: "Together with our families, we invite you to celebrate our union",
    datesSummary: "10TH – 11TH DECEMBER 2026",
    targetDateIST: "2026-12-10T15:00:00+05:30", // 10 Dec 2026 3:00 PM IST
  },
  
  religiousInvocations: [
    "SHREE GANESHAYA NAMAHA",
    "SHREE JIRAWALA PARSHWANATH NAMAHA",
    "SHREE MUNISUVRAT SWAMI NAMAHA",
    "SHREE AMBE MATAYA NAMAHA",
  ],

  grandparentBlessing: {
    title: "DIVINE BLESSINGS",
    elder: "LATE. SHA. DUNGARMALJI AMBGOTHA CHAUHAN",
    inviter: "SMT. AMBIBAI LATE. DUNGARMALJI CHAUHAN",
    message: "REQUESTS YOUR GRACIOUS PRESENCE AND BLESSINGS ON THE AUSPICIOUS OCCASION OF THE WEDDING OF HER GRAND DAUGHTER",
  },

  brideFamilyDetails: {
    parents: "SMT. DAMAYANTI & SHRI RAJENDRAJI AMBGOTHA CHAUHAN",
    grandparents: "SMT. AMBIBAI & LATE DUNGARMALJI AMBGOTHA CHAUHAN",
    nativePlace: "MARUDHAR : KALAPURA [ JALOR ]",
  },

  groomFamilyDetails: {
    parents: "SMT. SANGEETHA & SHRI NARESH SAKARIA",
    grandparents: "SMT. SOPUBAI & LATE CHUNNILALJI SAKARIA",
    nativePlace: "TAWAO - BENGALURU",
  },

  venue: {
    name: "Dennisons Beach Resort",
    city: "Kumta",
    state: "Karnataka",
    pincode: "581343",
    country: "India",
    addressString: "Dennisons Beach Resort, Holanagadde, Kumta, Karnataka 581343",
    description: "Nestled along the pristine Arabian Sea shoreline of Kumta, Karnataka, Dennisons Beach Resort offers a serene, royal coastal retreat where the sea breeze, swaying palms, and golden sands celebrate our union.",
    googleMapsUrl: "https://maps.google.com/?q=Dennisons+Beach+Resort+Kumta+Karnataka",
    embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15444.6!2d74.40!3d14.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbc18d1a0a5598d%3A0x67db2bcfad2aa484!2sKumta%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000",
    nearestAirport: "Goa Dabolim / Mopa International Airport (~140 km)",
    nearestStation: "Kumta Railway Station (~8 km)",
  },

  music: {
    src: "/assets/audio/wedding_music.mp3",
    title: "tereSAngRUh — Official Wedding Symphony",
    artist: "Ruchika & Sanyam Wedding Celebration",
  },

  events: [
    {
      id: "maayra",
      title: "Veera maayra bharan aayo",
      subTitle: "Traditional Welcoming of the Maternal Uncles & Family Blessings",
      ceremonyName: "MAAYRA CEREMONY",
      date: "10th December 2026",
      isoDate: "2026-12-10T15:00:00+05:30",
      time: "03:00 PM Onwards",
      venue: "Banquet Hall",
      dressCode: "Traditional Rajasthani / Pastel Festive",
      description: "A time-honoured Marwari ritual filled with devotion, joy, and emotional warmth as maternal uncles bring gifts, blessings, and auspicious shagun for the bride and family.",
      artwork: "/assets/optimized/page_03.webp",
      bgArtwork: "/assets/illustrations/maayra_bg.jpg",
      themeColor: {
        primary: "#C96D80",
        secondary: "#E8A598",
        badge: "#FDF2F0",
        bg: "from-[#FDF7F4] via-[#FCF1EE] to-[#FAF7F2]",
        text: "#4A2830",
      },
      schedule: [
        { time: "03:00 PM", activity: "Auspicious Welcome & Tilak Ceremony", location: "Banquet Hall" },
        { time: "03:30 PM", activity: "Traditional Maayra Presentation & Songs", location: "Banquet Hall" },
        { time: "04:30 PM", activity: "High Tea & Traditional Sweets", location: "Hall Veranda" },
      ],
    },
    {
      id: "sangeet",
      title: "Starlit Symphony",
      subTitle: "An Enchanting Evening of Music, Dance & Celebration Under the Stars",
      ceremonyName: "SANGEET",
      date: "10th December 2026",
      isoDate: "2026-12-10T19:00:00+05:30",
      time: "07:00 PM Onwards",
      venue: "Beach Deck",
      dressCode: "Glamorous Evening / Indo-Western Tux & Sequins",
      description: "As twilight falls over the Arabian Sea, join us for a grand musical soirée with crystal chandeliers, heartfelt family dance performances, and celebration until late night.",
      artwork: "/assets/optimized/page_04.webp",
      bgArtwork: "/assets/illustrations/sangeet_bg.jpg",
      themeColor: {
        primary: "#E2C37C",
        secondary: "#8B9BB4",
        badge: "#14233C",
        bg: "from-[#0A1424] via-[#0D1B32] to-[#0A1424]",
        text: "#FFFFFF",
      },
      schedule: [
        { time: "07:00 PM", activity: "Cocktails & Coastal Hors d'œuvres", location: "Beach Deck" },
        { time: "08:00 PM", activity: "Family Choreography & Special Duets", location: "Main Stage" },
        { time: "09:30 PM", activity: "Grand Dinner & DJ Night", location: "Deck Pavilion" },
      ],
    },
    {
      id: "carnival",
      title: "Love Fiesta",
      subTitle: "A Mediterranean & Indian Citrus-Themed Sunshine Celebration",
      ceremonyName: "CARNIVAL",
      date: "11th December 2026",
      isoDate: "2026-12-11T10:00:00+05:30",
      time: "10:00 AM Onwards",
      venue: "Poolside Lawn",
      dressCode: "Breezy Pastel, Florals & Vibrant Resort Wear",
      description: "Soak in the sun, splash by the pool, and enjoy joyful games, refreshing tropical coolers, live food counters, and infectious acoustic melodies.",
      artwork: "/assets/optimized/page_05.webp",
      bgArtwork: "/assets/illustrations/carnival_bg.jpg",
      themeColor: {
        primary: "#2563EB",
        secondary: "#E09838",
        badge: "#EFF6FF",
        bg: "from-[#F0F7FF] via-[#E6F0FA] to-[#FAF7F2]",
        text: "#1E3A5F",
      },
      schedule: [
        { time: "10:00 AM", activity: "Citrus Coolers & Sun-Kissed Brunch", location: "Poolside Lawn" },
        { time: "11:00 AM", activity: "Carnival Games & Live Acoustic Jam", location: "Lawn Gazebo" },
        { time: "01:00 PM", activity: "Coastal Feast & Coconut Treats", location: "Dining Pavilion" },
      ],
    },
    {
      id: "varmala",
      title: "Vows by the sea",
      subTitle: "The Royal Procession and Sacred Exchange of Floral Garlands",
      ceremonyName: "BARAAT & VARMALA",
      date: "11th December 2026",
      isoDate: "2026-12-11T15:00:00+05:30",
      time: "03:00 PM Onwards",
      venue: "Beachside & Reception Lobby",
      dressCode: "Royal Pastels, Sherwanis & Floral Lehengas",
      description: "The groom arrives with the energetic rhythm of the dhol, met with a gracious welcome at the shore, followed by the enchanting exchange of rose garlands as the sun sets over the ocean.",
      artwork: "/assets/optimized/page_06.webp",
      bgArtwork: "/assets/illustrations/varmala_bg.jpg",
      themeColor: {
        primary: "#BA6880",
        secondary: "#6A9984",
        badge: "#FAF1F3",
        bg: "from-[#FDF7F5] via-[#F7EFE9] to-[#FAF7F2]",
        text: "#462832",
      },
      schedule: [
        { time: "03:00 PM", activity: "Baraat Assembly & Dhol Procession", location: "Reception Lobby" },
        { time: "05:00 PM", activity: "Baraat Swagat & Milni", location: "Beachside Entrance" },
        { time: "06:00 PM", activity: "Sunset Varmala Garland Exchange", location: "Beachside Mandap" },
      ],
    },
    {
      id: "reception_phera",
      title: "Musical Moonlight & Promise of Forever",
      subTitle: "The Grand Reception Followed by Sacred Vedic Pheras",
      ceremonyName: "RECEPTION & PHERA",
      date: "11th December 2026",
      isoDate: "2026-12-11T19:00:00+05:30",
      time: "07:00 PM & Midnight Onwards",
      venue: "Poolside & Poolside Mantap",
      dressCode: "Opulent Traditional / Royal Heritage Reds & Creams",
      description: "An evening of regal dinner and heartfelt toasts under the moonlight, culminating in the sacred seven circumambulations around the holy fire at midnight to bind our souls for eternity.",
      artwork: "/assets/optimized/page_07.webp",
      bgArtwork: "/assets/illustrations/reception_bg.jpg",
      themeColor: {
        primary: "#C49A45",
        secondary: "#B8324D",
        badge: "#1E1A2C",
        bg: "from-[#0F1423] via-[#1A1A2E] to-[#120F1C]",
        text: "#FFFFFF",
      },
      schedule: [
        { time: "07:00 PM", activity: "Musical Moonlight Reception Dinner", location: "Poolside" },
        { time: "09:30 PM", activity: "Blessings & Congratulations Ceremony", location: "Royal Stage" },
        { time: "00:00 AM (Midnight)", activity: "Promise of Forever — Vedic Pheras", location: "Poolside Mantap" },
        { time: "03:00 AM", activity: "Auspicious Vidai Ceremony", location: "Palace Portico" },
      ],
    },
  ] as WeddingEvent[],

  familySections: {
    divineBlessings: "LATE. SHA. DUNGARMALJI AMBGOTHA CHAUHAN",
    
    vinayVinanti: [
      "SHA MAHESHKUMAR", "POPATLAL", "KANTILAL", "PUKHRAJ", "PARASMAL",
      "SHANTILAL", "RAMESHKUMAR", "DILIPKUMAR", "MAHENDRAKUMAR",
      "PRAVEENKUMAR", "MUKESHKUMAR", "RAJENDRAKUMAR", "KUNDANKUMAR",
      "VIKESHKUMAR", "PRAFFULKUMAR", "KAILASHKUMAR", "JITENDRA", "SUNIL", "MANISH",
      "VINEET", "SACHIN", "JATIN", "VIPUL", "RISHAB", "AKSHIT", "AMIT", "VIKRAM", "RAHUL",
      "HITESH", "SUMEET", "ROHAN", "SANYAM", "MANAV", "RISHABH", "REET", "DARSHAN", "JAINAM",
      "ARYA", "HEET", "RAKSHIT", "MANNAT", "EYAAN", "DYANSH", "VIRANSH", "MYRAV",
      "MIHEET AND THE ENTIRE AMBGOTA CHAUHAN FAMILY",
    ],
    
    awaitingYourPresence: "SMT. DAMAYANTHI - RAJENDRA KUMAR AMBGOTHA CHAUHAN",
    
    mayraPaksh: {
      elders: "LATE. SHA. TARACHANDJI, VARDICHANDJI",
      sons: "SON - NARESHJI, RAJANJI",
      grandsons: "GRANDSON - JAYESH, YASH, RIDIT",
      family: "TAWRECHA PARMAR PARIVAAR",
      location: "MARUDHAR KALAPURA - PUNE",
    },
    
    samdhiPaksh: {
      name: "SHA. NARESH KUMAR CHUNNILALJI, HARSHITJI & SAKARIA PARIVAAR",
      location: "TAWAO - BENGALURU",
    },
    
    specialInvites: [
      "SMT. PUSHPA - SURYAKANT JI",
      "SMT. SAJJAN - BHUPENDRA JI",
      "SMT. DAMAYANTHI - PRASHANT JI",
      "SMT. RENUKA - JITESH JI",
    ],
    
    mithiManwar: ["MANAV", "ISHAN", "SANCHI", "SANNVI"],
    
    rsvpContacts: [
      { name: "RAJENDRA KUMAR", phone: "9480426253", formattedPhone: "+91 94804 26253" },
      { name: "KAILASH KUMAR", phone: "9448453036", formattedPhone: "+91 94484 53036" },
      { name: "AKSHAY KOTHARI", phone: "7829395699", formattedPhone: "+91 78293 95699" },
      { name: "REET JAIN", phone: "7022305346", formattedPhone: "+91 70223 05346" },
    ],
    
    bestCompliments: "RAJENDRA TEXTILES, BENGALURU",
  },

  giftPolicy: {
    title: "A Gentle Request Regarding Gifts",
    message: "Your gracious presence, warm blessings, and heartfelt prayers are the greatest gift we could ever receive as we begin this new journey together. We humbly request no boxed gifts.",
  },

  closingMessage: {
    quote: "Two lives, two hearts, joined together in friendship, united forever in love.",
    main: "Your presence will make our celebration even more special.",
    salutation: "With love, Ruchika & Sanyam",
    hashtag: "#tereSAngRUh",
  },
};
