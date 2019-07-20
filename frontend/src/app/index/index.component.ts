import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";

import { CarService } from '../modules/car.service';
import { AuthenticationService } from '../auth/authentication.service';
import { UserModel } from '../modules/user.model';
import { MakeModel } from '../modules/make.model';
import { MakeService } from '../modules/make.service';
import { ModelService } from '../modules/model.service';
import { ModelModel } from '../modules/model.model';
import { CommonService } from '../modules/config'

//import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {

  currentUser  : UserModel;
  motors       : {};
  makes        : MakeModel[];
  models       : ModelModel[];
  fromYears    : number[];
  toYears      : number[];
  fromPrices   : number[];
  toPrices     : number[];
  colors       : {};
  transmissions: {};
  fueltypes    : {};
  conditions   : {};

  findForm: FormGroup;
  submitted = false;
  
  constructor(
      private formBuilder: FormBuilder, 
      private authenticationService: AuthenticationService,
      private carService: CarService, 
      private makeService: MakeService, 
      private modelService: ModelService,
      private commonService : CommonService,
      private router: Router){

        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    
      }
  ngOnInit() {
    
    this.motors       = this.commonService.motors;
    this.fromYears    = this.commonService.years;
    this.toYears      = this.commonService.years;
    this.fromPrices   = this.commonService.fromPrices;
    this.toPrices     = this.commonService.toPrices;
    this.fueltypes    = this.commonService.fueltypes;
    this.conditions   = this.commonService.conditions;
    this.transmissions= this.commonService.transmissions;
    this.colors       = this.commonService.colors;

    this.getAllMakes();

    this.findForm = this.formBuilder.group({
      motor:       ['cars', Validators.required],
      make:        ['', Validators.required],
      model:       ['', Validators.required],
      fromYear:    ['', Validators.required],
      toYear:      ['', Validators.required],
      fromPrice:   ['', Validators.required],
      toPrice:     ['', Validators.required],
      color:       ['', Validators.required],
      transmission:['', Validators.required],
      fueltype:    ['', Validators.required],
      condition:   ['', Validators.required]
    });
    
  }

  onPlaceAd(){
    if (this.currentUser)
      this.router.navigate(['/new-ad/' + this.currentUser.id]);
    else
      $('#loginPopup').modal('toggle');
  }
  
  onSubmit(){
    
    localStorage.removeItem("search_params");
    localStorage.setItem("search_params", JSON.stringify(this.findForm.value));
    
    this.router.navigate(['car-search']);    
  }

  onMakeChange(event:Event) {
    
    const value:string = (<HTMLSelectElement>event.srcElement).value;
    this.getModelByMakeId(value);

  }

  getAllMakes(): void {
    this.makeService.getAllMakes().subscribe(data=>{

      this.makes = data;
      setTimeout("$('.selectpicker').selectpicker('refresh')", 0);

    });
  };

  getModelByMakeId(make_id : string){
    this.modelService.getAllModelByMakeId(make_id).subscribe(data=>{
      this.models = data;
      setTimeout("$('.selectpicker').selectpicker('refresh')", 0);
    });
  }

  showHomeAdvanced() {
		
		var x = document.getElementById("home-form");
		if (x.className === "clearfix") {
			x.className += " open";
		} else {
			x.className = "clearfix";
		}

	}
}
