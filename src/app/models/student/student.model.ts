export interface AddStudent {
  isPlacementInterested: boolean;
  branchId: string;
  enrollmentNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  genderId: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string; // ISO string format
  sscpercentage: number;
  hscpercentage: number;
  diplomaPercentage?: number;
  currentBacklogs: number;
  deadBacklogs: number;
  cgpa: number;
  sem1Spi: number;
  sem2Spi: number;
  sem3Spi: number;
  sem4Spi: number;
  sem5Spi: number;
  sem6Spi: number;
  city: string;
  address: string;
  mediumOfEducationId: string;
}

export interface UpdateStudent {
  studentId: string;
  isPlacementInterested: boolean;
  branchId: string;
  enrollmentNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  genderId: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  sscpercentage: number;
  hscpercentage: number;
  diplomaPercentage?: number;
  currentBacklogs: number;
  deadBacklogs: number;
  cgpa: number;
  sem1Spi: number;
  sem2Spi: number;
  sem3Spi: number;
  sem4Spi: number;
  sem5Spi: number;
  sem6Spi: number;
  city: string;
  address: string;
  mediumOfEducationId: string;
}

export interface Student {
  studentId: string;
  enrollmentNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  branchId: string;
  genderId: string;
  mediumOfEducationId: string;
  boardOfEducationId: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  dateOfBirth: string;
  sscPercentage: number;
  hscPercentage: number;
  diplomaPercentage?: number;
  currentBacklogs: number;
  deadBacklogs: number;
  cgpa: number;
  sem1Spi: number;
  sem2Spi: number;
  sem3Spi: number;
  sem4Spi: number;
  sem5Spi: number;
  sem6Spi: number;
  currentSemester: number;
  currentYear: number;
  address: string;
  city: string;
  isPlacementInterested: boolean;
  resume: Uint8Array;
  isVerified: boolean;
}
