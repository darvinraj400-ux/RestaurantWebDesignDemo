import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Menu as MenuIcon, X, Clock, MapPin, Phone, Mail, ChevronDown,
  Instagram, ArrowRight, Check,
  Calendar, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

// ─── Image URLs ─────────────────────────────────────────────────────────────
const IMAGES = {
  hero: 'https://image.qwenlm.ai/generated-images/582e5d35-c946-4ad6-b897-85aa0ef1dc23/_result.png',
  interior: 'https://image.qwenlm.ai/generated-images/e14115ff-9e29-43cb-b1af-d510d5a7b945/_result.png',
  chef: 'https://image.qwenlm.ai/generated-images/e73ca25c-fd6e-48de-a15e-99c66d091162/_result.png',
  table: 'https://image.qwenlm.ai/generated-images/14df54b2-5e11-4f99-8564-abc738bc7453/_result.png',
};

// ─── Menu Data ──────────────────────────────────────────────────────────────
const MENU_CATEGORIES = [
  {
    id: 'starters',
    name: 'To Begin',
    items: [
      { name: 'Whipped Feta & Roasted Fig', desc: 'Honey, toasted walnuts, warm flatbread', price: 16, dietary: ['v'] },
      { name: 'Charred Octopus', desc: 'Smoked paprika, fingerling potatoes, lemon-caper vinaigrette', price: 22, dietary: ['gf'] },
      { name: 'Burrata & Heirloom Tomato', desc: 'Aged balsamic, basil oil, fleur de sel', price: 19, dietary: ['v', 'gf'] },
      { name: 'Lamb Kofta', desc: 'Harissa yogurt, pickled onion, za\'atar', price: 18, dietary: [] },
      { name: 'Seasonal Soup', desc: 'Ask your server — changes with the harvest', price: 14, dietary: ['v', 'gf'] },
    ]
  },
  {
    id: 'mains',
    name: 'Mains',
    items: [
      { name: 'Pan-Seared Branzino', desc: 'Saffron risotto, broccolini, preserved lemon beurre blanc', price: 38, dietary: ['gf'] },
      { name: 'Slow-Braised Lamb Shoulder', desc: 'Pomegranate molasses, herb couscous, charred eggplant', price: 42, dietary: [] },
      { name: 'Wild Mushroom Pappardelle', desc: 'Truffle cream, pecorino, crispy sage', price: 28, dietary: ['v'] },
      { name: 'Grilled Heritage Chicken', desc: 'Romesco, roasted peppers, crispy potatoes', price: 34, dietary: ['gf'] },
      { name: 'Market Vegetable Tagine', desc: 'Chermoula, saffron rice, preserved lemon, almonds', price: 26, dietary: ['v', 'gf'] },
    ]
  },
  {
    id: 'desserts',
    name: 'To Finish',
    items: [
      { name: 'Olive Oil Cake', desc: 'Meyer lemon curd, crème fraîche, candied citrus', price: 14, dietary: ['v'] },
      { name: 'Dark Chocolate Fondant', desc: 'Tahini ice cream, sea salt, hazelnut praline', price: 16, dietary: ['v'] },
      { name: 'Seasonal Fruit Galette', desc: 'Vanilla bean mascarpone, honey drizzle', price: 13, dietary: ['v'] },
      { name: 'Cheese Selection', desc: 'Three artisan cheeses, quince paste, honeycomb, crackers', price: 22, dietary: ['v'] },
    ]
  },
  {
    id: 'drinks',
    name: 'From the Bar',
    items: [
      { name: 'The Ember Old Fashioned', desc: 'Smoked bourbon, fig syrup, orange bitters', price: 17, dietary: [] },
      { name: 'Olive Grove Martini', desc: 'Gin, dry vermouth, olive brine, lemon twist', price: 16, dietary: [] },
      { name: 'Mediterranean Spritz', desc: 'Aperol, prosecco, blood orange, rosemary', price: 15, dietary: [] },
      { name: 'House Wine — Glass', desc: 'Rotating selection from Mediterranean vineyards', price: 14, dietary: [] },
      { name: 'Non-Alcoholic Shrub', desc: 'Seasonal fruit, apple cider vinegar, sparkling water', price: 9, dietary: ['v'] },
    ]
  }
];

