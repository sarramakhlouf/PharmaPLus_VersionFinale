import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employe } from '../../../model/employe.model';
import { EmployeService } from '../../../services/employes.service';

@Component({
  selector: 'app-update-employes',
  templateUrl: './update-employes.component.html',
  styleUrls: ['./update-employes.component.css']
})
export class UpdateEmployesComponent implements OnInit {
  newEmploye: Employe | null = null;
  myForm!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private employeService: EmployeService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.params['id'];
    console.log('ID récupéré depuis la route :', id);

    this.employeService.consulterEmploye(id).subscribe(employe => {
      if (employe) {
        this.newEmploye = employe;
      } else {
        console.error('Employé non trouvé ou erreur de récupération.');
      }
    });

    if (!this.newEmploye) {
      console.error('Employé non trouvé');
      this.router.navigate(['/admin-dashboard/employes/lister']);
      return;
    }

    console.log('Employé trouvé :', this.newEmploye);

    this.initForm(this.newEmploye);
  }

  initForm(employe: Employe): void {
    this.myForm = this.formBuilder.group({
      idEmploye: [{ value: employe.idEmploye, disabled: true }, [Validators.required]],
      emailEmploye: [employe.emailEmploye, [Validators.required, Validators.email]],
      FullNameEmploye: [employe.FullNameEmploye, [Validators.required, Validators.minLength(3)]],
      dateNaissanceEmploye: [employe.dateNaissanceEmploye, [Validators.required]],
      NumTelEmploye: [employe.NumTelEmploye, [Validators.required, Validators.pattern('^[0-9]{8,10}$')]]
    });
  }

  modifierEmploye(): void {
    if (this.myForm.valid && this.newEmploye) {
      const updatedEmploye: Employe = {
        ...this.newEmploye,
        ...this.myForm.getRawValue() // Inclut les champs désactivés
      };

      console.log('Employé à modifier :', updatedEmploye);

      this.employeService.updateEmploye(updatedEmploye);
      this.router.navigate(['/admin-dashboard/employes/lister']);
    } else {
      console.error('Le formulaire n\'est pas valide ou employé non défini');
    }
  }
}
