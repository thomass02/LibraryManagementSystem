
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../api.service';
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {

  /* Define book object and set attributes to null */
  book = {};
  bookEditForm: FormGroup;
  isbn = '';
  title = '';
  description = '';
  author = '';
  publisher = '';
  published_year = '';
  id = '';

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) {
  }

  /* On Initiation require all vales for processing  */
  ngOnInit() {
    this.bookEditForm = this.formBuilder.group({
      'isbn': [null, Validators.required],
      'title': [null, Validators.required],
      'description': [null, Validators.required],
      'author': [null, Validators.required],
      'publisher': [null, Validators.required],
      'published_year': [null, Validators.required]
    });
    /* get book object from id (mongo db unique id) */
    this.getBookDetails(this.route.snapshot.params['id']);

  }

  /* pass the id to get all book data and assign to variables (above)  */
  getBookDetails(id) {
    this.api.getBook(id)
      .subscribe(data => {
        console.log('data load before edit', data);
        this.book = data;
        this.bookEditForm.setValue({
          isbn: data.isbn,
          title: data.title,
          author: data.author,
          description: data.description,
          publisher: data.publisher,
          published_year: data.published_year
        });
      });
}

  /* on "submit" - update the database with the new/updated user entered info */
  onFormSubmit(form: NgForm) {
    const id = this.route.snapshot.params['id'];
    console.log('edit form values:', form);
    this.api.updateBook(id, form)
      .subscribe(res => {
        console.log('response in update', res);
        this.router.navigate (['/book-details', id]);
      }, (err) => {
        console.log(err);
      });
  }
}
