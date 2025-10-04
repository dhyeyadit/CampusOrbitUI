import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionSection } from '../../../../models/common/accordian.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  studentForm!: FormGroup;
  isSubmitting = signal(false);

  accordionSections: AccordionSection[] = [
    { id: 'basic', title: 'Basic Information', icon: 'bi-person', expanded: true },
    { id: 'contact', title: 'Contact Information', icon: 'bi-telephone', expanded: false },
    { id: 'academic', title: 'Academic Information', icon: 'bi-book', expanded: false },
    { id: 'semester', title: 'Semester Performance', icon: 'bi-graph-up', expanded: false },
    { id: 'documents', title: 'Documents', icon: 'bi-file-earmark-text', expanded: false }
  ];

  branches = [
    'Computer Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering'
  ];

  genders = ['Male', 'Female', 'Other'];

  educationMediums = ['English', 'Gujarati', 'Hindi', 'Other'];

  boards = ['GSEB', 'CBSE', 'ICSE', 'State Board', 'Other'];

  states = [
    'Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi', 'Karnataka',
    'Tamil Nadu', 'Uttar Pradesh', 'Madhya Pradesh', 'West Bengal', 'Other'
  ];

  cities = [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
    'Jamnagar', 'Gandhinagar', 'Mumbai', 'Pune', 'Bangalore', 'Other'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.studentForm = this.fb.group({
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
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],

      sscPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      hscPercentage: ['', [Validators.min(0), Validators.max(100)]],
      diplomaPercentage: ['', [Validators.min(0), Validators.max(100)]],
      currentBacklogs: ['', [Validators.required, Validators.min(0)]],
      deadBacklogs: ['', [Validators.required, Validators.min(0)]],
      cgpa: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      currentSemester: ['', [Validators.required, Validators.min(1), Validators.max(8)]],
      currentYear: ['', [Validators.required, Validators.min(1), Validators.max(4)]],

      sem1SPI: ['', [Validators.min(0), Validators.max(10)]],
      sem2SPI: ['', [Validators.min(0), Validators.max(10)]],
      sem3SPI: ['', [Validators.min(0), Validators.max(10)]],
      sem4SPI: ['', [Validators.min(0), Validators.max(10)]],
      sem5SPI: ['', [Validators.min(0), Validators.max(10)]],
      sem6SPI: ['', [Validators.min(0), Validators.max(10)]],
      sem7SPI: ['', [Validators.min(0), Validators.max(10)]],

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

  toggleAccordion(sectionId: string): void {
    const section = this.accordionSections.find(s => s.id === sectionId);
    if (section) {
      section.expanded = !section.expanded;
    }
  }

  onFileSelect(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.studentForm.patchValue({ [controlName]: file });
      this.studentForm.get(controlName)?.markAsTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.studentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.studentForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) return 'This field is required';
    if (field.hasError('email')) return 'Invalid email format';
    if (field.hasError('pattern')) {
      if (fieldName.includes('Phone')) return 'Must be 10 digits';
      if (fieldName === 'enrollmentNumber') return 'Only uppercase letters and numbers allowed';
    }
    if (field.hasError('min')) return `Minimum value is ${field.errors?.['min'].min}`;
    if (field.hasError('max')) return `Maximum value is ${field.errors?.['max'].max}`;
    if (field.hasError('minlength')) return `Minimum length is ${field.errors?.['minlength'].requiredLength}`;

    return '';
  }

  getFileName(controlName: string): string {
    const file = this.studentForm.get(controlName)?.value;
    return file ? file.name : 'Choose file';
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.isSubmitting.set(true);
      console.log('Form Data:', this.studentForm.value);

      setTimeout(() => {
        this.isSubmitting.set(false);
        alert('Student profile submitted successfully!');
      }, 2000);
    } else {
      Object.keys(this.studentForm.controls).forEach(key => {
        this.studentForm.get(key)?.markAsTouched();
      });

      const firstInvalidSection = this.accordionSections.find(section => {
        const sectionFields = this.getFieldsForSection(section.id);
        return sectionFields.some(field => this.isFieldInvalid(field));
      });

      if (firstInvalidSection) {
        firstInvalidSection.expanded = true;
      }
    }
  }

  onReset(): void {
    this.studentForm.reset({
      interestedForPlacement: true
    });
  }

  private getFieldsForSection(sectionId: string): string[] {
    const fieldMap: { [key: string]: string[] } = {
      basic: ['enrollmentNumber', 'interestedForPlacement', 'firstName', 'middleName', 'lastName',
              'personalMail', 'branch', 'gender', 'mediumOfEducation', 'boardOfEducation', 'dateOfBirth'],
      contact: ['phoneNumber', 'alternatePhoneNumber', 'address', 'city', 'state'],
      academic: ['sscPercentage', 'hscPercentage', 'diplomaPercentage', 'currentBacklogs',
                 'deadBacklogs', 'cgpa', 'currentSemester', 'currentYear'],
      semester: ['sem1SPI', 'sem2SPI', 'sem3SPI', 'sem4SPI', 'sem5SPI', 'sem6SPI', 'sem7SPI'],
      documents: ['resume', 'sscMarksheet', 'hscMarksheet', 'diplomaCertificate',
                  'sem1Marksheet', 'sem2Marksheet', 'sem3Marksheet', 'sem4Marksheet',
                  'sem5Marksheet', 'sem6Marksheet', 'sem7Marksheet']
    };
    return fieldMap[sectionId] || [];
  }
}
