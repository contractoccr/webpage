import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit 
{
  
  form: FormGroup;
  name: FormControl = new FormControl("", [Validators.required]);
  email: FormControl = new FormControl("", [Validators.required, Validators.email]);
  phone: FormControl = new FormControl("", [Validators.required, Validators.pattern('[- +()0-9]+')]);
  object: FormControl = new FormControl("", [Validators.required, Validators.minLength(5)]);
  message: FormControl = new FormControl("", [Validators.required, Validators.maxLength(256)]);
  honeypot: FormControl = new FormControl(""); // we will use this to prevent spam
  submitted: boolean = false; // show and hide the success message
  isLoading: boolean = false; // disable the submit button if we're loading
  responseMessage: string = ""; // the response message to show to the user
  response: any;

constructor (private formBuilder: FormBuilder, private http: HttpClient, private translocoService: TranslocoService) {

  this.form = this.formBuilder.group({
    name: this.name,
    email: this.email,
    message: this.message,
    phone: this.phone,
    object: this.object,
    honeypot: this.honeypot
  });
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name : [''],
      email:  [''],
      message: [''],
      phone: [''],
      object: [''],
      honeypot: ['']
    });
  }
  
  onSubmit() {
    if (this.form.status == "VALID" && this.honeypot.value == "") {
      this.form.disable(); // disable the form if it's valid to disable multiple submissions
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.setErrors(null) ;
      }); // clear the validators so we don't get errors on disabled fields
      var formData: any = new FormData();
      formData.append("Subject", this.form.get("object")?.value);
      formData.append("Name", this.form.get("name")?.value);
      formData.append("Email", this.form.get("email")?.value);
      formData.append("Phone", this.form.get("phone")?.value);
      formData.append("message", this.form.get("message")?.value);
      
      this.isLoading = true; // sending the post request async so it's in progress
      this.submitted = false; // hide the response message on multiple submits
      //prod link
      this.http.post("https://script.google.com/macros/s/AKfycbx3SWXwMYV5zRc6IZkTXmu2nWa1_rU9ha4cz1cc3-nR-Q3iGckxhjCMAOI83pCz3BKfcw/exec", formData).subscribe(
      //test link  
      //this.http.post("https://script.google.com/macros/s/AKfycbxtDptGfEgoPyeTKvxPnfycWZ3QmUZqKJUvvOZONiP_dpDcTDpA9v4DoO566eP3KSeoSA/exec", formData).subscribe(
        {
          next: (data) => {
            this.response = data;
            if (this.response["result"] == "success") {
               this.translocoService.selectTranslate('contact-form-7')
              .subscribe((res: string) => {
                this.responseMessage = res;});
            } else {
              this.translocoService.selectTranslate('contact-form-8')
              .subscribe((res: string) => {
                this.responseMessage = res;});
            }
          },
          error: (error) => {
            this.translocoService.selectTranslate('contact-form-8')
            .subscribe((res: string) => {
              this.responseMessage = res;});
          },
          complete: () => {
            this.isLoading = false; // loading is done
            this.submitted = true; // show the success message
            this.form.enable(); // re-enable the form
            this.form.reset(); // reset the form
          }
        }
      );
    }
  }
}
