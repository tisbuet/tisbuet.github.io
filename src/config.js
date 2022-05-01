module.exports = {
  siteTitle: 'Md. Tariqul Islam | Machine Learning Engineer | Researcher',
  siteDescription:
    'Md. Tariqul Islam is a full-time Machine Learning Engineer at Hishab Ltd. who earned his bachelor\'s degree from Bangladesh University of Engineering and Technology. He is now a part-time Master\'s student at the same university doing research on speech processing. He has a wonderful academic career, having published 5 research papers so far in a short period of time, including a journal paper which was published by EURASIP. He competed in several national and international contests and was recognized for his efforts. After visiting ICIP 2019, Taiwan, as a finalist in the international competition VIP CUP 2019, the desire to build a career in research in the field of Signal processing and Machine Learning has increased.',
  siteKeywords:
    'Md. Tariqul Islam, Tariqul, Islam, tisbuet, hishab, Machine Learning Engineer, Researcher',
  siteUrl: 'https://tisbuet.github.io/',
  siteLanguage: 'en_US',
  googleAnalyticsID: 'UA-45666519-2',
  googleVerification: 'DCl7VAf9tcz6eD9gb67NfkNnJ1PKRNcg8qQiwpbx9Lk',
  name: 'Md. Tariqul Islam',
  location: 'Chattogram, Bangladesh',
  email: 'tisbuet@gmail.com',
  github: 'https://github.com/tisbuet',
  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/tisbuet',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/tisbuet/',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Awards',
      url: '/#awards',
    },
    {
      name: 'Publications',
      url: '/#publications',
    },
    {
      name: 'Projects',
      url: '/#projects',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  navHeight: 80,

  colors: {
    green: '#64ffda',
    navy: '#0a192f',
    darkNavy: '#020c1b',
  },

  srConfig: (delay = 150) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor: 0.25,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
