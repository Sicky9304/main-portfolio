import { motion } from 'framer-motion';
import { Code2, Palette, Server, LayoutDashboard, Brain, Zap } from 'lucide-react';
import { RevealOnScroll, SectionHeading } from '../../components/ui/Animations';
import { useApi } from '../../hooks/useApi';
import { fetchServices } from '../../api/index.js';

// Map icon string names from the database to actual Lucide components
const ICON_MAP = {
  Code2,
  Palette,
  Server,
  LayoutDashboard,
  Brain,
  Zap,
};

// Fallback data
const FALLBACK_SERVICES = [
  {
    icon: 'Code2',
    title: 'MERN Stack Development',
    description: 'End-to-end web applications using MongoDB, Express.js, React, and Node.js with modern best practices.',
    gradient: 'from-primary to-secondary',
  },
  {
    icon: 'Palette',
    title: 'Frontend Development',
    description: 'Responsive, performant, and accessible user interfaces with React, Tailwind CSS, and Framer Motion.',
    gradient: 'from-pink to-secondary',
  },
  {
    icon: 'Server',
    title: 'Backend APIs',
    description: 'RESTful APIs with Node.js and Express, authentication systems, and database architecture design.',
    gradient: 'from-accent to-primary',
  },
  {
    icon: 'LayoutDashboard',
    title: 'Dashboard & Admin Panels',
    description: 'Data-driven dashboards with real-time analytics, charts, and user management interfaces.',
    gradient: 'from-emerald-500 to-accent',
  },
  {
    icon: 'Brain',
    title: 'AI Integration',
    description: 'Integrating AI-powered features into web applications for smarter user experiences.',
    gradient: 'from-secondary to-pink',
  },
  {
    icon: 'Zap',
    title: 'Performance Optimization',
    description: 'Code splitting, lazy loading, caching strategies, and SEO optimization for production apps.',
    gradient: 'from-amber-500 to-pink',
  },
];

export const Services = () => {
  const { data: servicesData } = useApi(fetchServices, FALLBACK_SERVICES);
  const services = Array.isArray(servicesData) && servicesData.length > 0 ? servicesData : FALLBACK_SERVICES;

  return (
    <section id="services" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Services"
          title="What I Can Do"
          description="Specialized in building modern web applications from concept to deployment."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => {
            const Icon = ICON_MAP[service.icon] || Zap;
            return (
              <RevealOnScroll key={service.title} delay={index * 0.08}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-[28px] p-8 h-full group cursor-default relative overflow-hidden"
                >
                  {/* Hover Gradient Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.06] transition-opacity duration-500`} />

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <Icon size={24} className="text-white" />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-primary-light transition-colors"
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                  >
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Bottom Gradient Line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </motion.div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};
