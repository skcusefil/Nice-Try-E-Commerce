import { BooleanInput } from '@angular/cdk/coercion';
import { CdkStep } from '@angular/cdk/stepper';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-mat-stepper',
  templateUrl: './mat-stepper.component.html',
  styleUrls: ['./mat-stepper.component.scss']
})
export class MatStepperComponent extends MatStepper implements OnInit {

  @Input()
  labelPosition: 'bottom' | 'end' = 'end';

  
  static ngAcceptInputType_editable: BooleanInput;
  static ngAcceptInputType_optional: BooleanInput;
  static ngAcceptInputType_completed: BooleanInput;
  static ngAcceptInputType_hasError: BooleanInput;

  ngOnInit(): void {
  }

  onClick(index: number){
    this
  }

}
