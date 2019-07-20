import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";

import { CarModel } from '../modules/car.model';
import { CarService } from '../modules/car.service';

import { MakeModel } from '../modules/make.model';
import { MakeService } from '../modules/make.service';

import { ModelService } from '../modules/model.service';
import { ModelModel } from '../modules/model.model';
import { CommonService } from '../modules/config'

declare var $: any;

@Component({
  selector: 'app-car-search',
  templateUrl: './car-search.component.html',
  styleUrls: ['./car-search.component.css']
})

export class CarSearchComponent implements OnInit {

  car         : any;
  cars        : any;
  makes       : MakeModel[];
  models      : ModelModel[];
  fromYears   : number[];
  toYears     : number[];
  fromPrices  : number[];
  toPrices    : number[];
  selectedMake: string;
  
  findForm: FormGroup;
  submitted = false;
  
  constructor(private formBuilder: FormBuilder, 
              private carService: CarService, 
              private makeService: MakeService, 
              private modelService: ModelService,
              private commonService : CommonService,
              private route: ActivatedRoute,
              private router: Router) { }
  ngOnInit() {

    this.getAllMakes();

    this.fromYears    = this.commonService.years;
    this.toYears      = this.commonService.years;
    this.fromPrices   = this.commonService.fromPrices;
    this.toPrices     = this.commonService.toPrices;

    this.findForm = this.formBuilder.group({
      make:       ['', Validators.required],
      model:      ['', Validators.required],
      fromYear:   ['', Validators.required],
      toYear:     ['', Validators.required],
      fromPrice:  ['', Validators.required],
      toPrice:    ['', Validators.required],
      orderid:    ['HIGHEST_PRICE', Validators.required]
    });

    let search_params = JSON.parse(localStorage.getItem("search_params"));
    localStorage.removeItem("search_params");

    if(!search_params) {
      this.getAllCar();
    } else {
      this.getSearchAllCarOnIndex(search_params);
    }

  }

  getCarById(id : string){
    this.carService.getCarById(id).subscribe(data=>{

      this.car = data;

    });
  }

  getAllCar(): void {
    this.carService.getAllCar().subscribe(data=>{

      this.cars = data;
      for(let i = 0; i < this.cars.length; i++) {
        let imgArray = JSON.parse(this.cars[i].imgfiles);
        if (imgArray.length > 0)
          this.cars[i].imgFile = this.commonService.baseurl + "/uploads/cars/" +  imgArray[0];
      }
    });
  };

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
  
  getCarDetailById(car_id : string){
    localStorage.removeItem("car_id");
    localStorage.setItem("car_id", car_id);
    this.router.navigate(['car-detail']);
  }

  getSearchAllCarOnIndex(params: any){
    this.carService.getSearchAllCarOnIndex(params).subscribe( data => {
      this.cars = data;
    });
  }

  onMakeChange(event:Event) {
    
    const value:string = (<HTMLSelectElement>event.srcElement).value;
    this.getModelByMakeId(value);

  }

  onSubmit(){
    this.submitted = true;
      this.carService.getSearchAllCar(this.findForm.value)
      .subscribe( data => {
        this.cars = data;
      });
  }

  // get the form short name to access the form fields
  get f() { return this.findForm.controls; }


}
