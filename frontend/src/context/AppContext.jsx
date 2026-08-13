import React, { createContext, useState, useContext } from 'react'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [resume, setResume] = useState(null)
  const [resumeId, setResumeId] = useState(null)
  const [jobTarget, setJobTarget] = useState({
    title: '',
    company: '',
    description: ''
  })
  const [jobTargetId, setJobTargetId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const loadDemoData = () => {
    const demoResume = `
JOHN DOE
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Experienced full-stack developer with 5+ years of expertise in building scalable web applications using React, Node.js, and cloud technologies. Proven track record of delivering high-quality solutions and leading cross-functional teams.

EXPERIENCE

Senior Software Engineer | TechCorp Solutions | Jan 2022 - Present
- Led development of microservices architecture serving 2M+ daily users, reducing latency by 40%
- Designed and implemented real-time data pipeline using Apache Kafka, processing 500K+ events/second
- Mentored team of 5 junior developers, improving code quality by 35% through comprehensive code reviews
- Architected CI/CD pipeline using Jenkins and Docker, reducing deployment time from 2 hours to 15 minutes

Full Stack Developer | StartupXYZ | Jun 2019 - Dec 2021
- Developed responsive React SPA with Redux state management, serving 100K+ monthly users
- Built RESTful APIs using Node.js and Express, handling 50K requests/day
- Implemented PostgreSQL database schema design and optimization, improving query performance by 60%
- Collaborated with designers and product managers to deliver features ahead of schedule

Junior Developer | WebAgency Inc | Mar 2018 - May 2019
- Developed client-facing web applications using React and Vue.js
- Participated in agile development cycles with bi-weekly sprints
- Fixed critical production bugs and improved application stability

EDUCATION
B.S. in Computer Science | University of Technology | 2018
GPA: 3.8/4.0

TECHNICAL SKILLS
Languages: JavaScript, Python, SQL, HTML/CSS
Frontend: React, Vue.js, Tailwind CSS, Framer Motion
Backend: Node.js, Express, FastAPI, Django
Databases: PostgreSQL, MongoDB, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins, GitHub Actions
Tools & Platforms: Git, REST APIs, GraphQL, Postman

CERTIFICATIONS
- AWS Certified Solutions Architect - Associate (2021)
- Google Cloud Professional Data Engineer (2022)
    `
    
    const demoJob = {
      title: 'Senior React Developer',
      company: 'TechCorp',
      description: `We're looking for a Senior React Developer to join our growing engineering team.

Requirements:
- 5+ years of experience with React and modern JavaScript
- Strong understanding of state management (Redux, Context API)
- Experience with TypeScript and testing frameworks
- Familiarity with responsive design and CSS-in-JS solutions
- Experience with GraphQL APIs
- Knowledge of performance optimization techniques
- Strong problem-solving and communication skills

Responsibilities:
- Design and develop scalable React components
- Collaborate with backend engineers and designers
- Participate in code reviews and technical discussions
- Mentor junior developers
- Contribute to architectural decisions
- Optimize application performance
      `
    }

    setResume(demoResume)
    setJobTarget(demoJob)
    showNotification('Demo data loaded successfully!', 'success')
  }

  const value = {
    resume,
    setResume,
    resumeId,
    setResumeId,
    jobTarget,
    setJobTarget,
    jobTargetId,
    setJobTargetId,
    loading,
    setLoading,
    notification,
    showNotification,
    loadDemoData
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
