export type University = {
  id: number;
  name: string;
  location: string;
  tags: string[];
  image: string;
  details: {
    summary: string;
    acceptanceRate: string;
    tuition: string;
    topPrograms: string;
    campusVibe: string;
  };
};

export const UNIVERSITIES: University[] = [
  {
    id: 1,
    name: "Tech Institute of Science",
    location: "Boston, MA",
    tags: ["STEM", "Research", "Urban"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=500&h=300&fit=crop",
    details: {
      summary: "A research-driven campus with strong industry partnerships and applied labs.",
      acceptanceRate: "22%",
      tuition: "$38,000 / year",
      topPrograms: "Computer Science, Data Science, Robotics",
      campusVibe: "Fast-paced, urban, innovation-focused",
    },
  },
  {
    id: 2,
    name: "Liberal Arts College",
    location: "Portland, OR",
    tags: ["Humanities", "Small Class Sizes", "Creative"],
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=500&h=300&fit=crop",
    details: {
      summary: "Small cohorts and discussion-heavy classes with strong mentorship.",
      acceptanceRate: "34%",
      tuition: "$29,500 / year",
      topPrograms: "Political Science, Literature, Psychology",
      campusVibe: "Collaborative, arts-forward, residential",
    },
  },
  {
    id: 3,
    name: "State University",
    location: "Austin, TX",
    tags: ["Sports", "Engineering", "Large Campus"],
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&h=300&fit=crop",
    details: {
      summary: "Large campus with diverse majors and a strong alumni network.",
      acceptanceRate: "48%",
      tuition: "$16,400 / year",
      topPrograms: "Engineering, Business, Communications",
      campusVibe: "Energetic, social, tradition-rich",
    },
  },
  {
    id: 4,
    name: "Design Academy",
    location: "New York, NY",
    tags: ["Arts", "Design", "Studio"],
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&h=300&fit=crop",
    details: {
      summary: "Studio-based learning with portfolio-driven assessments.",
      acceptanceRate: "19%",
      tuition: "$41,000 / year",
      topPrograms: "Graphic Design, UX, Industrial Design",
      campusVibe: "Creative, city-based, project-centric",
    },
  },
  {
    id: 6,
    name: "Pacific Ocean University",
    location: "San Diego, CA",
    tags: ["Marine Bio", "Environmental", "Coastal"],
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=500&h=300&fit=crop",
    details: {
      summary: "Coastal campus with field labs and marine research stations.",
      acceptanceRate: "31%",
      tuition: "$27,800 / year",
      topPrograms: "Marine Biology, Environmental Science, Oceanography",
      campusVibe: "Outdoor-focused, hands-on, relaxed",
    },
  },
  {
    id: 7,
    name: "Mountain View College",
    location: "Denver, CO",
    tags: ["Geology", "Outdoors", "Sustainable"],
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=500&h=300&fit=crop",
    details: {
      summary: "Field-study curriculum with sustainability-focused programs.",
      acceptanceRate: "40%",
      tuition: "$21,200 / year",
      topPrograms: "Geology, Environmental Engineering, Ecology",
      campusVibe: "Adventurous, outdoorsy, sustainability-minded",
    },
  },
];
