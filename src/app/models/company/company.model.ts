export interface AddCompany {
  companyName: string;
  industryTypeId: string;
  email: string;
  contactNumber: string;
  hrName: string;
  hrContactNumber: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface UpdateCompany {
  companyId: string;
  companyName: string;
  industryTypeId: string;
  email: string;
  contactNumber: string;
  hrName: string;
  hrContactNumber: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface Company {
  companyId: string;
  companyName: string;
  industryTypeId: string;
  email: string;
  contactNumber: string;
  hrName: string;
  hrContactNumber: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
}