const DIETARY_LABELS: Record<string, { label: string; color: string }> = {
  v: { label: 'Vegetarian', color: 'bg-olive-100 text-olive-800' },
  gf: { label: 'Gluten Free', color: 'bg-terracotta-100 text-terracotta-700' },
  vg: { label: 'Vegan', color: 'bg-olive-200 text-olive-900' },
};

// ─── Gallery Data ───────────────────────────────────────────────────────────
const GALLERY_IMAGES = [
  { src: IMAGES.interior, alt: 'Restaurant interior with warm candlelight', caption: 'Our dining room' },
  { src: IMAGES.hero, alt: 'Beautifully plated Mediterranean dish', caption: 'Seasonal plates' },
  { src: IMAGES.chef, alt: 'Chef preparing fresh ingredients', caption: 'From our kitchen' },
  { src: IMAGES.table, alt: 'Mediterranean table setting', caption: 'Shared moments' },
];

// ─── Animation Variants ─────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

// ─── Section Wrapper ────────────────────────────────────────────────────────
function Section({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={stagger}
    >
      {children}
    </motion.section>
  );
}

// ─── Navigation ─────────────────────────────────────────────────────────────
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navLinks = [
    { href: '#menu', label: 'Menu' },
    { href: '#story', label: 'Our Story' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#visit', label: 'Visit' },
    { href: '#reserve', label: 'Reserve' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-cream-100/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="font-serif text-xl sm:text-2xl font-semibold text-olive-900 tracking-tight"
              aria-label="Ember & Olive - Home"
            >
              Ember <span className="text-terracotta-500">&</span> Olive
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-charcoal-600 hover:text-olive-800 transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-terracotta-500 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 -mr-2 text-charcoal-700 hover:text-olive-800 transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <MenuIcon size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-cream-100 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center gap-6" role="navigation" aria-label="Mobile navigation">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="font-serif text-3xl text-charcoal-800 hover:text-olive-800 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center gap-2 text-sm text-charcoal-400"
              >
                <Clock size={14} />
                <span>Open Tue–Sun, 5pm–10pm</span>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero Section ───────────────────────────────────────────────────────────
function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Welcome to Ember & Olive">
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGES.hero})` }}
          role="img"
          aria-label="Beautifully plated Mediterranean dish"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/70 via-charcoal-900/50 to-charcoal-900/80" />
      </motion.div>

      {/* Content */}
      <motion.div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto" style={{ opacity }}>
        <motion.p
          className="text-cream-300 text-sm sm:text-base tracking-[0.3em] uppercase mb-4 sm:mb-6 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Seasonal Mediterranean
        </motion.p>
        <motion.h1
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-cream-50 leading-[0.95] mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Ember <span className="text-terracotta-400">&</span> Olive
        </motion.h1>
        <motion.p
          className="text-cream-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          A neighborhood table where fire meets garden. Seasonal ingredients, 
          Mediterranean soul, shared with warmth.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <a
            href="#reserve"
            onClick={(e) => { e.preventDefault(); document.querySelector('#reserve')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta-500 text-cream-50 font-medium rounded-sm hover:bg-terracotta-600 transition-all duration-300 min-h-[48px] text-base shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Reserve a Table
            <ArrowRight size={18} />
          </a>
          <div className="flex items-center gap-2 text-cream-300 text-sm">
            <Clock size={16} />
            <span>Tue–Sun · 5pm–10pm</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-cream-400"
          aria-hidden="true"
        >
          <ChevronDown size={28} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Menu Section ───────────────────────────────────────────────────────────
function MenuSection() {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0].id);
  const tabListRef = useRef<HTMLDivElement>(null);
  const activeCategoryData = MENU_CATEGORIES.find(c => c.id === activeCategory)!;

  const handleTabChange = (id: string) => {
    setActiveCategory(id);
    // Scroll tab into view on mobile
    if (tabListRef.current) {
      const activeTab = tabListRef.current.querySelector(`[data-tab="${id}"]`);
      activeTab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <Section id="menu" className="py-16 sm:py-24 lg:py-32 bg-cream-50 texture-overlay">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div className="text-center mb-10 sm:mb-16" variants={fadeUp}>
          <p className="text-terracotta-500 text-sm tracking-[0.2em] uppercase mb-3 font-medium">The Menu</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal-800 mb-4">
            Seasonal Offerings
          </h2>
          <p className="text-charcoal-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Our menu evolves with the seasons. Each dish reflects what's freshest 
            from local farms and Mediterranean traditions.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div variants={fadeUp}>
          <div
            ref={tabListRef}
            className="flex overflow-x-auto gap-1 sm:gap-2 pb-2 mb-8 sm:mb-12 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center scrollbar-hide"
            role="tablist"
            aria-label="Menu categories"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {MENU_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                data-tab={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                aria-controls={`panel-${cat.id}`}
                onClick={() => handleTabChange(cat.id)}
                className={`whitespace-nowrap px-5 sm:px-6 py-3 rounded-sm text-sm font-medium transition-all duration-300 min-h-[44px] flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-olive-900 text-cream-50 shadow-md'
                    : 'bg-cream-200 text-charcoal-600 hover:bg-cream-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Menu items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            id={`panel-${activeCategory}`}
            role="tabpanel"
            aria-labelledby={activeCategory}
            className="grid gap-0"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {activeCategoryData.items.map((item, i) => (
              <motion.div
                key={item.name}
                className="group py-5 sm:py-6 border-b border-cream-300 last:border-b-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-lg sm:text-xl text-charcoal-800 group-hover:text-olive-800 transition-colors">
                        {item.name}
                      </h3>
                      {item.dietary.map(d => (
                        <span
                          key={d}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${DIETARY_LABELS[d]?.color || ''}`}
                          title={DIETARY_LABELS[d]?.label}
                          aria-label={DIETARY_LABELS[d]?.label}
                        >
                          {d === 'v' && '🌿 '}{d === 'gf' && '◌ '}{DIETARY_LABELS[d]?.label}
                        </span>
                      ))}
                    </div>
                    <p className="text-charcoal-400 text-sm mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <span className="font-serif text-lg sm:text-xl text-terracotta-600 font-medium sm:ml-8 flex-shrink-0">
                    ${item.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Dietary legend */}
        <motion.div className="mt-10 sm:mt-12 pt-6 border-t border-cream-300 flex flex-wrap gap-4 sm:gap-6 justify-center" variants={fadeUp}>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal-500">
            <span className="inline-block w-2 h-2 rounded-full bg-olive-600" />
            <span>Vegetarian</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal-500">
            <span className="inline-block w-2 h-2 rounded-full bg-terracotta-500" />
            <span>Gluten Free</span>
          </div>
          <p className="w-full text-center text-xs text-charcoal-400 mt-2">
            Please inform your server of any allergies. We are happy to accommodate dietary needs.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Chef's Story Section ───────────────────────────────────────────────────
function StorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const seasons = [
    { season: 'Spring', items: 'Asparagus, peas, artichokes, spring lamb, wild garlic' },
    { season: 'Summer', items: 'Tomatoes, stone fruit, basil, eggplant, fresh fish' },
    { season: 'Autumn', items: 'Figs, pomegranate, mushrooms, squash, game' },
    { season: 'Winter', items: 'Citrus, root vegetables, brassicas, preserved goods' },
  ];

  return (
    <Section id="story" className="py-16 sm:py-24 lg:py-32 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <motion.div className="relative order-2 lg:order-1" ref={ref} variants={scaleIn}>
            <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-sm overflow-hidden shadow-2xl">
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${IMAGES.chef})`, y: imgY }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/30 to-transparent" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 border-2 border-terracotta-300 rounded-sm -z-10" aria-hidden="true" />
          </motion.div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <motion.div variants={fadeUp}>
              <p className="text-terracotta-500 text-sm tracking-[0.2em] uppercase mb-3 font-medium">Our Story</p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal-800 mb-6 leading-tight">
                Where Fire Meets Garden
              </h2>
            </motion.div>

            <motion.div className="space-y-4 text-charcoal-500 leading-relaxed" variants={fadeUp}>
              <p>
                Chef Elena Vasquez spent a decade cooking along the Mediterranean coast — 
                from the whitewashed kitchens of Crete to the bustling markets of Istanbul. 
                When she returned home, she carried with her a simple philosophy: 
                <em className="text-olive-800 not-italic font-medium"> let the ingredient speak</em>.
              </p>
              <p>
                At Ember & Olive, every dish begins in the soil. We work with local farms 
                within 50 miles, foraging wild herbs from nearby hillsides, and curing our 
                own olives from a century-old grove just outside town.
              </p>
              <p>
                The open hearth is our heart — wood-fired, always alive. It gives our food 
                its signature warmth: the gentle char of vegetables, the smoke-kissed edge 
                of proteins, the ember-roasted depth in our sauces.
              </p>
            </motion.div>

            {/* Seasonal ingredients */}
            <motion.div className="mt-8 sm:mt-10" variants={fadeUp}>
              <h3 className="font-serif text-xl text-charcoal-700 mb-4">Seasonal Rhythm</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {seasons.map((s, i) => (
                  <motion.div
                    key={s.season}
                    className="p-3 sm:p-4 bg-cream-200 rounded-sm border border-cream-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  >
                    <p className="font-serif text-sm sm:text-base text-olive-800 font-medium mb-1">{s.season}</p>
                    <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed">{s.items}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Gallery Section ────────────────────────────────────────────────────────
function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) >= minSwipeDistance;
    if (isSwipe) {
      if (distance > 0) {
        // Swiped left - next
        setActiveIndex(prev => (prev + 1) % GALLERY_IMAGES.length);
      } else {
        // Swiped right - prev
        setActiveIndex(prev => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
      }
    }
  };

  const goNext = () => setActiveIndex(prev => (prev + 1) % GALLERY_IMAGES.length);
  const goPrev = () => setActiveIndex(prev => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);

  return (
    <Section id="gallery" className="py-16 sm:py-24 lg:py-32 bg-charcoal-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-10 sm:mb-16" variants={fadeUp}>
          <p className="text-terracotta-400 text-sm tracking-[0.2em] uppercase mb-3 font-medium">Atmosphere</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream-50">
            A Sense of Place
          </h2>
        </motion.div>

        {/* Main gallery */}
        <motion.div
          className="relative"
          variants={scaleIn}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-sm overflow-hidden bg-charcoal-800">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <img
                  src={GALLERY_IMAGES[activeIndex].src}
                  alt={GALLERY_IMAGES[activeIndex].alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Caption */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeIndex}
                  className="font-serif text-lg sm:text-xl text-cream-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {GALLERY_IMAGES[activeIndex].caption}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={goPrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-charcoal-900/50 backdrop-blur-sm text-cream-100 rounded-full hover:bg-charcoal-900/70 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-charcoal-900/50 backdrop-blur-sm text-cream-100 rounded-full hover:bg-charcoal-900/70 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 sm:gap-3 mt-4 justify-center">
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-sm overflow-hidden transition-all duration-300 min-w-[44px] min-h-[44px] ${
                  i === activeIndex ? 'ring-2 ring-terracotta-400 opacity-100' : 'opacity-50 hover:opacity-75'
                }`}
                aria-label={`View ${img.caption}`}
                aria-current={i === activeIndex}
              >
                <img src={img.src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Visit Section ──────────────────────────────────────────────────────────
function VisitSection() {
  return (
    <Section id="visit" className="py-16 sm:py-24 lg:py-32 bg-cream-50 texture-overlay">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-10 sm:mb-16" variants={fadeUp}>
          <p className="text-terracotta-500 text-sm tracking-[0.2em] uppercase mb-3 font-medium">Find Us</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal-800">
            Visit Ember & Olive
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {/* Location */}
          <motion.div className="bg-cream-100 p-6 sm:p-8 rounded-sm border border-cream-300" variants={fadeUp}>
            <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center mb-4">
              <MapPin size={20} className="text-olive-700" />
            </div>
            <h3 className="font-serif text-xl text-charcoal-800 mb-3">Location</h3>
            <address className="not-italic text-charcoal-500 text-sm leading-relaxed space-y-1">
              <p>247 Elm Street</p>
              <p>Brooklyn, NY 11201</p>
              <p className="pt-2">
                <a href="#" className="text-terracotta-600 hover:text-terracotta-700 underline underline-offset-2 transition-colors">
                  Get Directions →
                </a>
              </p>
            </address>
            <p className="mt-4 text-xs text-charcoal-400">
              Corner of Elm & Maple. Street parking available. 
              nearest subway: F/G to Bergen St.
            </p>
          </motion.div>

          {/* Hours */}
          <motion.div className="bg-cream-100 p-6 sm:p-8 rounded-sm border border-cream-300" variants={fadeUp}>
            <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center mb-4">
              <Clock size={20} className="text-olive-700" />
            </div>
            <h3 className="font-serif text-xl text-charcoal-800 mb-3">Hours</h3>
            <div className="text-sm text-charcoal-500 space-y-2">
              <div className="flex justify-between">
                <span>Tuesday – Thursday</span>
                <span className="text-charcoal-700 font-medium">5pm – 10pm</span>
              </div>
              <div className="flex justify-between">
                <span>Friday – Saturday</span>
                <span className="text-charcoal-700 font-medium">5pm – 11pm</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="text-charcoal-700 font-medium">5pm – 9pm</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-cream-300">
                <span>Monday</span>
                <span className="text-charcoal-400 italic">Closed</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-charcoal-400">
              Kitchen closes 30 min before closing. Bar stays open later on weekends.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div className="bg-cream-100 p-6 sm:p-8 rounded-sm border border-cream-300" variants={fadeUp}>
            <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center mb-4">
              <Phone size={20} className="text-olive-700" />
            </div>
            <h3 className="font-serif text-xl text-charcoal-800 mb-3">Contact</h3>
            <div className="text-sm text-charcoal-500 space-y-3">
              <a href="tel:+17185551234" className="flex items-center gap-2 hover:text-olive-700 transition-colors">
                <Phone size={14} />
                <span>(718) 555-1234</span>
              </a>
              <a href="mailto:hello@emberandolive.com" className="flex items-center gap-2 hover:text-olive-700 transition-colors">
                <Mail size={14} />
                <span>hello@emberandolive.com</span>
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-olive-700 transition-colors">
                <Instagram size={14} />
                <span>@emberandolive</span>
              </a>
            </div>
            <p className="mt-4 text-xs text-charcoal-400">
              For parties of 8+, please call directly. 
              Private dining available for events.
            </p>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

// ─── Reservation Section ────────────────────────────────────────────────────
interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

function ReservationSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', date: '', time: '', guests: '2', notes: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationData, setConfirmationData] = useState<FormData | null>(null);

  const timeSlots = [
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM',
    '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.time) newErrors.time = 'Please select a time';
    if (!formData.guests) newErrors.guests = 'Please select number of guests';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setConfirmationData({ ...formData });
    setIsConfirmed(true);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setConfirmationData(null);
    setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: '2', notes: '' });
    setErrors({});
  };

  return (
    <Section id="reserve" className="py-16 sm:py-24 lg:py-32 bg-olive-950 relative overflow-hidden grain-texture">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center mb-10 sm:mb-14" variants={fadeUp}>
          <p className="text-terracotta-400 text-sm tracking-[0.2em] uppercase mb-3 font-medium">Reservations</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream-50 mb-4">
            Join Us at the Table
          </h2>
          <p className="text-cream-300/70 max-w-lg mx-auto text-sm sm:text-base">
            Reserve your evening with us. We recommend booking a few days in advance, 
            especially for weekends.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isConfirmed ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="bg-cream-50/5 backdrop-blur-sm rounded-sm border border-cream-200/10 p-6 sm:p-8 lg:p-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              noValidate
            >
              {/* Demo notice */}
              <div className="mb-6 p-3 bg-terracotta-900/30 border border-terracotta-700/30 rounded-sm flex items-start gap-2">
                <AlertCircle size={16} className="text-terracotta-400 flex-shrink-0 mt-0.5" />
                <p className="text-terracotta-300 text-xs sm:text-sm">
                  This is a demo reservation form. No actual booking will be made.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="res-name" className="block text-sm font-medium text-cream-200 mb-1.5">
                    Full Name <span className="text-terracotta-400">*</span>
                  </label>
                  <input
                    id="res-name"
                    type="text"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-cream-100/10 border rounded-sm text-cream-50 placeholder-cream-400/50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all min-h-[44px] ${
                      errors.name ? 'border-red-400' : 'border-cream-200/20'
                    }`}
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && <p id="name-error" className="mt-1 text-xs text-red-400" role="alert">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="res-email" className="block text-sm font-medium text-cream-200 mb-1.5">
                    Email <span className="text-terracotta-400">*</span>
                  </label>
                  <input
                    id="res-email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-cream-100/10 border rounded-sm text-cream-50 placeholder-cream-400/50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all min-h-[44px] ${
                      errors.email ? 'border-red-400' : 'border-cream-200/20'
                    }`}
                    placeholder="your@email.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && <p id="email-error" className="mt-1 text-xs text-red-400" role="alert">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="res-phone" className="block text-sm font-medium text-cream-200 mb-1.5">
                    Phone <span className="text-terracotta-400">*</span>
                  </label>
                  <input
                    id="res-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 bg-cream-100/10 border rounded-sm text-cream-50 placeholder-cream-400/50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all min-h-[44px] ${
                      errors.phone ? 'border-red-400' : 'border-cream-200/20'
                    }`}
                    placeholder="(555) 123-4567"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && <p id="phone-error" className="mt-1 text-xs text-red-400" role="alert">{errors.phone}</p>}
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="res-date" className="block text-sm font-medium text-cream-200 mb-1.5">
                    Date <span className="text-terracotta-400">*</span>
                  </label>
                  <input
                    id="res-date"
                    type="date"
                    min={today}
                    value={formData.date}
                    onChange={e => handleChange('date', e.target.value)}
                    className={`w-full px-4 py-3 bg-cream-100/10 border rounded-sm text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all min-h-[44px] ${
                      errors.date ? 'border-red-400' : 'border-cream-200/20'
                    }`}
                    aria-invalid={!!errors.date}
                    aria-describedby={errors.date ? 'date-error' : undefined}
                  />
                  {errors.date && <p id="date-error" className="mt-1 text-xs text-red-400" role="alert">{errors.date}</p>}
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="res-time" className="block text-sm font-medium text-cream-200 mb-1.5">
                    Time <span className="text-terracotta-400">*</span>
                  </label>
                  <select
                    id="res-time"
                    value={formData.time}
                    onChange={e => handleChange('time', e.target.value)}
                    className={`w-full px-4 py-3 bg-cream-100/10 border rounded-sm text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all min-h-[44px] ${
                      errors.time ? 'border-red-400' : 'border-cream-200/20'
                    }`}
                    aria-invalid={!!errors.time}
                    aria-describedby={errors.time ? 'time-error' : undefined}
                  >
                    <option value="" className="bg-charcoal-800">Select time</option>
                    {timeSlots.map(t => (
                      <option key={t} value={t} className="bg-charcoal-800">{t}</option>
                    ))}
                  </select>
                  {errors.time && <p id="time-error" className="mt-1 text-xs text-red-400" role="alert">{errors.time}</p>}
                </div>

                {/* Guests */}
                <div className="sm:col-span-2">
                  <label htmlFor="res-guests" className="block text-sm font-medium text-cream-200 mb-1.5">
                    Number of Guests <span className="text-terracotta-400">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange('guests', String(Math.max(1, parseInt(formData.guests) - 1)))}
                      className="w-11 h-11 flex items-center justify-center bg-cream-100/10 border border-cream-200/20 rounded-sm text-cream-200 hover:bg-cream-100/20 transition-all"
                      aria-label="Decrease guests"
                    >
                      −
                    </button>
                    <select
                      id="res-guests"
                      value={formData.guests}
                      onChange={e => handleChange('guests', e.target.value)}
                      className="flex-1 px-4 py-3 bg-cream-100/10 border border-cream-200/20 rounded-sm text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all min-h-[44px]"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n} className="bg-charcoal-800">
                          {n} {n === 1 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleChange('guests', String(Math.min(12, parseInt(formData.guests) + 1)))}
                      className="w-11 h-11 flex items-center justify-center bg-cream-100/10 border border-cream-200/20 rounded-sm text-cream-200 hover:bg-cream-100/20 transition-all"
                      aria-label="Increase guests"
                    >
                      +
                    </button>
                  </div>
                  {errors.guests && <p className="mt-1 text-xs text-red-400" role="alert">{errors.guests}</p>}
                </div>

                {/* Notes */}
                <div className="sm:col-span-2">
                  <label htmlFor="res-notes" className="block text-sm font-medium text-cream-200 mb-1.5">
                    Special Requests <span className="text-cream-400/50">(optional)</span>
                  </label>
                  <textarea
                    id="res-notes"
                    value={formData.notes}
                    onChange={e => handleChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-cream-100/10 border border-cream-200/20 rounded-sm text-cream-50 placeholder-cream-400/50 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all resize-none"
                    placeholder="Dietary needs, celebrations, seating preferences..."
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-4 bg-terracotta-500 text-cream-50 font-medium rounded-sm hover:bg-terracotta-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-h-[48px] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-cream-200 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      />
                      <span>Reserving...</span>
                    </>
                  ) : (
                    <>
                      <Calendar size={18} />
                      <span>Confirm Reservation</span>
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="confirmation"
              className="bg-cream-50/5 backdrop-blur-sm rounded-sm border border-cream-200/10 p-6 sm:p-8 lg:p-10 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-olive-800/50 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Check size={32} className="text-olive-300" />
              </motion.div>

              <h3 className="font-serif text-2xl sm:text-3xl text-cream-50 mb-3">
                Reservation Confirmed
              </h3>
              <p className="text-cream-300/70 mb-6 text-sm sm:text-base">
                This is a demo confirmation — no actual reservation has been made.
              </p>

              <div className="bg-cream-100/5 rounded-sm p-4 sm:p-6 mb-8 text-left max-w-sm mx-auto">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cream-400">Name</span>
                    <span className="text-cream-100">{confirmationData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream-400">Date</span>
                    <span className="text-cream-100">{confirmationData?.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream-400">Time</span>
                    <span className="text-cream-100">{confirmationData?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream-400">Guests</span>
                    <span className="text-cream-100">{confirmationData?.guests}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-8 py-3 border border-cream-200/30 text-cream-200 rounded-sm hover:bg-cream-100/10 transition-all min-h-[44px]"
              >
                Make Another Reservation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-charcoal-900 border-t border-charcoal-700 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="font-serif text-xl text-cream-100 mb-3">
              Ember <span className="text-terracotta-400">&</span> Olive
            </h4>
            <p className="text-cream-400/60 text-sm leading-relaxed">
              Seasonal Mediterranean cuisine, 
              prepared with fire and heart.
            </p>
          </div>
          <div>
            <h5 className="text-cream-200 font-medium text-sm mb-3 uppercase tracking-wider">Hours</h5>
            <p className="text-cream-400/60 text-sm">Tue–Thu: 5pm–10pm</p>
            <p className="text-cream-400/60 text-sm">Fri–Sat: 5pm–11pm</p>
            <p className="text-cream-400/60 text-sm">Sun: 5pm–9pm</p>
            <p className="text-cream-400/60 text-sm">Mon: Closed</p>
          </div>
          <div>
            <h5 className="text-cream-200 font-medium text-sm mb-3 uppercase tracking-wider">Contact</h5>
            <p className="text-cream-400/60 text-sm">(718) 555-1234</p>
            <p className="text-cream-400/60 text-sm">hello@emberandolive.com</p>
            <p className="text-cream-400/60 text-sm">247 Elm Street, Brooklyn</p>
          </div>
          <div>
            <h5 className="text-cream-200 font-medium text-sm mb-3 uppercase tracking-wider">Follow</h5>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-charcoal-700 flex items-center justify-center text-cream-300 hover:bg-olive-800 transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-charcoal-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream-400/40 text-xs">© 2024 Ember & Olive. All rights reserved.</p>
          <p className="text-cream-400/40 text-xs">This is a demo website. No actual restaurant.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-cream-100">
      <Navigation />
      <main>
        <HeroSection />
        <MenuSection />
        <StorySection />
        <GallerySection />
        <VisitSection />
        <ReservationSection />
      </main>
      <Footer />
    </div>
  );
}
