import type { Business } from "@/components/business-card"

export const sampleBusinesses: Business[] = [
  {
    id: "1",
    name: "Rainforest AI",
    industry: "Technology",
    region: "Mainland/Southwest",
    city: "Vancouver",
    description:
      "Satellite imagery and machine learning to monitor old-growth forest health across BC's coast. Leading the charge in environmental AI.",
    tags: ["Clean Energy"],
    employees: 24,
    verified: true,
  },
  {
    id: "2",
    name: "Tidal Works",
    industry: "Clean Energy",
    region: "Vancouver Island/Coast",
    city: "Victoria",
    description:
      "Modular tidal turbine systems harvesting BC's coastal energy with minimal ecological impact. Proven technology for remote communities.",
    employees: 18,
    verified: true,
  },
  {
    id: "3",
    name: "Orca Health",
    industry: "Health & Life",
    region: "Thompson-Okanagan",
    city: "Kelowna",
    description:
      "AI diagnostic platform connecting rural BC communities with specialist telemedicine services for faster, better care.",
    employees: 32,
    verified: true,
  },
  {
    id: "4",
    name: "Pacific Ledger",
    industry: "Technology",
    region: "Mainland/Southwest",
    city: "Vancouver",
    description:
      "Enterprise blockchain solutions for supply chain transparency in BC's export economy, from forestry to fisheries.",
    employees: 15,
    verified: false,
  },
  {
    id: "5",
    name: "Canopy Studios",
    industry: "Media",
    region: "Mainland/Southwest",
    city: "Burnaby",
    description:
      "Immersive VR and AR experiences for BC tourism, education, and cultural heritage preservation projects.",
    tags: ["Technology"],
    employees: 12,
    verified: true,
  },
  {
    id: "6",
    name: "Harvest Robotics",
    industry: "Agriculture",
    region: "Thompson-Okanagan",
    city: "Vernon",
    description:
      "Autonomous harvesting robots for Okanagan orchards and vineyards. Reducing labor costs while improving yield quality.",
    tags: ["Manufacturing"],
    employees: 28,
    verified: true,
  },
  {
    id: "7",
    name: "Boreal Biotech",
    industry: "Health & Life",
    region: "Mainland/Southwest",
    city: "Vancouver",
    description:
      "Developing next-generation biologics derived from BC's unique marine ecosystems for oncology and autoimmune conditions.",
    employees: 45,
    verified: true,
  },
  {
    id: "8",
    name: "CleanGrid Solutions",
    industry: "Clean Energy",
    region: "Mainland/Southwest",
    city: "Surrey",
    description:
      "Smart grid management software optimizing renewable energy distribution across municipal and provincial networks.",
    tags: ["Technology"],
    employees: 22,
    verified: true,
  },
  {
    id: "9",
    name: "Summit Manufacturing",
    industry: "Manufacturing",
    region: "Cariboo",
    city: "Prince George",
    description:
      "Advanced composite materials manufacturing for aerospace and clean energy sectors, built from BC resources.",
    employees: 60,
    verified: true,
  },
  {
    id: "10",
    name: "Inlet Creative",
    industry: "Media",
    region: "Mainland/Southwest",
    city: "Vancouver",
    description:
      "Award-winning animation and visual effects studio powering international film, streaming, and gaming productions.",
    employees: 85,
    verified: true,
  },
  {
    id: "11",
    name: "FarmSense Analytics",
    industry: "Agriculture",
    region: "Nechako",
    city: "Vanderhoof",
    description:
      "IoT sensor networks and predictive analytics for precision farming across BC's northern agricultural regions.",
    tags: ["Technology"],
    employees: 14,
    verified: false,
  },
  {
    id: "12",
    name: "Waypoint Consulting",
    industry: "Professional Services",
    region: "Mainland/Southwest",
    city: "Vancouver",
    description:
      "Strategic advisory services for early-stage startups navigating BC's funding landscape, from IRAP to venture capital.",
    employees: 8,
    verified: true,
  },
]

export const industries = [
  "All",
  "Technology",
  "Clean Energy",
  "Health & Life",
  "Media",
  "Agriculture",
  "Manufacturing",
  "Professional Services",
]

export const regions = [
  "All Regions",
  "Mainland/Southwest",
  "Vancouver Island/Coast",
  "Thompson-Okanagan",
  "Cariboo",
  "Nechako",
  "North Coast",
  "Kootenay",
  "Northeast",
]
