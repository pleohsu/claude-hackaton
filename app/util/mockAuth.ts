/**
 * Mock authentication system for demo/testing without Supabase
 * Stores users in memory for quick testing
 */

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  userType: 'restaurant' | 'lab';
  profile?: any;
}

// In-memory user storage
const mockUsers: User[] = [
  // Restaurants
  {
    id: 'rest-1',
    email: 'manager@legalseafoods.com',
    password: 'password123',
    name: 'Legal Sea Foods',
    userType: 'restaurant',
    profile: {
      id: 'prof-rest-1',
      restaurant_name: 'Legal Sea Foods - Seaport',
      address: '270 Northern Ave, Boston, MA 02210',
    },
  },
  {
    id: 'rest-2',
    email: 'chef@neptuneoyster.com',
    password: 'password123',
    name: 'Neptune Oyster',
    userType: 'restaurant',
    profile: {
      id: 'prof-rest-2',
      restaurant_name: 'Neptune Oyster',
      address: '63 Salem St, Boston, MA 02113',
    },
  },
  {
    id: 'rest-3',
    email: 'operations@islandcreek.com',
    password: 'password123',
    name: 'Island Creek Oyster Bar',
    userType: 'restaurant',
    profile: {
      id: 'prof-rest-3',
      restaurant_name: 'Island Creek Oyster Bar',
      address: '500 Commonwealth Ave, Boston, MA 02215',
    },
  },
  {
    id: 'rest-4',
    email: 'manager@barkingcrab.com',
    password: 'password123',
    name: 'The Barking Crab',
    userType: 'restaurant',
    profile: {
      id: 'prof-rest-4',
      restaurant_name: 'The Barking Crab',
      address: '88 Sleeper St, Boston, MA 02210',
    },
  },
  // Labs
  {
    id: 'lab-1',
    email: 's.chen@mit.edu',
    password: 'password123',
    name: 'Dr. Sarah Chen',
    userType: 'lab',
    profile: {
      id: 'prof-lab-1',
      institution_name: 'Massachusetts Institute of Technology',
      lab_name: 'Biomaterials Research Lab',
      address: '77 Massachusetts Ave, Cambridge, MA 02139',
    },
  },
  {
    id: 'lab-2',
    email: 'm.rodriguez@harvard.edu',
    password: 'password123',
    name: 'Dr. Michael Rodriguez',
    userType: 'lab',
    profile: {
      id: 'prof-lab-2',
      institution_name: 'Harvard University',
      lab_name: 'Sustainable Polymers Lab',
      address: '29 Oxford St, Cambridge, MA 02138',
    },
  },
  {
    id: 'lab-3',
    email: 'e.patel@northeastern.edu',
    password: 'password123',
    name: 'Dr. Emily Patel',
    userType: 'lab',
    profile: {
      id: 'prof-lab-3',
      institution_name: 'Northeastern University',
      lab_name: 'Green Chemistry Lab',
      address: '360 Huntington Ave, Boston, MA 02115',
    },
  },
  {
    id: 'lab-4',
    email: 'j.wilson@bu.edu',
    password: 'password123',
    name: 'Dr. James Wilson',
    userType: 'lab',
    profile: {
      id: 'prof-lab-4',
      institution_name: 'Boston University',
      lab_name: 'Tissue Engineering Research',
      address: '44 Cummington Mall, Boston, MA 02215',
    },
  },
];

// Mock session storage (in production, use cookies/JWT)
let currentSession: User | null = null;

export const mockAuth = {
  login: (email: string, password: string): User | null => {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      currentSession = user;
      return user;
    }
    return null;
  },

  logout: () => {
    currentSession = null;
  },

  getSession: (): User | null => {
    return currentSession;
  },

  register: (userData: Partial<User>): User => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email!,
      password: userData.password!,
      name: userData.name!,
      userType: userData.userType!,
      profile: userData.profile,
    };
    mockUsers.push(newUser);
    currentSession = newUser;
    return newUser;
  },

  getAllUsers: () => mockUsers,
};
