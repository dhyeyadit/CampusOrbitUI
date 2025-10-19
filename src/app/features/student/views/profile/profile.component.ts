import { Component, ElementRef, QueryList, ViewChildren, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LookupService } from '../../../../common/services/lookup.service';
import { LocationService } from '../../../../common/services/location.service';
import { StudentService } from '../../services/student.service';
import { Lookup } from '../../../../models/common/lookup.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  studentForm!: FormGroup;
  isSubmitting = signal(false);

  _lookupService = inject(LookupService);
  _locationService = inject(LocationService);
  _studentService = inject(StudentService);

  branches = signal<Lookup[]>([]);
  genders = signal<Lookup[]>([]);
  mediumOfEducation = signal<Lookup[]>([]);
  boards = signal<Lookup[]>([]);
  states = signal<string[]>([]);
  cities = signal<string[]>([]);

  fileNames: { [key: string]: string } = {};

  // 👇 All form fields will be collected here
  @ViewChildren('formField') formFields!: QueryList<ElementRef>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadLookups();
    this.loadStates();
  }

  private initializeForm(): void {
    this.studentForm = this.fb.group({
      // Basic Info
      enrollmentNumber: ['', Validators.required],
      fullName: ['', Validators.required],
      interestedForPlacement: [true],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      personalMail: ['', [Validators.required, Validators.email]],
      branch: ['', Validators.required],
      gender: ['', Validators.required],
      mediumOfEducation: ['', Validators.required],
      boardOfEducation: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      alternatePhoneNumber: ['', Validators.pattern(/^\d{10}$/)],

      // Academic Info
      sscPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      hscPercentage: ['', [Validators.min(0), Validators.max(100)]],
      diplomaPercentage: ['', [Validators.min(0), Validators.max(100)]],
      currentBacklogs: ['', Validators.required],
      deadBacklogs: ['', Validators.required],
      cgpaLatest: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      currentSemester: ['', [Validators.required, Validators.min(1), Validators.max(8)]],
      currentYear: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
      sem1SPI: [''],
      sem2SPI: [''],
      sem3SPI: [''],
      sem4SPI: [''],
      sem5SPI: [''],
      sem6SPI: [''],
      sem7SPI: [''],

      // Address
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],

      // Files
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

  private loadLookups(): void {
    this._lookupService.getLookupsByMultipleTypeNames([
      'Branch', 'Gender', 'MediumOfEducation', 'BoardOfEducatioon'
    ]).subscribe({
      next: (res) => {
        if (res.status && res.data) {
          this.branches.set(res.data.find(x => x.lookupTypeName === 'Branch')?.lookups || []);
          this.genders.set(res.data.find(x => x.lookupTypeName === 'Gender')?.lookups || []);
          this.mediumOfEducation.set(res.data.find(x => x.lookupTypeName === 'MediumOfEducation')?.lookups || []);
          this.boards.set(res.data.find(x => x.lookupTypeName === 'BoardOfEducatioon')?.lookups || []);
        }
      },
      error: err => console.error('Lookup load failed', err)
    });
  }

  private loadStates(): void {
    this._locationService.getStates().subscribe({
      next: (res) => {
        this.states.set(res.data || []);
        this.studentForm.get('state')?.valueChanges.subscribe(state => {
          if (state) {
            this._locationService.getCitiesByState(state).subscribe({
              next: (res) => this.cities.set(res.data || []),
              error: (err) => console.error('City load failed', err)
            });
          } else {
            this.cities.set([]);
          }
        });
      },
      error: err => console.error('State load failed', err)
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.studentForm.get(fieldName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.studentForm.patchValue({ [controlName]: file });
      this.fileNames[controlName] = file.name;
      this.studentForm.get(controlName)?.markAsTouched();
    }
  }

  removeFile(controlName: string): void {
    this.studentForm.patchValue({ [controlName]: null });
    delete this.fileNames[controlName];
  }

  getFileName(controlName: string): string {
    return this.fileNames[controlName] || 'No file chosen';
  }

  private scrollToFirstInvalidField(): void {
    const invalidControlNames = Object.keys(this.studentForm.controls)
      .filter(key => this.studentForm.get(key)?.invalid);

    if (invalidControlNames.length > 0 && this.formFields) {
      const firstInvalidControlName = invalidControlNames[0];
      const firstInvalidElement = this.formFields.find((el: ElementRef) =>
        el.nativeElement.getAttribute('formControlName') === firstInvalidControlName
      );
      if (firstInvalidElement) {
        firstInvalidElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidElement.nativeElement.focus();
      }
    }
  }

  onSubmit(): void {
    Object.keys(this.studentForm.controls).forEach(key => {
      this.studentForm.get(key)?.markAsTouched();
    });

    if (this.studentForm.invalid) {
      this.scrollToFirstInvalidField();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.studentForm.value;
    const formData = new FormData();

    // append text fields
    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      if (value !== null && value !== undefined && !(value instanceof File)) {
        formData.append(key, value);
      }
    });

    // append file fields
    [
      'resume', 'sscMarksheet', 'hscMarksheet', 'diplomaCertificate',
      'sem1Marksheet', 'sem2Marksheet', 'sem3Marksheet', 'sem4Marksheet',
      'sem5Marksheet', 'sem6Marksheet', 'sem7Marksheet'
    ].forEach(fileKey => {
      const file = formValue[fileKey];
      if (file) {
        formData.append(fileKey.charAt(0).toUpperCase() + fileKey.slice(1), file);
      }
    });

    this._studentService.addStudentWithFiles(formData).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.status) {
          alert('✅ Student profile submitted successfully!');
          this.studentForm.reset({ interestedForPlacement: true });
          this.fileNames = {};
        } else {
          alert(`⚠️ ${res.message}`);
        }
      },
      error: (err) => {
        console.error('❌ Submit failed', err);
        this.isSubmitting.set(false);
        alert('Something went wrong.');
      }
    });
  }

  onReset(): void {
    this.studentForm.reset({ interestedForPlacement: true });
    this.fileNames = {};
  }
}
