export const profile = {
  name: "Harshith Killada",
  title: "AI Engineer | Machine Learning Specialist",
  location: "Hyderabad, Telangana, India",
  email: "harshashk15@gmail.com",
  github: "https://github.com/Harsha77064",
  linkedin: "https://www.linkedin.com/in/harshith-killada",
  resume: "/Harshith-Killada-Resume.pdf",
  summary:
    "AI Engineer with a B.Tech in Artificial Intelligence. I design, deploy and retrain machine learning models across Generative AI (Gemini, GPT-4) and classic NLP and deep learning, and I build scalable AI systems on GCP.",
};

export const navLinks = [
  { id: 1, name: "Home", href: "#home" },
  { id: 2, name: "About", href: "#about" },
  { id: 3, name: "Experience", href: "#experience" },
  { id: 4, name: "Projects", href: "#projects" },
  { id: 5, name: "Skills", href: "#skills" },
  { id: 6, name: "Credentials", href: "#credentials" },
  { id: 7, name: "Contact", href: "#contact" },
];

export const stats = [
  { value: "< 2s", label: "RAG response time" },
  { value: "30%", label: "Faster SQL-generation execution" },
  { value: "50%", label: "Less manual reporting" },
  { value: "94%+", label: "Lane detection accuracy" },
];

export const experience = [
  {
    role: "AI Engineer",
    company: "Rapidious (NextOrbit)",
    location: "Hyderabad, India",
    period: "Aug 2025 – Dec 2025",
    points: [
      "Worked with AI architects and cloud engineers to design and deploy production-grade ML models, and documented procedures for audits and maintenance.",
      "Built RAG-powered systems with Gemini and GPT-4 that answered in under 2 seconds on large datasets while following data privacy standards.",
      "Retrained models and optimized SQL-generation prompts, giving 30% faster execution and better accuracy.",
      "Ran system tests and troubleshooting for ML infrastructure, and cut manual reporting effort by 50% with automated ETL pipelines.",
      "Guided CRM development teams in integrating AI models into enterprise workflows.",
    ],
  },
];

export const projects = [
  {
    title: "Production-Grade RAG Chatbot",
    role: "AI Developer",
    year: "2024",
    description:
      "An end-to-end NLP system built with LangChain and the Google Gemini API that processes 500+ page corpora and answers with exact citations. Outputs were checked for hallucinations, with structured prompt flows for accuracy.",
    tags: ["LangChain", "Gemini API", "GCP", "RAG"],
    github: "", // add your repo link
    live: "", // add a demo link if you have one
  },
  {
    title: "Lane Detection CNN",
    role: "Lead Developer",
    year: "2024",
    description:
      "A deep learning model built with TensorFlow and OpenCV for real-time lane detection at 94%+ accuracy. Covered the full pipeline from data preprocessing to evaluation.",
    tags: ["TensorFlow", "OpenCV", "CNN", "Python"],
    github: "",
    live: "",
  },
];

export const skillGroups = [
  {
    title: "AI & Machine Learning",
    items: ["Generative AI (LLMs)", "RAG Pipelines", "Neural Networks (CNNs)", "NLP", "Model Retraining", "Hyperparameter Tuning", "Ethical AI Evaluation"],
  },
  {
    title: "Tools & Platforms",
    items: ["Google Cloud Platform", "OpenAI API", "Anthropic Claude", "LangChain", "LlamaIndex", "TensorFlow", "OpenCV", "Hugging Face"],
  },
  {
    title: "Software Engineering",
    items: ["Python", "FastAPI", "Docker", "PostgreSQL", "FAISS", "Pinecone", "SQL", "Java Full Stack", "Git"],
  },
];

export const education = [
  {
    degree: "B.Tech in Artificial Intelligence",
    school: "Geethanjali College of Engineering, Hyderabad",
    years: "2021 – 2025",
  },
];

export const certifications = [
  {
    title: "Anthropic Claude 101",
    detail: "Claude API, prompt engineering and AI system architecture",
    year: "2026",
  },
  {
    title: "Wipro TalentNext & Oracle Certified",
    detail: "Java Full Stack and Advanced Java Programming",
    year: "2025",
  },
];