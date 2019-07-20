import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { CarService } from '../modules/car.service';
import { CommonService }      from '../modules/config'

declare var $: any;

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})

export class CarDetailComponent implements OnInit {

  car : any;
  slideIndex : number;

  imgFiles      : string[];
  previewImgFile: string;
  features      : string[];

  constructor(private carService: CarService,
              private commonService : CommonService,
              private router: Router) { }
  ngOnInit() {

    let car_id = localStorage.getItem("car_id");
    if(!car_id){
      alert("Something wrong!");
      this.router.navigate(['']);
      return;
    }
    this.car = {};

    this.getCarById(car_id);

    $(document).ready(function() {
      
      var slideIndex=0;
      
      $("body").on("click", ".vdItem-image", function() {
        var imageSrc= $(this).find('img').attr('src');
        $("#vd-previewImage").find('img').attr('src',imageSrc);
      });
      
      $("#vd-previewImageLeft").click(function() {
        slideIndex-=1;
        if(slideIndex<0)slideIndex=$(".vdItem-image").length-1;
        setImage();
      });

      $("#vd-previewImageRight").click(function() {
        slideIndex+=1;
        if(slideIndex>$(".vdItem-image").length-1)slideIndex=0;
        setImage();
      });

      $("#vd-previewImageFullScreen").click(function() {
        $("#popupImage").attr('src',$("#vd-previewImage").find('img').attr('src'));
        $("#imagePopupContainer").css('display','block');
        $("body").css('overflow','hidden');
      });

      $("#closeImagePopupContainer").click(function() {
        $("#imagePopupContainer").css('display','none');
        $("body").css('overflow','auto');
      });
  
      function setImage(){
        var imageSrc= $(".vdItem-image").eq(slideIndex).find('img').attr('src');
        $("#vd-previewImage").find('img').attr('src',imageSrc);
      }      
    });
  }

  getCarById(id : string){
    this.carService.getCarById(id).subscribe((data:any)=>{
      this.car = data;
      let imgFiles = [];
      this.imgFiles = [];
      this.previewImgFile = "";

      imgFiles = JSON.parse(data.imgfiles);
      for(let i = 0; i < imgFiles.length; i++) {
        this.imgFiles[i] = this.commonService.baseurl + "/uploads/cars/" + imgFiles[i];
        if(i == 0) this.previewImgFile = this.imgFiles[0];
      }
      this.features = JSON.parse(data.features);
    });
  }
}
