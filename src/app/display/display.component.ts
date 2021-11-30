import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.sass']
})
export class DisplayComponent implements OnInit {

  constructor() { }

  @Input() hero: Map<string, Map<string, number>> = new Map();

  PhysicalEHP: number;
  MagicalEHP: number;

  APS: number;
  Damage: number;
  DPS: number;

  ngOnInit(): void {
    this.PhysicalEHP = 0; 
    this.MagicalEHP = 0;
  }

  /* When variable changes recalculate EHP */
  ngOnChanges(): void {

    /********/
    /* EHP */
    /*******/
    let Armor: number = 0;
    let Health: number = 0;
    let MR: number = 0;

    /* Grab numbers from hero Map */
    Health += this.hero.get("Stats")?.get("Base HP") || 0;
    Health += this.hero.get("Items")?.get("HP") || 0;
    
    Health += (this.hero.get("Stats")?.get("Str") || 0) * 20;
    Health += (this.hero.get("Items")?.get("Str") || 0) * 20;

    Armor += this.hero.get("Stats")?.get("Base Armor") || 0;
    Armor += this.hero.get("Items")?.get("Armor") || 0;
 
    Armor += (this.hero.get("Stats")?.get("Agi") || 0) * 0.167;
    Armor += (this.hero.get("Items")?.get("Agi") || 0) * 0.167;

    this.PhysicalEHP = Health / (1 - (((0.06 * Armor)/(1 + (0.06 * Armor))) + ((this.hero.get("Items")?.get("Evasion") || 0) / 100)));

    /* Every hero has 25% base MR */
    MR += ((1-((this.hero.get("Stats")?.get("Base MR") || 25) * 0.01)) * (1 - ((this.hero.get("Items")?.get("MR") || 0) * 0.01)));
  
    this.MagicalEHP = Health / MR;
    /************/
    /* End EHP */
    /***********/

    /**********/
    /* Damage */
    /**********/

    let dmg: number = 0;
    let APS: number = 0;
    let DPS: number = 0;
    let BAT: number = this.hero.get("Stats")?.get("BAT") || 0;
    let primary: string;

    switch(this.hero.get("Stats")?.get("Primary") || 0) {
      case 1:
        primary = "Str";
        break;

      case 2:
        primary = "Int";
        break;

      default:
        primary = "Agi";
    }

    dmg += this.hero.get("Stats")?.get(primary) || 0;
    dmg += this.hero.get("Items")?.get(primary) || 0;

    dmg += this.hero.get("Stats")?.get("Base DMG") || 0;
    dmg += this.hero.get("Items")?.get("DMG") || 0;

    APS += this.hero.get("Stats")?.get("Base AS") || 0;
    APS += this.hero.get("Items")?.get("AS") || 0;
    APS += this.hero.get("Stats")?.get("Agi") || 0;
    APS += this.hero.get("Items")?.get("Agi") || 0;

    APS = APS/(100 * BAT);

    DPS = dmg * APS;

    this.Damage = dmg || 0;
    this.APS = Math.trunc((APS || 0) * 1000)/1000;
    this.DPS = Math.trunc((DPS || 0) * 1000)/1000;

    /***************/
    /* End Damage */
    /**************/

  } 

}
