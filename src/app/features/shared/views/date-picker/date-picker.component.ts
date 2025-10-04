import { Component, forwardRef, input, output, viewChild, ElementRef, computed, signal, effect, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  standalone: true
})
export class DatePickerComponent implements ControlValueAccessor {
  // Input signals
  placeholder = input('Select date');
  maxDate = input(new Date().toISOString().split('T')[0]);
  minDate = input('');
  errorMessage = input('');
  successMessage = input('');
  disabled = input(false);

  // Output signals
  focused = output<void>();
  blurred = output<void>();
  cleared = output<void>();
  valueChanged = output<string>();

  // State signals
  value = signal('');
  isFocused = signal(false);
  touched = signal(false);
  isCalendarOpen = signal(false);
  currentMonth = signal(new Date());
  selectedDate = signal<Date | null>(null);

  // Computed signals
  hasValue = computed(() => !!this.value());
  showValidation = computed(() => this.touched() && (this.errorMessage() || this.successMessage()));
  isValid = computed(() => this.touched() && !!this.successMessage() && !this.errorMessage());
  isInvalid = computed(() => this.touched() && !!this.errorMessage());
  
  // Format date for display
  formattedDate = computed(() => {
    const value = this.value();
    if (!value) return '';
    
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });

  // Calendar computed signals
  calendarTitle = computed(() => {
    const date = this.currentMonth();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  calendarDates = computed(() => {
    const currentMonth = this.currentMonth();
    const selectedDate = this.selectedDate();
    const today = new Date();
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Start from the first day of the week that contains the first day of month
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const dates: CalendarDate[] = [];
    const date = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(date);
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = this.isSameDay(currentDate, today);
      const isSelected = selectedDate ? this.isSameDay(currentDate, selectedDate) : false;
      const isDisabled = this.isDateDisabled(currentDate);
      
      dates.push({
        date: currentDate,
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled
      });
      
      date.setDate(date.getDate() + 1);
    }
    
    return dates;
  });

  weekDays = computed(() => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Sync selectedDate with value
    effect(() => {
      const value = this.value();
      if (value) {
        this.selectedDate.set(new Date(value));
        this.currentMonth.set(new Date(value));
      } else {
        this.selectedDate.set(null);
      }
    });
  }

  // Calendar methods
  openCalendar(): void {
    if (!this.disabled()) {
      this.isCalendarOpen.set(true);
      this.onFocus();
      // Prevent body scroll when calendar is open
      document.body.style.overflow = 'hidden';
    }
  }

  closeCalendar(): void {
    this.isCalendarOpen.set(false);
    this.onBlur();
    // Restore body scroll
    document.body.style.overflow = '';
  }

  selectDate(date: CalendarDate): void {
    if (date.isDisabled) return;
    
    this.selectedDate.set(date.date);
    const dateString = date.date.toISOString().split('T')[0];
    this.value.set(dateString);
    this.onChange(dateString);
    this.valueChanged.emit(dateString);
    this.markAsTouched();
    this.closeCalendar();
  }

  navigateMonth(direction: number): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setMonth(newMonth.getMonth() + direction);
    this.currentMonth.set(newMonth);
  }

  selectToday(): void {
    const today = new Date();
    if (!this.isDateDisabled(today)) {
      this.selectDate({
        date: today,
        isCurrentMonth: true,
        isToday: true,
        isSelected: false,
        isDisabled: false
      });
    }
  }

  // Helper methods
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  private isDateDisabled(date: Date): boolean {
    const dateString = date.toISOString().split('T')[0];
    const minDate = this.minDate();
    const maxDate = this.maxDate();
    
    if (minDate && dateString < minDate) return true;
    if (maxDate && dateString > maxDate) return true;
    
    return false;
  }

  // Event handlers
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    
    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChanged.emit(newValue);
    this.markAsTouched();
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.focused.emit();
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
    this.markAsTouched();
    this.blurred.emit();
  }

  clearDate(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    this.value.set('');
    this.selectedDate.set(null);
    this.onChange('');
    this.valueChanged.emit('');
    this.markAsTouched();
    this.cleared.emit();
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled by input signal
  }

  // Public methods
  focus(): void {
    this.openCalendar();
  }

  clear(): void {
    this.clearDate();
  }

  markAsTouched(): void {
    if (!this.touched()) {
      this.touched.set(true);
      this.onTouched();
    }
  }

  // Close calendar when clicking outside or pressing escape
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.closeCalendar();
  }

  // Cleanup on destroy
  ngOnDestroy(): void {
    // Ensure body scroll is restored
    document.body.style.overflow = '';
  }
}