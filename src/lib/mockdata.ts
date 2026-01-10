import { faker } from '@faker-js/faker';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  zone: string;
  email: string;
  status: 'Active' | 'On Field' | 'On Leave';
  joiningDate: string;
  performance: number; // 1 to 5
}

export const generateEmployees = (count: number): Employee[] => {
  return Array.from({ length: count }, () => ({
    id: `MCD-${faker.string.numeric(5)}`,
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(['Field Inspector', 'Sanitation Worker', 'Supervisor', 'HR Manager', 'Junior Engineer']),
    department: faker.helpers.arrayElement(['Waste Management', 'Public Health', 'Engineering', 'Administration']),
    zone: faker.helpers.arrayElement(['Rohini', 'Dwarka', 'Shahdara', 'South Delhi', 'Karol Bagh']),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(['Active', 'On Field', 'On Leave']),
    joiningDate: faker.date.past({ years: 5 }).toLocaleDateString(),
    performance: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
  }));
};

// 1000 employees generate karke export kar rahe hain
export const employeeDatabase = generateEmployees(1000);