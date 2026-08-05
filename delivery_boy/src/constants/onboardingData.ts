export const CATEGORIES = [
  { id: '1', title: 'Hospitality', icon: '🏨' },
  { id: '2', title: 'Events', icon: '👥' },
  { id: '3', title: 'Wedding', icon: '💍' },
  { id: '4', title: 'Food Court', icon: '📍' },
];

export const ONBOARDING_STEPS = [
  {
    id: 1,
    type: 'standard',
    image: require('../assets/delivery_boy_scooter.png'),
    greeting: 'Hey!',
    emoji: '😀',
    title: 'Welcome Onboard.',
    description:
      "Lets start quickly, Its very easy to start and process. We'll be all there to help you & guide you to start journey with us as a Delivery Boy.",
    buttonText: 'Next',
  },
  {
    id: 2,
    type: 'categories',
    image: require('../assets/career_hospitality.png'),
    title: 'Yes! Your Career is in Good Hands dealing in',
    categories: CATEGORIES,
    buttonText: 'Next',
  },
  {
    id: 3,
    type: 'standard',
    image: require('../assets/delivery_handover.png'),
    greeting: "Let's",
    title: 'Start Now',
    description:
      "Lets start quickly, Its very easy to start and process. We'll be all there to help you & guide you to start journey with us as a Delivery Boy.",
    buttonText: 'Login',
  },
];
