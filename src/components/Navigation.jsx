import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  CheckSquare, 
  Users, 
  Calendar, 
  Layers,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils.js';
import { Button } from './ui/Button.jsx';

const Navigation = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: Home,
      description: 'Panel principal y estadísticas'
    },
    {
      title: 'Proyectos',
      href: '/projects',
      icon: Building2,
      description: 'Gestión de proyectos'
    },
    {
      title: 'Tareas',
      href: '/tasks',
      icon: CheckSquare,
      description: 'Administrar tareas'
    },
    {
      title: 'Personal',
      href: '/staff',
      icon: Users,
      description: 'Equipo de trabajo'
    },
    {
      title: 'Etapas',
      href: '/stages',
      icon: Calendar,
      description: 'Fases del proyecto'
    },
    {
      title: 'Entregables',
      href: '/entregables',
      icon: Layers,
      description: 'Plantillas de entregables'
    }
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="bg-background/95 backdrop-blur"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%'
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-72 bg-background border-r',
          'lg:relative lg:translate-x-0 lg:z-auto'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Arq.tvs</h2>
                <p className="text-sm text-muted-foreground">Gestión Arquitectónica</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => {
                    // Close mobile menu on navigation
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group',
                    active 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-secondary text-foreground'
                  )}
                >
                  <Icon className={cn(
                    'h-5 w-5 transition-colors',
                    active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      'font-medium text-sm',
                      active ? 'text-primary-foreground' : 'text-foreground'
                    )}>
                      {item.title}
                    </div>
                    <div className={cn(
                      'text-xs truncate',
                      active 
                        ? 'text-primary-foreground/80' 
                        : 'text-muted-foreground group-hover:text-foreground/80'
                    )}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              Versión 2.0 • Sistema CRUD completo
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Navigation;
