import { fakerEN_IN as faker } from '@faker-js/faker';

// 1. Employee Interface define karna zaroori hai types ke liye
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  zone: string;
  status: 'Active' | 'On Field' | 'On Leave';
  performance: number;
}

// 2. Data generate karne ka function
export const generateEmployees = (count: number): Employee[] => {
  return Array.from({ length: count }, () => ({
    id: `MCD-${faker.string.numeric(5)}`,
    name: faker.person.fullName(), // Indian Names (e.g., Rajesh Kumar)
    role: faker.helpers.arrayElement([
      'Field Inspector', 
      'Sanitation Worker', 
      'Supervisor', 
      'Junior Engineer (JE)'
    ]),
    department: faker.helpers.arrayElement([
      'Waste Management', 
      'Engineering', 
      'Public Health', 
      'Administration'
    ]),
    zone: faker.helpers.arrayElement([
      'Rohini', 
      'Dwarka', 
      'Shahdara', 
      'Karol Bagh', 
      'Najafgarh', 
      'South Delhi'
    ]),
    status: faker.helpers.arrayElement(['Active', 'On Field', 'On Leave']),

    performance: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
  }));
};


export const employeeDatabase = generateEmployees(1000);