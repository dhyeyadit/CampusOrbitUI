import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  studentForm!: FormGroup;
  isSubmitting = signal(false);

  // File names for display
  fileNames: { [key: string]: string } = {};

  branches = [
    'Computer Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering'
  ];

  genders = ['Male', 'Female', 'Other'];
  mediums = ['English', 'Gujarati', 'Hindi', 'Other'];
  boards = ['GSEB', 'CBSE', 'ICSE', 'State Board', 'Other'];
  states = ['Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi', 'Karnataka', 'Other'];
  cities = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Mumbai', 'Other'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.studentForm = this.fb.group({
      // Basic Information
      enrollmentNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]],
      interestedForPlacement: [true],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      personalMail: ['', [Validators.required, Validators.email]],
      branch: ['', Validators.required],
      gender: ['', Validators.required],
      mediumOfEducation: ['', Validators.required],
      boardOfEducation: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      alternatePhoneNumber: ['', Validators.pattern(/^\d{10}$/)],

      // Academic Information
      sscPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      hscPercentage: ['', [Validators.min(0), Validators.max(100)]],
      diplomaPercentage: ['', [Validators.min(0), Validators.max(100)]],
      currentBacklogs: ['', [Validators.required, Validators.min(0)]],
      deadBacklogs: ['', [Validators.required, Validators.min(0)]],
      cgpaLatest: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      currentSemester: ['', [Validators.required, Validators.min(1), Validators.max(8)]],
      currentYear: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
      sem1SPI: ['', [Validators.min(0), Validators.max(10)]],
      sem2SPI: ['', [Validators.min(0), Validators.max(10)]],
      sem3SPI: ['', [Validators.min(0), Validators.max(10)]],
      sem4SPI: ['', [Validators.min(0), Validators.max(10)]],
      sem5SPI: ['', [Validators.min(0), Validators.max(10)]],
      sem6SPI: ['', [Validators.min(0), Validators.max(10)]],
      sem7SPI: ['', [Validators.min(0), Validators.max(10)]],

      // Address Information
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],

      // Documents
      resume: [null],
      sscMarksheet: [null],
      hscMarksheet: [null],
      diplomaCertificate: [null],
      sem1Marksheet: [null],
      sem2Marksheet: [null],
      sem3Marksheet: [null],
      sem4Marksheet: [null],
      sem5Marksheet: [null],
      sem6Marksheet: [null],
      sem7Marksheet: [null]
    });
  }

  // Validation helper methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.studentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  shouldShowError(fieldName: string): boolean {
    const field = this.studentForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // File handling methods
  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.studentForm.patchValue({ [controlName]: file });
      this.fileNames[controlName] = file.name;
      
      // Mark as touched to trigger validation
      this.studentForm.get(controlName)?.markAsTouched();
    }
  }

  removeFile(controlName: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.studentForm.patchValue({ [controlName]: null });
    delete this.fileNames[controlName];
    
    // Reset the file input
    const fileInput = document.getElementById(controlName) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  getFileName(controlName: string): string {
    return this.fileNames[controlName] || 'No file chosen';
  }

  hasFile(controlName: string): boolean {
    return !!this.fileNames[controlName];
  }

  // Form submission
  onSubmit(): void {
    // Mark all fields as touched to trigger validation display
    Object.keys(this.studentForm.controls).forEach(key => {
      this.studentForm.get(key)?.markAsTouched();
    });

    if (this.studentForm.valid) {
      this.isSubmitting.set(true);
      console.log('Form Data:', this.studentForm.value);

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting.set(false);
        alert('Student profile submitted successfully!');
      }, 2000);
    } else {
      // Scroll to first invalid field
      const firstInvalidControl = document.querySelector('.is-invalid');
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  onReset(): void {
    this.studentForm.reset({
      interestedForPlacement: true
    });
    this.fileNames = {};
  }
}